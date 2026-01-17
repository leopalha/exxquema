const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FLAME Lounge API',
      version: '2.0.0',
      description: 'API completa do FLAME Lounge Bar & Restaurant com Cashback e Split Payment'
    },
    servers: [
      { url: 'http://localhost:7000', description: 'Development' },
      { url: 'https://backend-production-4fdc.up.railway.app', description: 'Production (Railway)' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const setupSwagger = (app) => {
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('📚 Swagger API Docs: http://localhost:7000/api-docs');
};

module.exports = { setupSwagger };
