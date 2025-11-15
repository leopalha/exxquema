const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

class User extends Model {
  // Método para verificar senha
  async checkPassword(password) {
    return bcrypt.compare(password, this.password);
  }

  // Remover dados sensíveis ao serializar
  toJSON() {
    const values = Object.assign({}, this.get());
    delete values.password;
    delete values.smsCode;
    delete values.smsAttempts;
    delete values.smsCodeExpiry;
    return values;
  }

  // Verificar se usuário é admin
  isAdmin() {
    return this.role === 'admin';
  }

  // Verificar se usuário é funcionário
  isEmployee() {
    return ['admin', 'atendente', 'cozinha'].includes(this.role);
  }
}

User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  cpf: {
    type: DataTypes.STRING(14),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      is: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  celular: {
    type: DataTypes.STRING(15),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      is: /^\(\d{2}\) \d{4,5}-\d{4}$/
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true, // Pode ser null para usuários que só usam SMS
    validate: {
      len: [6, 100]
    }
  },
  role: {
    type: DataTypes.TEXT, // TEXT para compatibilidade com SQLite
    defaultValue: 'cliente',
    allowNull: false,
    validate: {
      isIn: [['cliente', 'atendente', 'cozinha', 'admin']]
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  phoneVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  smsCode: {
    type: DataTypes.STRING(4),
    allowNull: true
  },
  smsAttempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  smsCodeExpiry: {
    type: DataTypes.DATE,
    allowNull: true
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  },
  totalOrders: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalSpent: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  hooks: {
    beforeSave: async (user) => {
      // Hash da senha se foi alterada
      if (user.changed('password') && user.password) {
        const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12);
        user.password = await bcrypt.hash(user.password, salt);
      }

      // Normalizar dados
      if (user.email) {
        user.email = user.email.toLowerCase().trim();
      }
      if (user.nome) {
        user.nome = user.nome.trim();
      }
    }
  }
});

module.exports = User;