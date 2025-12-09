const { DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('split_payments', {
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
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE'
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      percentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true
      },
      status: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: 'pending'
      },
      paymentMethod: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      paymentIntentId: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      paidAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Index para buscar por pedido
    await queryInterface.addIndex('split_payments', ['orderId']);

    // Index para buscar por usuario
    await queryInterface.addIndex('split_payments', ['userId']);

    // Index para buscar por status
    await queryInterface.addIndex('split_payments', ['status']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('split_payments');
  }
};
