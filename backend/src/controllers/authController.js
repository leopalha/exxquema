const { User } = require('../models');
const { generateToken } = require('../middlewares/auth.middleware');
const smsService = require('../services/sms.service');
const googleService = require('../services/google.service');
const { Op } = require('sequelize');

class AuthController {
  // Cadastro de usuário - Etapa 1: Dados básicos
  // Sprint 41: Adicionado suporte a birthDate, countryCode, foreignId
  async register(req, res) {
    try {
      const { nome, cpf, email, celular, password, birthDate, countryCode, foreignId } = req.body;

      // Verificar se já existe usuário com CPF, email ou celular
      const whereConditions = [
        { email },
        { celular }
      ];

      // Adicionar CPF na verificação apenas se fornecido
      if (cpf) {
        whereConditions.push({ cpf });
      }

      const existingUser = await User.findOne({
        where: {
          [Op.or]: whereConditions
        }
      });

      if (existingUser) {
        let field = 'dados';
        let conflictValue = '';
        if (cpf && existingUser.cpf === cpf) {
          field = 'CPF';
          conflictValue = cpf;
        } else if (existingUser.email === email) {
          field = 'E-mail';
          conflictValue = email;
        } else if (existingUser.celular === celular) {
          field = 'Celular';
          conflictValue = celular;
        }

        return res.status(409).json({
          success: false,
          message: `${field} já cadastrado no sistema`,
          conflictField: field.toLowerCase(),
          conflictValue
        });
      }

      // Validar idade mínima (18 anos)
      if (birthDate) {
        const birth = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
          age--;
        }
        if (age < 18) {
          return res.status(400).json({
            success: false,
            message: 'Você deve ter pelo menos 18 anos para se cadastrar'
          });
        }
      }

      // Gerar código SMS
      const smsCode = smsService.generateSMSCode();
      const smsCodeExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos

      // Criar usuário (ainda não verificado)
      const userData = {
        nome,
        email,
        celular,
        password, // Senha será hashada automaticamente pelo hook beforeCreate do modelo
        smsCode,
        smsCodeExpiry,
        smsAttempts: 0,
        phoneVerified: false,
        emailVerified: false,
        profileComplete: true, // Perfil completo quando cadastra com todos os dados
        role: 'cliente'
      };

      // Adicionar CPF apenas se fornecido (brasileiros)
      if (cpf) {
        userData.cpf = cpf;
      }

      // Adicionar campos Sprint 41
      if (birthDate) {
        userData.birthDate = birthDate;
      }
      if (countryCode) {
        userData.countryCode = countryCode;
      }
      if (foreignId) {
        userData.foreignId = foreignId;
      }

      const user = await User.create(userData);

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
        error: error.message, // Temporariamente retornar em produção para debug
        details: error.stack
      });
    }
  }

  // Cadastro apenas por telefone - Etapa 1
  async registerPhone(req, res) {
    try {
      const { celular } = req.body;

      // Verificar se já existe usuário com este celular
      const existingUser = await User.findOne({
        where: { celular }
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Celular já cadastrado no sistema',
          conflictField: 'celular',
          conflictValue: celular
        });
      }

      // Gerar código SMS
      const smsCode = smsService.generateSMSCode();
      const smsCodeExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos

      // Criar usuário com dados mínimos (apenas celular)
      const user = await User.create({
        nome: `Usuário ${celular.slice(-4)}`, // Nome temporário
        celular,
        smsCode,
        smsCodeExpiry,
        smsAttempts: 0,
        phoneVerified: false,
        emailVerified: false,
        profileComplete: false, // Perfil incompleto
        role: 'cliente'
        // email e password ficam null
      });

      // Enviar SMS
      const smsResult = await smsService.sendVerificationCode(celular, smsCode);

      if (!smsResult.success) {
        // Se falhou ao enviar SMS, apagar usuário criado
        await user.destroy();

        console.error('❌ REGISTER PHONE: Erro ao enviar SMS:', smsResult.error);
        return res.status(500).json({
          success: false,
          message: 'Erro ao enviar código SMS',
          error: smsResult.error
        });
      }

      res.status(201).json({
        success: true,
        message: 'Código SMS enviado! Complete seu cadastro após verificar o celular.',
        data: {
          userId: user.id,
          celular,
          smsExpiry: smsCodeExpiry,
          requiresProfileCompletion: true
        }
      });
    } catch (error) {
      console.error('❌ REGISTER PHONE: Erro:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message,
        details: error.stack
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

  // Login via SMS (sem senha) - Cria usuário se não existir
  async loginSMS(req, res) {
    try {
      const { celular } = req.body;

      let user = await User.findOne({
        where: { celular, isActive: true }
      });

      let isNewUser = false;

      // SE USUÁRIO NÃO EXISTE: Criar automaticamente
      if (!user) {
        // Gerar código SMS
        const smsCode = smsService.generateSMSCode();
        const smsCodeExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos

        // Criar usuário com dados mínimos (apenas celular)
        user = await User.create({
          nome: `Usuário ${celular.slice(-4)}`, // Nome temporário
          celular,
          smsCode,
          smsCodeExpiry,
          smsAttempts: 0,
          phoneVerified: false,
          emailVerified: false,
          profileComplete: false, // Perfil incompleto - vai pedir para completar depois
          role: 'cliente'
        });

        isNewUser = true;

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

        return res.status(200).json({
          success: true,
          message: 'Código SMS enviado! Após verificar, complete seu cadastro.',
          data: {
            userId: user.id,
            smsExpiry: smsCodeExpiry,
            isNewUser: true,
            requiresProfileCompletion: true
          }
        });
      }

      // USUÁRIO EXISTE: Enviar código de login
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
          smsExpiry: smsCodeExpiry,
          isNewUser: false,
          requiresProfileCompletion: !user.profileComplete
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
      const { email, password, identifier } = req.body;

      // Aceitar tanto email quanto identifier
      const loginEmail = email || identifier;

      if (!loginEmail) {
        return res.status(400).json({
          success: false,
          message: 'Email é obrigatório'
        });
      }

      const user = await User.findOne({
        where: {
          email: loginEmail.toLowerCase(),
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

      // Sprint 59: Calcular status do Instagram Cashback
      let instagramCashbackStatus = {
        canParticipate: true,
        isFirstTime: !user.cashbackEnabled || user.instagramValidationsCount === 0,
        lastParticipation: user.lastInstagramCashbackAt,
        nextAvailable: null,
        daysUntilAvailable: 0,
        totalValidations: user.instagramValidationsCount || 0,
        cashbackEnabled: user.cashbackEnabled || false
      };

      // Verificar se pode participar esta semana
      if (user.lastInstagramCashbackAt) {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        if (new Date(user.lastInstagramCashbackAt) > oneWeekAgo) {
          instagramCashbackStatus.canParticipate = false;
          const nextAvailable = new Date(user.lastInstagramCashbackAt);
          nextAvailable.setDate(nextAvailable.getDate() + 7);
          instagramCashbackStatus.nextAvailable = nextAvailable;
          instagramCashbackStatus.daysUntilAvailable = Math.ceil((nextAvailable - new Date()) / (1000 * 60 * 60 * 24));
        }
      }

      res.status(200).json({
        success: true,
        data: {
          user: user.toJSON(),
          instagramCashbackStatus
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

  // Solicitar recuperação de senha (envia código SMS)
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email é obrigatório'
        });
      }

      const user = await User.findOne({
        where: { email: email.toLowerCase(), isActive: true }
      });

      // Sempre retornar sucesso para não revelar se email existe
      if (!user) {
        return res.status(200).json({
          success: true,
          message: 'Se o email estiver cadastrado, você receberá um código SMS'
        });
      }

      // Gerar código de reset (6 dígitos para maior segurança)
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      const resetCodeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

      // Salvar código no usuário (reutilizando campos SMS)
      await user.update({
        smsCode: resetCode,
        smsCodeExpiry: resetCodeExpiry,
        smsAttempts: 0
      });

      // Enviar SMS com código de reset
      const smsResult = await smsService.sendPasswordResetCode(user.celular, resetCode);

      if (!smsResult.success) {
        console.error('Erro ao enviar SMS de reset:', smsResult.error);
      }

      res.status(200).json({
        success: true,
        message: 'Se o email estiver cadastrado, você receberá um código SMS',
        data: {
          // Em produção, não enviar celular ofuscado
          hint: user.celular ? `****${user.celular.slice(-4)}` : null
        }
      });
    } catch (error) {
      console.error('Erro no forgot password:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Verificar código de reset
  async verifyResetCode(req, res) {
    try {
      const { email, code } = req.body;

      if (!email || !code) {
        return res.status(400).json({
          success: false,
          message: 'Email e código são obrigatórios'
        });
      }

      const user = await User.findOne({
        where: { email: email.toLowerCase(), isActive: true }
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Código inválido ou expirado'
        });
      }

      // Verificar se código expirou
      if (!user.smsCodeExpiry || new Date() > user.smsCodeExpiry) {
        return res.status(400).json({
          success: false,
          message: 'Código expirado. Solicite um novo código.'
        });
      }

      // Verificar tentativas
      if (user.smsAttempts >= 5) {
        return res.status(429).json({
          success: false,
          message: 'Muitas tentativas. Aguarde 15 minutos ou solicite novo código.'
        });
      }

      // Verificar código
      if (user.smsCode !== code) {
        await user.update({
          smsAttempts: user.smsAttempts + 1
        });

        return res.status(400).json({
          success: false,
          message: 'Código incorreto'
        });
      }

      // Código válido - gerar token temporário para reset
      const crypto = require('crypto');
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

      // Salvar token temporário (reutilizando smsCode)
      await user.update({
        smsCode: resetToken,
        smsCodeExpiry: resetTokenExpiry,
        smsAttempts: 0
      });

      res.status(200).json({
        success: true,
        message: 'Código verificado com sucesso',
        data: {
          resetToken
        }
      });
    } catch (error) {
      console.error('Erro ao verificar código de reset:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Redefinir senha
  async resetPassword(req, res) {
    try {
      const { email, resetToken, newPassword } = req.body;

      if (!email || !resetToken || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Email, token e nova senha são obrigatórios'
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'A senha deve ter pelo menos 6 caracteres'
        });
      }

      const user = await User.findOne({
        where: { email: email.toLowerCase(), isActive: true }
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Token inválido ou expirado'
        });
      }

      // Verificar token
      if (!user.smsCode || user.smsCode !== resetToken) {
        return res.status(400).json({
          success: false,
          message: 'Token inválido ou expirado'
        });
      }

      // Verificar se token expirou
      if (!user.smsCodeExpiry || new Date() > user.smsCodeExpiry) {
        return res.status(400).json({
          success: false,
          message: 'Token expirado. Inicie o processo novamente.'
        });
      }

      // Atualizar senha
      await user.update({
        password: newPassword,
        smsCode: null,
        smsCodeExpiry: null,
        smsAttempts: 0
      });

      // Gerar novo token de login
      const token = generateToken(user.id);

      res.status(200).json({
        success: true,
        message: 'Senha redefinida com sucesso!',
        data: {
          user: user.toJSON(),
          token
        }
      });
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Completar perfil após cadastro por telefone
  async completeProfile(req, res) {
    try {
      const { nome, email, cpf, password } = req.body;
      const userId = req.user.id;

      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      // Verificar se já completou o perfil
      if (user.profileComplete) {
        return res.status(400).json({
          success: false,
          message: 'Perfil já está completo'
        });
      }

      // Validar campos obrigatórios
      if (!nome || !email) {
        return res.status(400).json({
          success: false,
          message: 'Nome e email são obrigatórios'
        });
      }

      // Verificar se email já existe (por outro usuário)
      if (email) {
        const emailExists = await User.findOne({
          where: {
            email: email.toLowerCase(),
            id: { [Op.ne]: userId }
          }
        });

        if (emailExists) {
          return res.status(409).json({
            success: false,
            message: 'Email já está em uso por outro usuário'
          });
        }
      }

      // Verificar se CPF já existe (por outro usuário) - se fornecido
      if (cpf) {
        // Validar formato do CPF
        const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
        if (!cpfRegex.test(cpf)) {
          return res.status(400).json({
            success: false,
            message: 'CPF deve estar no formato 000.000.000-00'
          });
        }

        const cpfExists = await User.findOne({
          where: {
            cpf,
            id: { [Op.ne]: userId }
          }
        });

        if (cpfExists) {
          return res.status(409).json({
            success: false,
            message: 'CPF já está em uso por outro usuário'
          });
        }
      }

      // Atualizar perfil
      const updateData = {
        nome,
        email: email.toLowerCase(),
        profileComplete: true,
        emailVerified: false
      };

      // Adicionar CPF se fornecido
      if (cpf) {
        updateData.cpf = cpf;
      }

      // Adicionar senha se fornecida
      if (password) {
        if (password.length < 6) {
          return res.status(400).json({
            success: false,
            message: 'Senha deve ter pelo menos 6 caracteres'
          });
        }
        updateData.password = password;
      }

      await user.update(updateData);

      res.status(200).json({
        success: true,
        message: 'Perfil completado com sucesso! Agora você pode fazer pedidos.',
        data: {
          user: user.toJSON()
        }
      });
    } catch (error) {
      console.error('❌ COMPLETE PROFILE: Erro:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  // Autenticar/Cadastrar com Google OAuth 2.0
  async googleAuth(req, res) {
    try {
      const { credential } = req.body;

      if (!credential) {
        return res.status(400).json({
          success: false,
          message: 'Credential do Google é obrigatório'
        });
      }

      // 1. Validar token com Google
      const googleUser = await googleService.verifyToken(credential);
      const { sub: googleId, email, name, picture } = googleUser;

      // 2. Buscar usuário por googleId OU email
      let user = await User.findOne({
        where: {
          [Op.or]: [{ googleId }, { email }]
        }
      });

      let isNewUser = false;

      // 3. SE NÃO EXISTIR: Criar novo
      if (!user) {
        user = await User.create({
          googleId,
          email,
          nome: name,
          googleProfilePicture: picture,
          authProvider: 'google',
          profileComplete: true,  // Google já fornece nome + email
          phoneVerified: false,   // Celular não fornecido
          emailVerified: true,    // Google garante email verificado
          role: 'cliente'
        });
        isNewUser = true;
      }
      // 4. SE EXISTIR MAS SEM GOOGLE_ID: Vincular conta
      else if (!user.googleId) {
        await user.update({
          googleId,
          googleProfilePicture: picture,
          authProvider: 'google'
        });
      }

      // 5. Gerar JWT
      const token = generateToken(user.id);

      // 6. Atualizar último login
      await user.update({ lastLogin: new Date() });

      // 7. Retornar
      res.status(200).json({
        success: true,
        message: isNewUser ? 'Cadastro realizado com sucesso!' : 'Login realizado com sucesso',
        data: {
          user: user.toJSON(),
          token,
          isNewUser,
          needsPhone: !user.celular  // Sugestão: adicionar celular
        }
      });
    } catch (error) {
      console.error('❌ GOOGLE AUTH ERROR:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao autenticar com Google',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  // Deletar usuário não verificado (temporário para testes)
  async deleteUnverifiedUser(req, res) {
    try {
      const { email } = req.params;

      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      // Apenas deletar se não estiver verificado
      if (user.verificado) {
        return res.status(403).json({
          success: false,
          message: 'Usuário já verificado, não pode ser deletado por esta rota'
        });
      }

      await user.destroy();

      res.json({
        success: true,
        message: `Usuário ${email} deletado com sucesso`
      });
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao deletar usuário'
      });
    }
  }

  /**
   * DEBUG: Ver código SMS de um usuário (REMOVER EM PRODUÇÃO)
   */
  async debugSMSCode(req, res) {
    try {
      const { celular } = req.params;

      const user = await User.findOne({
        where: { celular },
        attributes: ['id', 'nome', 'celular', 'smsCode', 'smsCodeExpiry']
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      res.json({
        success: true,
        data: {
          celular: user.celular,
          smsCode: user.smsCode,
          smsCodeExpiry: user.smsCodeExpiry,
          isExpired: user.smsCodeExpiry < new Date()
        }
      });
    } catch (error) {
      console.error('Erro ao buscar código SMS:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar código SMS'
      });
    }
  }

  // Sprint 61: Deletar conta do usuário (soft delete - desativa a conta)
  async deleteAccount(req, res) {
    try {
      const userId = req.user.id;
      const { confirmPassword } = req.body;

      // Buscar usuário
      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      // Se o usuário tem senha, verificar a senha de confirmação
      if (user.password) {
        if (!confirmPassword) {
          return res.status(400).json({
            success: false,
            message: 'Senha de confirmação é obrigatória'
          });
        }

        const isValidPassword = await user.comparePassword(confirmPassword);
        if (!isValidPassword) {
          return res.status(401).json({
            success: false,
            message: 'Senha incorreta'
          });
        }
      }

      // Soft delete: desativar conta ao invés de deletar
      // Mantém dados para compliance e histórico de pedidos
      await user.update({
        isActive: false,
        deletedAt: new Date(),
        // Anonimizar dados sensíveis
        email: `deleted_${user.id}@flame.deleted`,
        celular: `deleted_${user.id}`,
        cpf: null,
        nome: 'Usuário Excluído'
      });

      res.json({
        success: true,
        message: 'Conta excluída com sucesso. Seus dados foram anonimizados.'
      });
    } catch (error) {
      console.error('Erro ao deletar conta:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao excluir conta'
      });
    }
  }
}

module.exports = new AuthController();