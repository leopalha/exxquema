/**
 * FLAME Lounge Bar - Swagger API Documentation
 *
 * Configuração do Swagger UI para documentação interativa da API
 */

const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'FLAME Lounge Bar API',
    version: '2.0.0',
    description: 'API REST completa para o sistema FLAME Lounge Bar - Gestão de pedidos, pagamentos, reservas e cashback',
    contact: {
      name: 'FLAME Lounge Bar',
      url: 'https://flamelounge.com.br',
      email: 'contato@flamelounge.com.br',
    },
    license: {
      name: 'Proprietary',
      url: 'https://flamelounge.com.br/license',
    },
  },
  servers: [
    {
      url: process.env.BACKEND_URL || 'http://localhost:5000',
      description: 'Servidor de Produção',
    },
    {
      url: 'http://localhost:5000',
      description: 'Servidor de Desenvolvimento',
    },
  ],
  tags: [
    {
      name: 'Auth',
      description: 'Autenticação e autorização de usuários',
    },
    {
      name: 'Products',
      description: 'Gestão de produtos do cardápio',
    },
    {
      name: 'Orders',
      description: 'Gestão de pedidos e ciclo de vida',
    },
    {
      name: 'Payments',
      description: 'Processamento de pagamentos (Stripe, PIX, Dinheiro)',
    },
    {
      name: 'Reservations',
      description: 'Sistema de reservas de mesas',
    },
    {
      name: 'Cashback',
      description: 'Programa de fidelidade e cashback',
    },
    {
      name: 'Users',
      description: 'Gestão de usuários e perfis',
    },
    {
      name: 'Admin',
      description: 'Funcionalidades administrativas',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token JWT de autenticação (obtenha via POST /api/auth/login)',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          message: {
            type: 'string',
            example: 'Mensagem de erro descritiva',
          },
          error: {
            type: 'string',
            example: 'Detalhes técnicos do erro',
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 1,
          },
          nome: {
            type: 'string',
            example: 'João Silva',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'joao@email.com',
          },
          telefone: {
            type: 'string',
            example: '11999887766',
          },
          role: {
            type: 'string',
            enum: ['admin', 'staff', 'customer'],
            example: 'customer',
          },
          cashbackBalance: {
            type: 'number',
            format: 'float',
            example: 25.5,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      Product: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 1,
          },
          name: {
            type: 'string',
            example: 'Caipirinha Clássica',
          },
          description: {
            type: 'string',
            example: 'Cachaça, limão, açúcar e gelo',
          },
          price: {
            type: 'number',
            format: 'float',
            example: 18.9,
          },
          category: {
            type: 'string',
            enum: ['drinks', 'food', 'narguile', 'special'],
            example: 'drinks',
          },
          imageUrl: {
            type: 'string',
            format: 'uri',
            example: 'https://example.com/image.jpg',
          },
          available: {
            type: 'boolean',
            example: true,
          },
          hasStock: {
            type: 'boolean',
            example: true,
          },
          stock: {
            type: 'integer',
            example: 50,
          },
        },
      },
      Order: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 1,
          },
          orderNumber: {
            type: 'string',
            example: 'ORD-2026-001',
          },
          userId: {
            type: 'integer',
            example: 1,
          },
          tableId: {
            type: 'integer',
            nullable: true,
            example: 5,
          },
          status: {
            type: 'string',
            enum: ['pending', 'pending_payment', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
            example: 'confirmed',
          },
          paymentMethod: {
            type: 'string',
            enum: ['pix', 'credit', 'debit', 'cash', 'pay_later'],
            example: 'pix',
          },
          paymentStatus: {
            type: 'string',
            enum: ['pending', 'paid', 'failed', 'refunded'],
            example: 'paid',
          },
          subtotal: {
            type: 'number',
            format: 'float',
            example: 85.5,
          },
          cashbackDiscount: {
            type: 'number',
            format: 'float',
            example: 10.0,
          },
          tip: {
            type: 'number',
            format: 'float',
            example: 8.55,
          },
          total: {
            type: 'number',
            format: 'float',
            example: 84.05,
          },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                productId: {
                  type: 'integer',
                  example: 1,
                },
                productName: {
                  type: 'string',
                  example: 'Caipirinha Clássica',
                },
                quantity: {
                  type: 'integer',
                  example: 2,
                },
                price: {
                  type: 'number',
                  format: 'float',
                  example: 18.9,
                },
              },
            },
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      Reservation: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 1,
          },
          userId: {
            type: 'integer',
            example: 1,
          },
          date: {
            type: 'string',
            format: 'date',
            example: '2026-01-20',
          },
          time: {
            type: 'string',
            format: 'time',
            example: '20:00',
          },
          guests: {
            type: 'integer',
            example: 4,
          },
          status: {
            type: 'string',
            enum: ['pending', 'confirmed', 'cancelled', 'completed'],
            example: 'confirmed',
          },
          specialRequests: {
            type: 'string',
            example: 'Mesa próxima à janela',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  // Caminho para os arquivos com anotações JSDoc
  apis: [
    './src/routes/*.js',
    './src/controllers/*.js',
    './src/models/*.js',
  ],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
