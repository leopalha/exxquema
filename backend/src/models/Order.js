"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
/**
 * Order Model
 */
class Order extends sequelize_1.Model {
    /**
     * Calcular total do pedido
     */
    calculateTotal() {
        return parseFloat(String(this.subtotal)) +
            parseFloat(String(this.serviceFee)) +
            parseFloat(String(this.taxes || 0));
    }
    /**
     * Verificar se pedido está atrasado (mais de 30 min)
     */
    isDelayed() {
        if (this.status === 'delivered' || this.status === 'cancelled')
            return false;
        const now = new Date();
        const orderTime = new Date(this.createdAt);
        const diffMinutes = (now.getTime() - orderTime.getTime()) / (1000 * 60);
        return diffMinutes > 30;
    }
    /**
     * Calcular tempo de preparo
     */
    getPreparationTime() {
        if (this.startedAt && this.finishedAt) {
            return Math.round((new Date(this.finishedAt).getTime() - new Date(this.startedAt).getTime()) / 60000);
        }
        return null;
    }
    /**
     * Verificar se pode ser cancelado
     */
    canBeCancelled() {
        return ['pending', 'pending_payment', 'confirmed'].includes(this.status);
    }
    /**
     * Obter próximo status válido
     */
    getNextValidStatus() {
        const statusFlow = {
            pending: 'confirmed',
            pending_payment: 'confirmed',
            confirmed: 'preparing',
            preparing: 'ready',
            ready: 'on_way',
            on_way: 'delivered'
        };
        return statusFlow[this.status];
    }
    /**
     * Verificar se é pagamento com atendente
     */
    isAttendantPayment() {
        return ['cash', 'pay_later', 'card_at_table', 'split'].includes(this.paymentMethod || '');
    }
}
Order.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    orderNumber: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        autoIncrement: true
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    tableId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'tables',
            key: 'id'
        }
    },
    status: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        defaultValue: 'pending',
        validate: {
            isIn: [[
                    'pending',
                    'pending_payment',
                    'confirmed',
                    'preparing',
                    'ready',
                    'on_way',
                    'delivered',
                    'cancelled'
                ]]
        }
    },
    paymentStatus: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        defaultValue: 'pending',
        validate: {
            isIn: [['pending', 'processing', 'completed', 'failed', 'refunded']]
        }
    },
    paymentMethod: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        validate: {
            isIn: [[
                    'credit_card',
                    'debit_card',
                    'pix',
                    'apple_pay',
                    'cash',
                    'pay_later',
                    'card_at_table',
                    'split'
                ]]
        }
    },
    paymentId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    subtotal: {
        type: sequelize_1.DataTypes.DECIMAL(8, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    serviceFee: {
        type: sequelize_1.DataTypes.DECIMAL(6, 2),
        allowNull: false,
        defaultValue: 0
    },
    taxes: {
        type: sequelize_1.DataTypes.DECIMAL(6, 2),
        allowNull: false,
        defaultValue: 0
    },
    total: {
        type: sequelize_1.DataTypes.DECIMAL(8, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    notes: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true
    },
    estimatedTime: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 20
    },
    confirmedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    startedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    finishedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    pickedUpAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    deliveredAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    cancelledAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    cancelledBy: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    preparationTime: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    },
    attendantId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    kitchenUserId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    rating: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 1,
            max: 5
        }
    },
    review: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true
    },
    isDelivered: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    cashbackUsed: {
        type: sequelize_1.DataTypes.DECIMAL(8, 2),
        allowNull: false,
        defaultValue: 0
    },
    discount: {
        type: sequelize_1.DataTypes.DECIMAL(8, 2),
        allowNull: false,
        defaultValue: 0
    },
    tip: {
        type: sequelize_1.DataTypes.DECIMAL(8, 2),
        allowNull: false,
        defaultValue: 0
    },
    wantsInstagramCashback: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize: database_1.sequelize,
    modelName: 'Order',
    tableName: 'orders',
    timestamps: true,
    indexes: [
        {
            fields: ['userId']
        },
        {
            fields: ['tableId']
        },
        {
            fields: ['status']
        },
        {
            fields: ['paymentStatus']
        },
        {
            fields: ['createdAt']
        }
    ]
});
exports.default = Order;
