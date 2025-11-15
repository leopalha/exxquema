const twilio = require('twilio');

class SMSService {
  constructor() {
    // Apenas inicializar Twilio se as credenciais estiverem configuradas
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) {
      this.client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      this.fromNumber = process.env.TWILIO_PHONE_NUMBER;
      this.enabled = true;
    } else {
      console.warn('⚠️  Twilio não configurado - SMS desabilitado (modo desenvolvimento)');
      this.enabled = false;
    }
  }

  // Gerar código SMS de 4 dígitos
  generateSMSCode() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  // Enviar código de verificação via SMS
  async sendVerificationCode(phoneNumber, code) {
    try {
      // Em modo desenvolvimento sem Twilio, apenas logar o código
      if (!this.enabled) {
        console.log(`📱 [DEV MODE] SMS para ${phoneNumber}: Código de verificação: ${code}`);
        return {
          success: true,
          sid: 'dev-mode-' + Date.now(),
          message: 'SMS simulado em modo desenvolvimento'
        };
      }

      // Formatar número para padrão internacional (+5521999999999)
      const formattedPhone = this.formatPhoneNumber(phoneNumber);

      const message = `Exxquema: Seu código de verificação é: ${code}. Válido por 5 minutos. Não compartilhe este código.`;

      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: formattedPhone
      });

      console.log(`SMS enviado com sucesso: ${result.sid}`);
      
      return {
        success: true,
        messageSid: result.sid,
        status: result.status
      };
    } catch (error) {
      console.error('Erro ao enviar SMS:', error);
      
      return {
        success: false,
        error: error.message,
        code: error.code || 'SMS_ERROR'
      };
    }
  }

  // Enviar SMS de boas-vindas
  async sendWelcomeMessage(phoneNumber, userName) {
    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      
      const message = `Olá ${userName}! Bem-vindo ao Exxquema! 🟠 Sua conta foi criada com sucesso. Aproveite nossa experiência única!`;
      
      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: formattedPhone
      });

      return {
        success: true,
        messageSid: result.sid
      };
    } catch (error) {
      console.error('Erro ao enviar SMS de boas-vindas:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Enviar notificação de pedido confirmado
  async sendOrderConfirmation(phoneNumber, orderNumber, estimatedTime) {
    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      
      const message = `Exxquema: Pedido #${orderNumber} confirmado! ✅ Tempo estimado: ${estimatedTime} min. Acompanhe em tempo real na plataforma.`;
      
      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: formattedPhone
      });

      return {
        success: true,
        messageSid: result.sid
      };
    } catch (error) {
      console.error('Erro ao enviar SMS de confirmação:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Enviar notificação de pedido pronto
  async sendOrderReady(phoneNumber, orderNumber) {
    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      
      const message = `Exxquema: Seu pedido #${orderNumber} está pronto! 🍸 Nosso atendente já está levando para sua mesa.`;
      
      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: formattedPhone
      });

      return {
        success: true,
        messageSid: result.sid
      };
    } catch (error) {
      console.error('Erro ao enviar SMS pedido pronto:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Formatar número de telefone para padrão internacional
  formatPhoneNumber(phoneNumber) {
    // Remove todos os caracteres não numéricos
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    // Se já tem código do país, retorna como está
    if (cleanPhone.startsWith('55') && cleanPhone.length === 13) {
      return `+${cleanPhone}`;
    }
    
    // Se não tem código do país, adiciona +55 (Brasil)
    if (cleanPhone.length === 11) {
      return `+55${cleanPhone}`;
    }
    
    // Se tem 10 dígitos, adiciona 9 no início (celular antigo)
    if (cleanPhone.length === 10) {
      return `+55${cleanPhone.substring(0, 2)}9${cleanPhone.substring(2)}`;
    }
    
    throw new Error('Formato de telefone inválido');
  }

  // Validar se número está no formato correto
  isValidPhoneNumber(phoneNumber) {
    try {
      this.formatPhoneNumber(phoneNumber);
      return true;
    } catch {
      return false;
    }
  }

  // Verificar status de uma mensagem enviada
  async getMessageStatus(messageSid) {
    try {
      const message = await this.client.messages(messageSid).fetch();
      
      return {
        success: true,
        status: message.status,
        errorCode: message.errorCode,
        errorMessage: message.errorMessage
      };
    } catch (error) {
      console.error('Erro ao verificar status SMS:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Listar últimas mensagens enviadas
  async getRecentMessages(limit = 20) {
    try {
      const messages = await this.client.messages.list({
        limit: limit,
        from: this.fromNumber
      });
      
      return {
        success: true,
        messages: messages.map(msg => ({
          sid: msg.sid,
          to: msg.to,
          body: msg.body,
          status: msg.status,
          dateCreated: msg.dateCreated
        }))
      };
    } catch (error) {
      console.error('Erro ao listar mensagens:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Instância singleton
const smsService = new SMSService();

module.exports = smsService;