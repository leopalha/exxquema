const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class InventoryMovement extends Model {
  // Obter descrição legível do tipo de movimento
  getTypeLabel() {
    const labels = {
      'entrada': 'Entrada em Estoque',
      'saida': 'Saída de Estoque',
      'ajuste': 'Ajuste Manual',
      'devolucao': 'Devolução'
    };
    return labels[this.type] || this.type;
  }

  // Obter descrição legível da razão
  getReasonLabel() {
    const labels = {
      'entrada_fornecedor': 'Entrada de Fornecedor',
      'venda': 'Venda',
      'ajuste_inventario': 'Ajuste de Inventário',
      'devolucao': 'Devolução do Cliente',
      'perda': 'Perda/Dano',
      'cortesia': 'Cortesia/Brinde',
      'reposicao': 'Reposição Interna'
    };
    return labels[this.reason] || this.reason;
  }

  // Calcular diferença de estoque
  getStockDifference() {
    return this.newStock - this.previousStock;
  }

  // Verificar se foi movimento de venda
  isSaleMovement() {
    return this.type === 'saida' && this.reason === 'venda';
  }
}

InventoryMovement.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'orders',
      key: 'id'
    },
    onDelete: 'SET NULL'
  },
  type: {
    type: DataTypes.TEXT, // TEXT para compatibilidade com SQLite
    allowNull: false,
    validate: {
      isIn: [['entrada', 'saida', 'ajuste', 'devolucao']]
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: true
    }
  },
  reason: {
    type: DataTypes.TEXT, // TEXT para compatibilidade com SQLite
    allowNull: false,
    validate: {
      isIn: [[
        'entrada_fornecedor',
        'venda',
        'ajuste_inventario',
        'devolucao',
        'perda',
        'cortesia',
        'reposicao'
      ]]
    }
  },
  previousStock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Quantidade de estoque antes do movimento'
  },
  newStock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Quantidade de estoque após o movimento'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Observações adicionais sobre o movimento'
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'SET NULL',
    comment: 'Usuário que realizou o movimento'
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'InventoryMovement',
  tableName: 'inventory_movements',
  timestamps: false, // Não usar updatedAt
  indexes: [
    {
      fields: ['productId']
    },
    {
      fields: ['orderId']
    },
    {
      fields: ['createdAt']
    },
    {
      fields: ['type']
    },
    {
      fields: ['reason']
    },
    {
      // Index composto para queries rápidas
      fields: ['productId', 'createdAt']
    }
  ]
});

module.exports = InventoryMovement;
