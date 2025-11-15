const { sequelize } = require('../config/database');

// Import models
const User = require('./User');
const Product = require('./Product');
const Table = require('./Table');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// Define associations
const defineAssociations = () => {
  // User associations
  User.hasMany(Order, { 
    foreignKey: 'userId', 
    as: 'orders' 
  });
  
  User.hasMany(Order, { 
    foreignKey: 'attendantId', 
    as: 'attendedOrders' 
  });
  
  User.hasMany(Order, { 
    foreignKey: 'kitchenUserId', 
    as: 'preparedOrders' 
  });

  // Table associations
  Table.hasMany(Order, { 
    foreignKey: 'tableId', 
    as: 'orders' 
  });

  // Order associations
  Order.belongsTo(User, { 
    foreignKey: 'userId', 
    as: 'customer' 
  });
  
  Order.belongsTo(Table, { 
    foreignKey: 'tableId', 
    as: 'table' 
  });
  
  Order.belongsTo(User, { 
    foreignKey: 'attendantId', 
    as: 'attendant' 
  });
  
  Order.belongsTo(User, { 
    foreignKey: 'kitchenUserId', 
    as: 'kitchenUser' 
  });

  Order.hasMany(OrderItem, { 
    foreignKey: 'orderId', 
    as: 'items' 
  });

  // Product associations
  Product.hasMany(OrderItem, { 
    foreignKey: 'productId', 
    as: 'orderItems' 
  });

  // OrderItem associations
  OrderItem.belongsTo(Order, { 
    foreignKey: 'orderId', 
    as: 'order' 
  });
  
  OrderItem.belongsTo(Product, { 
    foreignKey: 'productId', 
    as: 'product' 
  });
};

// Initialize associations
defineAssociations();

// Sync database
const syncDatabase = async (options = {}) => {
  try {
    await sequelize.sync(options);
    console.log('✅ Banco de dados sincronizado com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ Erro ao sincronizar banco de dados:', error);
    return false;
  }
};

// Create database tables
const createTables = async () => {
  try {
    // Create tables in the correct order (respecting foreign keys)
    // Using { alter: false } to prevent infinite loop
    await User.sync();
    console.log('✅ Tabela users criada/atualizada');

    await Product.sync();
    console.log('✅ Tabela products criada/atualizada');

    await Table.sync();
    console.log('✅ Tabela tables criada/atualizada');

    await Order.sync();
    console.log('✅ Tabela orders criada/atualizada');

    await OrderItem.sync();
    console.log('✅ Tabela order_items criada/atualizada');

    return true;
  } catch (error) {
    console.error('❌ Erro ao criar tabelas:', error);
    return false;
  }
};

// Drop all tables (use with caution!)
const dropTables = async () => {
  try {
    await sequelize.drop();
    console.log('✅ Todas as tabelas foram removidas');
    return true;
  } catch (error) {
    console.error('❌ Erro ao remover tabelas:', error);
    return false;
  }
};

module.exports = {
  sequelize,
  User,
  Product,
  Table,
  Order,
  OrderItem,
  syncDatabase,
  createTables,
  dropTables
};