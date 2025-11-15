const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class Table extends Model {
  // Verificar se mesa está ocupada
  isOccupied() {
    return this.status === 'occupied';
  }

  // Verificar se mesa está disponível
  isAvailable() {
    return this.status === 'available' && this.isActive;
  }

  // Gerar URL do QR code
  getQRCodeURL() {
    return `${process.env.FRONTEND_URL}/qr/${this.number}`;
  }
}

Table.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    validate: {
      min: 1,
      max: 999
    }
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: true // ex: "Mesa VIP 1", "Balcão 3"
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 4,
    validate: {
      min: 1,
      max: 20
    }
  },
  location: {
    type: DataTypes.TEXT, // TEXT para compatibilidade com SQLite
    allowNull: false,
    defaultValue: 'interno',
    validate: {
      isIn: [['interno', 'externo', 'balcao', 'vip', 'reservado']]
    }
  },
  status: {
    type: DataTypes.TEXT, // TEXT para compatibilidade com SQLite
    allowNull: false,
    defaultValue: 'available',
    validate: {
      isIn: [['available', 'occupied', 'reserved', 'maintenance']]
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  qrCode: {
    type: DataTypes.STRING,
    allowNull: true // URL do QR Code gerado
  },
  lastCleaned: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  position: {
    type: DataTypes.JSON, // {x: 100, y: 200} para mapa do restaurante
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Table',
  tableName: 'tables',
  indexes: [
    {
      fields: ['number'],
      unique: true
    },
    {
      fields: ['status']
    },
    {
      fields: ['isActive']
    }
  ]
});

module.exports = Table;