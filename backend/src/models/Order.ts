import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

/**
 * Order Status
 */
export type OrderStatus =
  | 'pending'
  | 'pending_payment'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'on_way'
  | 'delivered'
  | 'cancelled';

/**
 * Payment Status
 */
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

/**
 * Payment Method
 */
export type PaymentMethod =
  | 'credit_card'
  | 'debit_card'
  | 'pix'
  | 'apple_pay'
  | 'cash'
  | 'pay_later'
  | 'card_at_table'
  | 'split';

/**
 * Order Attributes Interface
 */
export interface OrderAttributes {
  id: string;
  orderNumber: number;
  userId: string;
  tableId?: string | null;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod | null;
  paymentId?: string | null;
  subtotal: number;
  serviceFee: number;
  taxes: number;
  total: number;
  notes?: string | null;
  estimatedTime: number;
  confirmedAt?: Date | null;
  startedAt?: Date | null;
  finishedAt?: Date | null;
  pickedUpAt?: Date | null;
  deliveredAt?: Date | null;
  cancelledAt?: Date | null;
  cancelledBy?: string | null;
  preparationTime?: number | null;
  attendantId?: string | null;
  kitchenUserId?: string | null;
  rating?: number | null;
  review?: string | null;
  isDelivered: boolean;
  cashbackUsed: number;
  discount: number;
  tip: number;
  wantsInstagramCashback: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Creation Attributes
 */
export interface OrderCreationAttributes extends Optional<OrderAttributes,
  'id' | 'orderNumber' | 'tableId' | 'status' | 'paymentStatus' | 'paymentMethod' |
  'paymentId' | 'serviceFee' | 'taxes' | 'notes' | 'estimatedTime' | 'confirmedAt' |
  'startedAt' | 'finishedAt' | 'pickedUpAt' | 'deliveredAt' | 'cancelledAt' |
  'cancelledBy' | 'preparationTime' | 'attendantId' | 'kitchenUserId' | 'rating' |
  'review' | 'isDelivered' | 'cashbackUsed' | 'discount' | 'tip' |
  'wantsInstagramCashback' | 'createdAt' | 'updatedAt'
> {}

/**
 * Order Model
 */
class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  public id!: string;
  public orderNumber!: number;
  public userId!: string;
  public tableId?: string | null;
  public status!: OrderStatus;
  public paymentStatus!: PaymentStatus;
  public paymentMethod?: PaymentMethod | null;
  public paymentId?: string | null;
  public subtotal!: number;
  public serviceFee!: number;
  public taxes!: number;
  public total!: number;
  public notes?: string | null;
  public estimatedTime!: number;
  public confirmedAt?: Date | null;
  public startedAt?: Date | null;
  public finishedAt?: Date | null;
  public pickedUpAt?: Date | null;
  public deliveredAt?: Date | null;
  public cancelledAt?: Date | null;
  public cancelledBy?: string | null;
  public preparationTime?: number | null;
  public attendantId?: string | null;
  public kitchenUserId?: string | null;
  public rating?: number | null;
  public review?: string | null;
  public isDelivered!: boolean;
  public cashbackUsed!: number;
  public discount!: number;
  public tip!: number;
  public wantsInstagramCashback!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  /**
   * Calcular total do pedido
   */
  public calculateTotal(): number {
    return parseFloat(String(this.subtotal)) +
           parseFloat(String(this.serviceFee)) +
           parseFloat(String(this.taxes || 0));
  }

  /**
   * Verificar se pedido está atrasado (mais de 30 min)
   */
  public isDelayed(): boolean {
    if (this.status === 'delivered' || this.status === 'cancelled') return false;
    const now = new Date();
    const orderTime = new Date(this.createdAt);
    const diffMinutes = (now.getTime() - orderTime.getTime()) / (1000 * 60);
    return diffMinutes > 30;
  }

  /**
   * Calcular tempo de preparo
   */
  public getPreparationTime(): number | null {
    if (this.startedAt && this.finishedAt) {
      return Math.round(
        (new Date(this.finishedAt).getTime() - new Date(this.startedAt).getTime()) / 60000
      );
    }
    return null;
  }

  /**
   * Verificar se pode ser cancelado
   */
  public canBeCancelled(): boolean {
    return ['pending', 'pending_payment', 'confirmed'].includes(this.status);
  }

  /**
   * Obter próximo status válido
   */
  public getNextValidStatus(): OrderStatus | undefined {
    const statusFlow: Record<string, OrderStatus> = {
      pending: 'confirmed',
      pending_payment: 'confirmed',
      confirmed: 'preparing',
      preparing: 'ready',
      ready: 'on_way',
      on_way: 'delivered'
    };
    return statusFlow[this.status];
  }

  /**
   * Verificar se é pagamento com atendente
   */
  public isAttendantPayment(): boolean {
    return ['cash', 'pay_later', 'card_at_table', 'split'].includes(this.paymentMethod || '');
  }
}

Order.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  orderNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  tableId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'tables',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: 'pending',
    validate: {
      isIn: [[
        'pending',
        'pending_payment',
        'confirmed',
        'preparing',
        'ready',
        'on_way',
        'delivered',
        'cancelled'
      ]]
    }
  },
  paymentStatus: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: 'pending',
    validate: {
      isIn: [['pending', 'processing', 'completed', 'failed', 'refunded']]
    }
  },
  paymentMethod: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      isIn: [[
        'credit_card',
        'debit_card',
        'pix',
        'apple_pay',
        'cash',
        'pay_later',
        'card_at_table',
        'split'
      ]]
    }
  },
  paymentId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  subtotal: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  serviceFee: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: false,
    defaultValue: 0
  },
  taxes: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: false,
    defaultValue: 0
  },
  total: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  estimatedTime: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 20
  },
  confirmedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  startedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  finishedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  pickedUpAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  deliveredAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  cancelledAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  cancelledBy: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  preparationTime: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  attendantId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  kitchenUserId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  },
  review: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isDelivered: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  cashbackUsed: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: false,
    defaultValue: 0
  },
  discount: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: false,
    defaultValue: 0
  },
  tip: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: false,
    defaultValue: 0
  },
  wantsInstagramCashback: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  sequelize,
  modelName: 'Order',
  tableName: 'orders',
  timestamps: true,
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['tableId']
    },
    {
      fields: ['status']
    },
    {
      fields: ['paymentStatus']
    },
    {
      fields: ['createdAt']
    }
  ]
});

export default Order;
