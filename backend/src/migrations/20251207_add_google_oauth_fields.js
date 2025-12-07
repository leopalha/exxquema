/**
 * Migration: Add Google OAuth fields to users table
 *
 * Adds:
 * - googleId: Unique Google user ID
 * - googleProfilePicture: URL of Google profile picture
 * - authProvider: 'local' or 'google'
 */

const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    const tableInfo = await queryInterface.describeTable('users');

    // Add googleId if not exists
    if (!tableInfo.googleId) {
      await queryInterface.addColumn('users', 'googleId', {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      });
      console.log('✅ Added googleId column');
    } else {
      console.log('⏭️ googleId column already exists');
    }

    // Add googleProfilePicture if not exists
    if (!tableInfo.googleProfilePicture) {
      await queryInterface.addColumn('users', 'googleProfilePicture', {
        type: DataTypes.STRING,
        allowNull: true,
      });
      console.log('✅ Added googleProfilePicture column');
    } else {
      console.log('⏭️ googleProfilePicture column already exists');
    }

    // Add authProvider if not exists
    if (!tableInfo.authProvider) {
      await queryInterface.addColumn('users', 'authProvider', {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'local',
      });
      console.log('✅ Added authProvider column');
    } else {
      console.log('⏭️ authProvider column already exists');
    }

    console.log('✅ Google OAuth migration completed');
  },

  down: async (queryInterface) => {
    const tableInfo = await queryInterface.describeTable('users');

    if (tableInfo.googleId) {
      await queryInterface.removeColumn('users', 'googleId');
    }
    if (tableInfo.googleProfilePicture) {
      await queryInterface.removeColumn('users', 'googleProfilePicture');
    }
    if (tableInfo.authProvider) {
      await queryInterface.removeColumn('users', 'authProvider');
    }

    console.log('✅ Google OAuth migration rolled back');
  }
};
