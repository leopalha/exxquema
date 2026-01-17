/**
 * FLAME Lounge Bar - Database Configuration
 *
 * PostgreSQL em produção, SQLite em desenvolvimento
 */

import { Sequelize, Options } from 'sequelize';
import logger from './logger';

// Configuração do pool de conexões
const poolConfig = {
  max: parseInt(process.env.DB_POOL_MAX || '10', 10),
  min: parseInt(process.env.DB_POOL_MIN || '2', 10),
  acquire: parseInt(process.env.DB_POOL_ACQUIRE || '30000', 10),
  idle: parseInt(process.env.DB_POOL_IDLE || '10000', 10),
};

/**
 * Instância do Sequelize configurada
 */
let sequelize: Sequelize;

if (process.env.DATABASE_URL) {
  // Produção: PostgreSQL via DATABASE_URL (Railway, Heroku, etc)
  const config: Options = {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: poolConfig,
  };

  sequelize = new Sequelize(process.env.DATABASE_URL, config);

  logger.info('Database configured: PostgreSQL (production)', {
    host: new URL(process.env.DATABASE_URL).host,
    pool: poolConfig,
  });
} else {
  // Desenvolvimento: SQLite local
  const config: Options = {
    dialect: (process.env.DB_DIALECT as any) || 'sqlite',
    storage: process.env.DB_STORAGE || './database.sqlite',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: poolConfig,
  };

  sequelize = new Sequelize(config);

  logger.info('Database configured: SQLite (development)', {
    storage: config.storage,
  });
}

/**
 * Testa conexão com o banco de dados
 * @returns Promise<boolean> - true se conectou, false se falhou
 */
export const testConnection = async (): Promise<boolean> => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com banco de dados estabelecida com sucesso!');
    logger.info('Database connection successful');
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Erro ao conectar com banco de dados:', errorMessage);
    logger.error('Database connection failed', error as Error);
    return false;
  }
};

/**
 * Fecha a conexão com o banco de dados
 */
export const closeConnection = async (): Promise<void> => {
  try {
    await sequelize.close();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Error closing database connection', error as Error);
  }
};

export { sequelize };
export default sequelize;
