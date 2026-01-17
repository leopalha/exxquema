import { DataTypes, Model, Optional } from 'sequelize';
import bcrypt from 'bcryptjs';
import { sequelize } from '../config/database';

/**
 * User Attributes Interface
 */
export interface UserAttributes {
  id: string;
  nome: string;
  cpf?: string | null;
  email?: string | null;
  celular: string;
  password?: string | null;
  role: 'cliente' | 'atendente' | 'cozinha' | 'bar' | 'caixa' | 'gerente' | 'admin';
  isActive: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  profileComplete: boolean;
  smsCode?: string | null;
  smsAttempts: number;
  smsCodeExpiry?: Date | null;
  lastLogin?: Date | null;
  totalOrders: number;
  totalSpent: number;
  lastVisit?: Date | null;
  lastOrderDate?: Date | null;
  googleId?: string | null;
  googleProfilePicture?: string | null;
  authProvider: 'local' | 'google';
  cashbackBalance: number;
  loyaltyTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  birthDate?: Date | null;
  lastBirthdayBonusYear?: number | null;
  referralCode?: string | null;
  referredBy?: string | null;
  referralBonusGiven: boolean;
  totalReferrals: number;
  countryCode?: string | null;
  phonePrefix?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Creation Attributes (optional fields for creation)
 */
export interface UserCreationAttributes extends Optional<UserAttributes,
  'id' | 'cpf' | 'email' | 'password' | 'role' | 'isActive' | 'emailVerified' |
  'phoneVerified' | 'profileComplete' | 'smsCode' | 'smsAttempts' | 'smsCodeExpiry' |
  'lastLogin' | 'totalOrders' | 'totalSpent' | 'lastVisit' | 'lastOrderDate' |
  'googleId' | 'googleProfilePicture' | 'authProvider' | 'cashbackBalance' |
  'loyaltyTier' | 'birthDate' | 'lastBirthdayBonusYear' | 'referralCode' |
  'referredBy' | 'referralBonusGiven' | 'totalReferrals' | 'countryCode' |
  'phonePrefix' | 'createdAt' | 'updatedAt'
> {}

/**
 * Tier Benefits Interface
 */
interface TierBenefits {
  name: string;
  cashbackRate: number;
  perks: string[];
}

/**
 * Next Tier Info Interface
 */
interface NextTierInfo {
  currentTier: string;
  nextTier: string;
  requiredSpent: number;
  currentSpent: number;
  remaining: number;
  progress: number;
}

/**
 * User Model
 */
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public nome!: string;
  public cpf?: string | null;
  public email?: string | null;
  public celular!: string;
  public password?: string | null;
  public role!: 'cliente' | 'atendente' | 'cozinha' | 'bar' | 'caixa' | 'gerente' | 'admin';
  public isActive!: boolean;
  public emailVerified!: boolean;
  public phoneVerified!: boolean;
  public profileComplete!: boolean;
  public smsCode?: string | null;
  public smsAttempts!: number;
  public smsCodeExpiry?: Date | null;
  public lastLogin?: Date | null;
  public totalOrders!: number;
  public totalSpent!: number;
  public lastVisit?: Date | null;
  public lastOrderDate?: Date | null;
  public googleId?: string | null;
  public googleProfilePicture?: string | null;
  public authProvider!: 'local' | 'google';
  public cashbackBalance!: number;
  public loyaltyTier!: 'bronze' | 'silver' | 'gold' | 'platinum';
  public birthDate?: Date | null;
  public lastBirthdayBonusYear?: number | null;
  public referralCode?: string | null;
  public referredBy?: string | null;
  public referralBonusGiven!: boolean;
  public totalReferrals!: number;
  public countryCode?: string | null;
  public phonePrefix?: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  /**
   * Verificar senha
   */
  public async checkPassword(password: string): Promise<boolean> {
    if (!this.password) return false;
    return bcrypt.compare(password, this.password);
  }

  /**
   * Remover dados sensíveis ao serializar
   */
  public toJSON(): Partial<UserAttributes> {
    const values = { ...this.get() };
    delete (values as any).password;
    delete (values as any).smsCode;
    delete (values as any).smsAttempts;
    delete (values as any).smsCodeExpiry;
    return values;
  }

  /**
   * Verificar se usuário é admin
   */
  public isAdmin(): boolean {
    return this.role === 'admin';
  }

  /**
   * Verificar se usuário é funcionário
   */
  public isEmployee(): boolean {
    return ['admin', 'atendente', 'cozinha'].includes(this.role);
  }

  /**
   * Verificar se o perfil está completo
   */
  public hasCompleteProfile(): boolean {
    // Google: Precisa apenas de nome + email (já vem do Google)
    if (this.authProvider === 'google') {
      return !!(this.nome && this.email && this.googleId);
    }

    // Local/Phone: Precisa de nome + email + profileComplete marcado
    return !!(this.nome && this.email && this.profileComplete);
  }

  /**
   * Calcular tier baseado em totalSpent
   */
  public calculateTier(): 'bronze' | 'silver' | 'gold' | 'platinum' {
    const spent = parseFloat(String(this.totalSpent)) || 0;
    if (spent >= 10000) return 'platinum';
    if (spent >= 5000) return 'gold';
    if (spent >= 1000) return 'silver';
    return 'bronze';
  }

  /**
   * Atualizar tier automaticamente
   */
  public async updateTier(): Promise<string | null> {
    const newTier = this.calculateTier();
    if (this.loyaltyTier !== newTier) {
      this.loyaltyTier = newTier;
      await this.save();
      return newTier;
    }
    return null;
  }

  /**
   * Adicionar cashback
   */
  public async addCashback(
    amount: number,
    orderId: string | null = null,
    description: string | null = null
  ): Promise<void> {
    const balanceBefore = parseFloat(String(this.cashbackBalance)) || 0;
    this.cashbackBalance = parseFloat((balanceBefore + amount).toFixed(2));
    const balanceAfter = parseFloat(String(this.cashbackBalance));

    await this.updateTier();
    await this.save();

    // Registrar no histórico
    const CashbackHistory = require('./CashbackHistory');
    await CashbackHistory.create({
      userId: this.id,
      orderId,
      amount,
      type: 'earned',
      description,
      balanceBefore,
      balanceAfter
    });
  }

  /**
   * Usar cashback
   */
  public async useCashback(maxAmount: number, description = 'Usado no pedido'): Promise<number> {
    const balance = parseFloat(String(this.cashbackBalance)) || 0;
    const amountToUse = Math.min(balance, maxAmount);

    if (amountToUse <= 0) {
      return 0;
    }

    const balanceBefore = balance;
    this.cashbackBalance = parseFloat((balance - amountToUse).toFixed(2));
    const balanceAfter = parseFloat(String(this.cashbackBalance));
    await this.save();

    // Registrar no histórico
    const CashbackHistory = require('./CashbackHistory');
    await CashbackHistory.create({
      userId: this.id,
      amount: -amountToUse,
      type: 'redeemed',
      description,
      balanceBefore,
      balanceAfter
    });

    return amountToUse;
  }

  /**
   * Benefícios por tier
   */
  public getTierBenefits(): TierBenefits {
    const benefits: Record<string, TierBenefits> = {
      bronze: {
        name: 'Bronze',
        cashbackRate: 1.5,
        perks: ['1,5% de cashback em todas as compras']
      },
      silver: {
        name: 'Prata',
        cashbackRate: 3,
        perks: ['3% de cashback', 'Prioridade em reservas', 'Suporte prioritário']
      },
      gold: {
        name: 'Ouro',
        cashbackRate: 4.5,
        perks: ['4,5% de cashback', 'Mesa reservada garantida', 'R$ 50 no aniversário']
      },
      platinum: {
        name: 'Platina',
        cashbackRate: 5,
        perks: ['5% de cashback', 'Mesa VIP garantida', 'R$ 100 no aniversário', 'Eventos exclusivos']
      }
    };
    return benefits[this.loyaltyTier] || benefits.bronze;
  }

  /**
   * Info para próximo tier
   */
  public getNextTierInfo(): NextTierInfo | null {
    const spent = parseFloat(String(this.totalSpent)) || 0;
    const tierThresholds: Record<string, { next: string | null; required: number | null }> = {
      bronze: { next: 'silver', required: 1000 },
      silver: { next: 'gold', required: 5000 },
      gold: { next: 'platinum', required: 10000 },
      platinum: { next: null, required: null }
    };

    const info = tierThresholds[this.loyaltyTier];
    if (!info.next || !info.required) {
      return null;
    }

    return {
      currentTier: this.loyaltyTier,
      nextTier: info.next,
      requiredSpent: info.required,
      currentSpent: spent,
      remaining: Math.max(0, info.required - spent),
      progress: Math.min(100, (spent / info.required) * 100)
    };
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
    allowNull: true,
    unique: true,
    validate: {
      is: {
        args: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
        msg: 'CPF deve estar no formato 000.000.000-00'
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  celular: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [6, 100]
    }
  },
  role: {
    type: DataTypes.TEXT,
    defaultValue: 'cliente',
    allowNull: false,
    validate: {
      isIn: [['cliente', 'atendente', 'cozinha', 'bar', 'caixa', 'gerente', 'admin']]
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
  profileComplete: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  smsCode: {
    type: DataTypes.STRING(6),
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
  },
  lastVisit: {
    type: DataTypes.DATE,
    allowNull: true
  },
  lastOrderDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  googleId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  googleProfilePicture: {
    type: DataTypes.STRING,
    allowNull: true
  },
  authProvider: {
    type: DataTypes.TEXT,
    defaultValue: 'local',
    allowNull: false,
    validate: {
      isIn: [['local', 'google']]
    }
  },
  cashbackBalance: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  loyaltyTier: {
    type: DataTypes.TEXT,
    defaultValue: 'bronze',
    validate: {
      isIn: [['bronze', 'silver', 'gold', 'platinum']]
    }
  },
  birthDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  lastBirthdayBonusYear: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  referralCode: {
    type: DataTypes.STRING(10),
    allowNull: true,
    unique: true
  },
  referredBy: {
    type: DataTypes.UUID,
    allowNull: true
  },
  referralBonusGiven: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  totalReferrals: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  countryCode: {
    type: DataTypes.STRING(2),
    allowNull: true,
    defaultValue: 'BR'
  },
  phonePrefix: {
    type: DataTypes.STRING(5),
    allowNull: true,
    defaultValue: '+55'
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true,
  hooks: {
    beforeSave: async (user: User) => {
      // Hash password if changed
      if (user.changed('password') && user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

export default User;
