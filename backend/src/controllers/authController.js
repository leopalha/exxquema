const { User } = require('../models');
const { generateToken } = require('../middlewares/auth.middleware');
const smsService = require('../services/sms.service');
const { Op } = require('sequelize');

class AuthController {
  // Cadastro de usuário - Etapa 1: Dados básicos
  async register(req, res) {
    try {
      const { nome, cpf, email, celular } = req.body;

      // Verificar se já existe usuário com CPF, email ou celular
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [
            { cpf },
            { email },
            { celular }
          ]
        }
      });

      if (existingUser) {
        let field = 'dados';
        if (existingUser.cpf === cpf) field = 'CPF';
        else if (existingUser.email === email) field = 'E-mail';
        else if (existingUser.celular === celular) field = 'Celular';

        return res.status(409).json({
          success: false,
          message: `${field} já cadastrado no sistema`
        });
      }

      // Gerar código SMS
      const smsCode = smsService.generateSMSCode();
      const smsCodeExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos

      // Criar usuário (ainda não verificado)
      const user = await User.create({
        nome,
        cpf,
        email,
        celular,
        smsCode,
        smsCodeExpiry,
        smsAttempts: 0,
        phoneVerified: false,
        emailVerified: false,
        role: 'cliente'
      });

      // Enviar SMS
      const smsResult = await smsService.sendVerificationCode(celular, smsCode);

      if (!smsResult.success) {
        // Se falhou ao enviar SMS, apagar usuário criado
        await user.destroy();
        
        return res.status(500).json({
          success: false,
          message: 'Erro ao enviar código SMS',
          error: smsResult.error
        });
      }

      res.status(201).json({
        success: true,
        message: 'Usuário cadastrado! Código SMS enviado.',
        data: {
          userId: user.id,
          celular,
          smsExpiry: smsCodeExpiry
        }
      });
    } catch (error) {
      console.error('Erro no cadastro:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Validar código SMS - Etapa 2
  async verifySMS(req, res) {
    try {
      const { celular, code } = req.body;

      const user = await User.findOne({
        where: { celular }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      // Verificar se código expirou
      if (new Date() > user.smsCodeExpiry) {
        return res.status(400).json({
          success: false,
          message: 'Código SMS expirado. Solicite um novo código.'
        });
      }

      // Verificar tentativas
      if (user.smsAttempts >= 3) {
        return res.status(429).json({
          success: false,
          message: 'Muitas tentativas. Aguarde 15 minutos ou solicite novo código.'
        });
      }

      // Verificar código
      if (user.smsCode !== code) {
        // Incrementar tentativas
        await user.update({
          smsAttempts: user.smsAttempts + 1
        });

        return res.status(400).json({
          success: false,
          message: `Código incorreto. Tentativas restantes: ${2 - user.smsAttempts}`
        });
      }

      // Código correto - marcar celular como verificado
      await user.update({
        phoneVerified: true,
        smsCode: null,
        smsCodeExpiry: null,
        smsAttempts: 0
      });

      // Gerar token JWT
      const token = generateToken(user.id);

      // Enviar SMS de boas-vindas
      await smsService.sendWelcomeMessage(user.celular, user.nome);

      res.status(200).json({
        success: true,
        message: 'Cadastro concluído com sucesso!',
        data: {
          user: user.toJSON(),
          token
        }
      });
    } catch (error) {
      console.error('Erro na verificação SMS:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Reenviar código SMS
  async resendSMS(req, res) {
    try {
      const { celular } = req.body;

      const user = await User.findOne({
        where: { celular }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      if (user.phoneVerified) {
        return res.status(400).json({
          success: false,
          message: 'Celular já verificado'
        });
      }

      // Verificar limite de tentativas (máx 3 códigos por hora)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      if (user.updatedAt > oneHourAgo && user.smsAttempts >= 3) {
        return res.status(429).json({
          success: false,
          message: 'Limite de tentativas atingido. Tente novamente em 1 hora.'
        });
      }

      // Gerar novo código
      const smsCode = smsService.generateSMSCode();
      const smsCodeExpiry = new Date(Date.now() + 5 * 60 * 1000);

      // Enviar SMS
      const smsResult = await smsService.sendVerificationCode(celular, smsCode);

      if (!smsResult.success) {
        return res.status(500).json({
          success: false,
          message: 'Erro ao reenviar código SMS',
          error: smsResult.error
        });
      }

      // Atualizar usuário
      await user.update({
        smsCode,
        smsCodeExpiry,
        smsAttempts: 0
      });

      res.status(200).json({
        success: true,
        message: 'Novo código SMS enviado',
        data: {
          smsExpiry: smsCodeExpiry
        }
      });
    } catch (error) {
      console.error('Erro ao reenviar SMS:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Login via SMS (sem senha)
  async loginSMS(req, res) {
    try {
      const { celular } = req.body;

      const user = await User.findOne({
        where: { celular, isActive: true }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      if (!user.phoneVerified) {
        return res.status(400).json({
          success: false,
          message: 'Celular não verificado'
        });
      }

      // Gerar código SMS para login
      const smsCode = smsService.generateSMSCode();
      const smsCodeExpiry = new Date(Date.now() + 5 * 60 * 1000);

      const smsResult = await smsService.sendVerificationCode(celular, smsCode);

      if (!smsResult.success) {
        return res.status(500).json({
          success: false,
          message: 'Erro ao enviar código SMS',
          error: smsResult.error
        });
      }

      await user.update({
        smsCode,
        smsCodeExpiry,
        smsAttempts: 0
      });

      res.status(200).json({
        success: true,
        message: 'Código SMS enviado para login',
        data: {
          userId: user.id,
          smsExpiry: smsCodeExpiry
        }
      });
    } catch (error) {
      console.error('Erro no login SMS:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Login com email e senha
  async loginPassword(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({
        where: { 
          email: email.toLowerCase(),
          isActive: true 
        }
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Credenciais inválidas'
        });
      }

      if (!user.password) {
        return res.status(400).json({
          success: false,
          message: 'Usuário não possui senha. Use login por SMS.'
        });
      }

      const isPasswordValid = await user.checkPassword(password);
      
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Credenciais inválidas'
        });
      }

      // Atualizar último login
      await user.update({
        lastLogin: new Date()
      });

      const token = generateToken(user.id);

      res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso',
        data: {
          user: user.toJSON(),
          token
        }
      });
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Obter dados do usuário logado
  async getMe(req, res) {
    try {
      const user = await User.findByPk(req.user.id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      res.status(200).json({
        success: true,
        data: {
          user: user.toJSON()
        }
      });
    } catch (error) {
      console.error('Erro ao obter dados do usuário:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Atualizar perfil
  async updateProfile(req, res) {
    try {
      const { nome, email } = req.body;
      const user = await User.findByPk(req.user.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      const updatedData = {};
      
      if (nome && nome !== user.nome) {
        updatedData.nome = nome;
      }
      
      if (email && email !== user.email) {
        // Verificar se email já existe
        const emailExists = await User.findOne({
          where: { 
            email: email.toLowerCase(),
            id: { [Op.ne]: user.id }
          }
        });

        if (emailExists) {
          return res.status(409).json({
            success: false,
            message: 'Email já está em uso'
          });
        }

        updatedData.email = email.toLowerCase();
        updatedData.emailVerified = false; // Precisará verificar novamente
      }

      await user.update(updatedData);

      res.status(200).json({
        success: true,
        message: 'Perfil atualizado com sucesso',
        data: {
          user: user.toJSON()
        }
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Logout (invalidar token - implementação básica)
  async logout(req, res) {
    try {
      // Em uma implementação mais robusta, você manteria uma blacklist de tokens
      // Por ora, o logout é apenas no frontend (remover token)
      
      res.status(200).json({
        success: true,
        message: 'Logout realizado com sucesso'
      });
    } catch (error) {
      console.error('Erro no logout:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
}

module.exports = new AuthController();