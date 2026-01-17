"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = require("../config/database");
/**
 * User Model
 */
class User extends sequelize_1.Model {
    /**
     * Verificar senha
     */
    async checkPassword(password) {
        if (!this.password)
            return false;
        return bcryptjs_1.default.compare(password, this.password);
    }
    /**
     * Remover dados sensíveis ao serializar
     */
    toJSON() {
        const values = { ...this.get() };
        delete values.password;
        delete values.smsCode;
        delete values.smsAttempts;
        delete values.smsCodeExpiry;
        return values;
    }
    /**
     * Verificar se usuário é admin
     */
    isAdmin() {
        return this.role === 'admin';
    }
    /**
     * Verificar se usuário é funcionário
     */
    isEmployee() {
        return ['admin', 'atendente', 'cozinha'].includes(this.role);
    }
    /**
     * Verificar se o perfil está completo
     */
    hasCompleteProfile() {
        // Google: Precisa apenas de nome + email (já vem do Google)
        if (this.authProvider === 'google') {
            return !!(this.nome && this.email && this.googleId);
        }
        // Local/Phone: Precisa de nome + email + profileComplete marcado
        return !!(this.nome && this.email && this.profileComplete);
    }
    /**
     * Calcular tier baseado em totalSpent
     */
    calculateTier() {
        const spent = parseFloat(String(this.totalSpent)) || 0;
        if (spent >= 10000)
            return 'platinum';
        if (spent >= 5000)
            return 'gold';
        if (spent >= 1000)
            return 'silver';
        return 'bronze';
    }
    /**
     * Atualizar tier automaticamente
     */
    async updateTier() {
        const newTier = this.calculateTier();
        if (this.loyaltyTier !== newTier) {
            this.loyaltyTier = newTier;
            await this.save();
            return newTier;
        }
        return null;
    }
    /**
     * Adicionar cashback
     */
    async addCashback(amount, orderId = null, description = null) {
        const balanceBefore = parseFloat(String(this.cashbackBalance)) || 0;
        this.cashbackBalance = parseFloat((balanceBefore + amount).toFixed(2));
        const balanceAfter = parseFloat(String(this.cashbackBalance));
        await this.updateTier();
        await this.save();
        // Registrar no histórico
        const CashbackHistory = require('./CashbackHistory');
        await CashbackHistory.create({
            userId: this.id,
            orderId,
            amount,
            type: 'earned',
            description,
            balanceBefore,
            balanceAfter
        });
    }
    /**
     * Usar cashback
     */
    async useCashback(maxAmount, description = 'Usado no pedido') {
        const balance = parseFloat(String(this.cashbackBalance)) || 0;
        const amountToUse = Math.min(balance, maxAmount);
        if (amountToUse <= 0) {
            return 0;
        }
        const balanceBefore = balance;
        this.cashbackBalance = parseFloat((balance - amountToUse).toFixed(2));
        const balanceAfter = parseFloat(String(this.cashbackBalance));
        await this.save();
        // Registrar no histórico
        const CashbackHistory = require('./CashbackHistory');
        await CashbackHistory.create({
            userId: this.id,
            amount: -amountToUse,
            type: 'redeemed',
            description,
            balanceBefore,
            balanceAfter
        });
        return amountToUse;
    }
    /**
     * Benefícios por tier
     */
    getTierBenefits() {
        const benefits = {
            bronze: {
                name: 'Bronze',
                cashbackRate: 1.5,
                perks: ['1,5% de cashback em todas as compras']
            },
            silver: {
                name: 'Prata',
                cashbackRate: 3,
                perks: ['3% de cashback', 'Prioridade em reservas', 'Suporte prioritário']
            },
            gold: {
                name: 'Ouro',
                cashbackRate: 4.5,
                perks: ['4,5% de cashback', 'Mesa reservada garantida', 'R$ 50 no aniversário']
            },
            platinum: {
                name: 'Platina',
                cashbackRate: 5,
                perks: ['5% de cashback', 'Mesa VIP garantida', 'R$ 100 no aniversário', 'Eventos exclusivos']
            }
        };
        return benefits[this.loyaltyTier] || benefits.bronze;
    }
    /**
     * Info para próximo tier
     */
    getNextTierInfo() {
        const spent = parseFloat(String(this.totalSpent)) || 0;
        const tierThresholds = {
            bronze: { next: 'silver', required: 1000 },
            silver: { next: 'gold', required: 5000 },
            gold: { next: 'platinum', required: 10000 },
            platinum: { next: null, required: null }
        };
        const info = tierThresholds[this.loyaltyTier];
        if (!info.next || !info.required) {
            return null;
        }
        return {
            currentTier: this.loyaltyTier,
            nextTier: info.next,
            requiredSpent: info.required,
            currentSpent: spent,
            remaining: Math.max(0, info.required - spent),
            progress: Math.min(100, (spent / info.required) * 100)
        };
    }
}
User.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    nome: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [2, 100]
        }
    },
    cpf: {
        type: sequelize_1.DataTypes.STRING(14),
        allowNull: true,
        unique: true,
        validate: {
            is: {
                args: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
                msg: 'CPF deve estar no formato 000.000.000-00'
            }
        }
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    celular: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        validate: {
            len: [6, 100]
        }
    },
    role: {
        type: sequelize_1.DataTypes.TEXT,
        defaultValue: 'cliente',
        allowNull: false,
        validate: {
            isIn: [['cliente', 'atendente', 'cozinha', 'bar', 'caixa', 'gerente', 'admin']]
        }
    },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true
    },
    emailVerified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    phoneVerified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    profileComplete: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    smsCode: {
        type: sequelize_1.DataTypes.STRING(6),
        allowNull: true
    },
    smsAttempts: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0
    },
    smsCodeExpiry: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    lastLogin: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    totalOrders: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0
    },
    totalSpent: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    lastVisit: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    lastOrderDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    googleId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    googleProfilePicture: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    authProvider: {
        type: sequelize_1.DataTypes.TEXT,
        defaultValue: 'local',
        allowNull: false,
        validate: {
            isIn: [['local', 'google']]
        }
    },
    cashbackBalance: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    loyaltyTier: {
        type: sequelize_1.DataTypes.TEXT,
        defaultValue: 'bronze',
        validate: {
            isIn: [['bronze', 'silver', 'gold', 'platinum']]
        }
    },
    birthDate: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: true
    },
    lastBirthdayBonusYear: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    },
    referralCode: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: true,
        unique: true
    },
    referredBy: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true
    },
    referralBonusGiven: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    totalReferrals: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0
    },
    countryCode: {
        type: sequelize_1.DataTypes.STRING(2),
        allowNull: true,
        defaultValue: 'BR'
    },
    phonePrefix: {
        type: sequelize_1.DataTypes.STRING(5),
        allowNull: true,
        defaultValue: '+55'
    }
}, {
    sequelize: database_1.sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    hooks: {
        beforeSave: async (user) => {
            // Hash password if changed
            if (user.changed('password') && user.password) {
                const salt = await bcryptjs_1.default.genSalt(10);
                user.password = await bcryptjs_1.default.hash(user.password, salt);
            }
        }
    }
});
exports.default = User;
