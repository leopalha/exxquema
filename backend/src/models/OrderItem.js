const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class OrderItem extends Model {
  // Calcular subtotal do item
  getSubtotal() {
    return parseFloat(this.unitPrice) * parseInt(this.quantity);
  }

  // Verificar se tem observações especiais
  hasSpecialRequests() {
    return this.notes && this.notes.length > 0;
  }
}

OrderItem.init({
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
    }
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 50
    }
  },
  unitPrice: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  subtotal: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true // observações especiais do cliente
  },
  status: {
    type: DataTypes.TEXT, // TEXT para compatibilidade com SQLite
    allowNull: false,
    defaultValue: 'pending',
    validate: {
      isIn: [['pending', 'preparing', 'ready', 'delivered']]
    }
  },
  // Cópia dos dados do produto no momento do pedido
  productName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  productDescription: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  productImage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  productCategory: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'OrderItem',
  tableName: 'order_items',
  indexes: [
    {
      fields: ['orderId']
    },
    {
      fields: ['productId']
    },
    {
      fields: ['status']
    }
  ],
  hooks: {
    beforeSave: (orderItem) => {
      // Calcular subtotal automaticamente
      orderItem.subtotal = (parseFloat(orderItem.unitPrice) * parseInt(orderItem.quantity)).toFixed(2);
    }
  }
});

module.exports = OrderItem;