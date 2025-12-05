const express = require('express');
const router = express.Router();
const { sequelize } = require('../config/database');

// Migration endpoint (should be protected in production!)
router.post('/cpf-optional', async (req, res) => {
  try {
    // Check if already migrated (lowercase table names in PostgreSQL)
    const [results] = await sequelize.query(`
      SELECT column_name, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'cpf';
    `);

    if (results.length > 0 && results[0].is_nullable === 'YES') {
      return res.status(200).json({
        success: true,
        message: 'Migração já aplicada - CPF já é opcional',
        alreadyMigrated: true
      });
    }

    // Run migration (lowercase table name for PostgreSQL)
    await sequelize.query(`
      ALTER TABLE "users"
      ALTER COLUMN "cpf" DROP NOT NULL;
    `);

    res.status(200).json({
      success: true,
      message: 'Migração aplicada com sucesso - CPF agora é opcional',
      migrated: true
    });
  } catch (error) {
    console.error('Erro na migração:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao executar migração',
      error: error.message
    });
  }
});

// Migration endpoint to extend smsCode column from 4 to 6 characters
router.post('/smscode-length', async (req, res) => {
  try {
    // Check current length
    const [results] = await sequelize.query(`
      SELECT column_name, character_maximum_length
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'smsCode';
    `);

    if (results.length > 0 && results[0].character_maximum_length === 6) {
      return res.status(200).json({
        success: true,
        message: 'Migração já aplicada - smsCode já tem 6 caracteres',
        alreadyMigrated: true
      });
    }

    // Run migration
    await sequelize.query(`
      ALTER TABLE "users"
      ALTER COLUMN "smsCode" TYPE VARCHAR(6);
    `);

    res.status(200).json({
      success: true,
      message: 'Migração aplicada com sucesso - smsCode agora tem 6 caracteres',
      migrated: true
    });
  } catch (error) {
    console.error('Erro na migração:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao executar migração',
      error: error.message
    });
  }
});

// Migration endpoint to extend celular column from 15 to 20 characters
router.post('/celular-length', async (req, res) => {
  try {
    // Check current length
    const [results] = await sequelize.query(`
      SELECT column_name, character_maximum_length
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'celular';
    `);

    if (results.length > 0 && results[0].character_maximum_length >= 20) {
      return res.status(200).json({
        success: true,
        message: 'Migração já aplicada - celular já tem 20+ caracteres',
        alreadyMigrated: true
      });
    }

    // Run migration
    await sequelize.query(`
      ALTER TABLE "users"
      ALTER COLUMN "celular" TYPE VARCHAR(20);
    `);

    res.status(200).json({
      success: true,
      message: 'Migração aplicada com sucesso - celular agora tem 20 caracteres',
      migrated: true
    });
  } catch (error) {
    console.error('Erro na migração:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao executar migração',
      error: error.message
    });
  }
});

// Update test user email endpoint
router.post('/update-test-user', async (req, res) => {
  try {
    const { celular, newEmail, newNome } = req.body;
    const secretKey = req.headers['x-migrate-key'] || req.body.secretKey;

    if (secretKey !== 'FLAME2024MIGRATE') {
      return res.status(403).json({
        success: false,
        message: 'Chave de migração inválida'
      });
    }

    if (!celular || !newEmail) {
      return res.status(400).json({
        success: false,
        message: 'celular e newEmail são obrigatórios'
      });
    }

    // Update user directly via SQL
    const [results, metadata] = await sequelize.query(`
      UPDATE "users"
      SET "email" = :newEmail, "nome" = COALESCE(:newNome, "nome")
      WHERE "celular" = :celular
      RETURNING id, nome, email, celular;
    `, {
      replacements: { celular, newEmail, newNome: newNome || null }
    });

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado com este celular'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Usuário atualizado com sucesso',
      data: results[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar usuário',
      error: error.message
    });
  }
});

// Migration endpoint to convert phone numbers to international format
router.post('/phone-format', async (req, res) => {
  try {
    const secretKey = req.headers['x-migrate-key'] || req.body.secretKey;

    if (secretKey !== 'FLAME2024MIGRATE') {
      return res.status(403).json({
        success: false,
        message: 'Chave de migração inválida'
      });
    }

    // First get all users with old format
    const [usersToUpdate] = await sequelize.query(`
      SELECT id, celular FROM "users" WHERE "celular" LIKE '(%';
    `);

    if (usersToUpdate.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Nenhum número para converter',
        count: 0
      });
    }

    // Update each user directly with raw SQL (bypass Sequelize validations)
    const results = [];
    for (const user of usersToUpdate) {
      // Extract only numbers from the phone
      const numbersOnly = user.celular.replace(/\D/g, '');
      const newCelular = '+55' + numbersOnly;

      // Use raw query without any Sequelize involvement
      await sequelize.query(
        `UPDATE "users" SET "celular" = $1 WHERE "id" = $2`,
        {
          bind: [newCelular, user.id],
          type: sequelize.QueryTypes.RAW
        }
      );

      results.push({
        id: user.id,
        oldCelular: user.celular,
        newCelular
      });
    }

    res.status(200).json({
      success: true,
      message: 'Números convertidos para formato internacional',
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('Erro na migração de formato:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao migrar formato de telefone',
      error: error.message
    });
  }
});

// Check migration status
router.get('/status', async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SELECT column_name, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'users'
      AND column_name IN ('cpf', 'email', 'celular', 'password');
    `);

    res.status(200).json({
      success: true,
      columns: results
    });
  } catch (error) {
    console.error('Erro ao verificar status:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao verificar status',
      error: error.message
    });
  }
});

// List users with old phone format
router.get('/phone-format/list', async (req, res) => {
  try {
    const [users] = await sequelize.query(`
      SELECT id, nome, email, celular FROM "users"
      WHERE "celular" LIKE '(%' OR "celular" NOT LIKE '+%';
    `);

    res.status(200).json({
      success: true,
      count: users.length,
      users: users
    });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao listar usuários',
      error: error.message
    });
  }
});

// Direct SQL migration - update specific user phone
router.post('/phone-format/update-single', async (req, res) => {
  try {
    const secretKey = req.headers['x-migrate-key'] || req.body.secretKey;
    const { userId, newCelular } = req.body;

    if (secretKey !== 'FLAME2024MIGRATE') {
      return res.status(403).json({
        success: false,
        message: 'Chave de migração inválida'
      });
    }

    if (!userId || !newCelular) {
      return res.status(400).json({
        success: false,
        message: 'userId e newCelular são obrigatórios'
      });
    }

    // Use raw SQL with transaction
    const transaction = await sequelize.transaction();
    try {
      await sequelize.query(
        `UPDATE "users" SET "celular" = '${newCelular}' WHERE "id" = '${userId}'`,
        { transaction, type: sequelize.QueryTypes.UPDATE }
      );

      await transaction.commit();

      // Verify
      const [updated] = await sequelize.query(
        `SELECT id, nome, email, celular FROM "users" WHERE "id" = '${userId}'`
      );

      res.status(200).json({
        success: true,
        message: 'Celular atualizado com sucesso',
        user: updated[0]
      });
    } catch (txError) {
      await transaction.rollback();
      throw txError;
    }
  } catch (error) {
    console.error('Erro ao atualizar celular:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar celular',
      error: error.message,
      stack: error.stack
    });
  }
});

// Migration using pg client directly (bypassing Sequelize completely)
router.post('/phone-format/direct', async (req, res) => {
  try {
    const secretKey = req.headers['x-migrate-key'] || req.body.secretKey;

    if (secretKey !== 'FLAME2024MIGRATE') {
      return res.status(403).json({
        success: false,
        message: 'Chave de migração inválida'
      });
    }

    // Get database connection pool directly
    const pool = sequelize.connectionManager.pool;

    // Get users with old format
    const [usersToUpdate] = await sequelize.query(`
      SELECT id, celular FROM "users" WHERE "celular" LIKE '(%';
    `);

    if (usersToUpdate.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Nenhum número para converter',
        count: 0
      });
    }

    const results = [];
    const errors = [];

    for (const user of usersToUpdate) {
      try {
        // Extract only numbers from the phone
        const numbersOnly = user.celular.replace(/\D/g, '');
        const newCelular = '+55' + numbersOnly;

        // Execute raw SQL directly
        await sequelize.query(
          `UPDATE "users" SET "celular" = $1 WHERE "id" = $2::uuid`,
          {
            bind: [newCelular, user.id],
            type: sequelize.QueryTypes.UPDATE,
            raw: true
          }
        );

        results.push({
          id: user.id,
          oldCelular: user.celular,
          newCelular,
          success: true
        });
      } catch (userError) {
        errors.push({
          id: user.id,
          oldCelular: user.celular,
          error: userError.message
        });
      }
    }

    res.status(200).json({
      success: errors.length === 0,
      message: `${results.length} números convertidos, ${errors.length} erros`,
      results,
      errors
    });
  } catch (error) {
    console.error('Erro na migração direta:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao migrar formato de telefone',
      error: error.message,
      stack: error.stack
    });
  }
});

module.exports = router;
