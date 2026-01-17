"use strict";
/**
 * FLAME Lounge Bar - Database Configuration
 *
 * PostgreSQL em produção, SQLite em desenvolvimento
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = exports.closeConnection = exports.testConnection = void 0;
const sequelize_1 = require("sequelize");
const logger_1 = __importDefault(require("./logger"));
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
let sequelize;
if (process.env.DATABASE_URL) {
    // Produção: PostgreSQL via DATABASE_URL (Railway, Heroku, etc)
    const config = {
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
    exports.sequelize = sequelize = new sequelize_1.Sequelize(process.env.DATABASE_URL, config);
    logger_1.default.info('Database configured: PostgreSQL (production)', {
        host: new URL(process.env.DATABASE_URL).host,
        pool: poolConfig,
    });
}
else {
    // Desenvolvimento: SQLite local
    const config = {
        dialect: process.env.DB_DIALECT || 'sqlite',
        storage: process.env.DB_STORAGE || './database.sqlite',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: poolConfig,
    };
    exports.sequelize = sequelize = new sequelize_1.Sequelize(config);
    logger_1.default.info('Database configured: SQLite (development)', {
        storage: config.storage,
    });
}
/**
 * Testa conexão com o banco de dados
 * @returns Promise<boolean> - true se conectou, false se falhou
 */
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexão com banco de dados estabelecida com sucesso!');
        logger_1.default.info('Database connection successful');
        return true;
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('❌ Erro ao conectar com banco de dados:', errorMessage);
        logger_1.default.error('Database connection failed', error);
        return false;
    }
};
exports.testConnection = testConnection;
/**
 * Fecha a conexão com o banco de dados
 */
const closeConnection = async () => {
    try {
        await sequelize.close();
        logger_1.default.info('Database connection closed');
    }
    catch (error) {
        logger_1.default.error('Error closing database connection', error);
    }
};
exports.closeConnection = closeConnection;
exports.default = sequelize;
