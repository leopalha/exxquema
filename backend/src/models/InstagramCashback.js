/**
 * Model: InstagramCashback
 * Sprint 44 - Cashback por posts no Instagram
 */

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class InstagramCashback extends Model {
    static associate(models) {
      InstagramCashback.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
      InstagramCashback.belongsTo(models.Order, {
        foreignKey: 'orderId',
        as: 'order'
      });
      // Staff que aprovou/rejeitou
      InstagramCashback.belongsTo(models.User, {
        foreignKey: 'approvedBy',
        as: 'approver'
      });
      InstagramCashback.belongsTo(models.User, {
        foreignKey: 'rejectedBy',
        as: 'rejecter'
      });
    }
  }

  InstagramCashback.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true, // Um pedido só pode ter uma solicitação
      references: {
        model: 'orders',
        key: 'id'
      }
    },
    instagramPostUrl: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        isUrl: true
      }
    },
    cashbackAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Valor do cashback (5% do pedido)'
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending',
      allowNull: false
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'Data limite para submeter o post'
    },
    approvedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    rejectedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    rejectedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    rejectionReason: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Motivo da rejeição'
    }
  }, {
    sequelize,
    modelName: 'InstagramCashback',
    tableName: 'instagram_cashbacks',
    timestamps: true,
    indexes: [
      { fields: ['userId'] },
      { fields: ['orderId'], unique: true },
      { fields: ['status'] }
    ]
  });

  return InstagramCashback;
};
