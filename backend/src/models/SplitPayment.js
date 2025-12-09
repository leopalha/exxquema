const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class SplitPayment extends Model {
  // Verificar se foi pago
  isPaid() {
    return this.status === 'paid';
  }

  // Verificar se pode ser cancelado
  canBeCancelled() {
    return this.status === 'pending';
  }
}

SplitPayment.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  percentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    comment: 'Percentual do total (0-100)'
  },
  status: {
    type: DataTypes.TEXT, // TEXT para compatibilidade SQLite
    allowNull: false,
    defaultValue: 'pending',
    validate: {
      isIn: [['pending', 'paid', 'cancelled']]
    }
  },
  paymentMethod: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'credit, debit, pix, cash, card_at_table'
  },
  paymentIntentId: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Stripe payment intent ID para pagamentos online'
  },
  paidAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'SplitPayment',
  tableName: 'split_payments',
  timestamps: true
});

module.exports = SplitPayment;
