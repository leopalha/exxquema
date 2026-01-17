import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

/**
 * Product Categories
 */
export type ProductCategory =
  | 'bebidas_alcoolicas'
  | 'bebidas_nao_alcoolicas'
  | 'drinks_autorais'
  | 'petiscos'
  | 'pratos_principais'
  | 'sobremesas'
  | 'porcoes'
  | 'combos'
  | 'hookah';

/**
 * Dietary Options
 */
export type DietaryOption = 'vegetariano' | 'vegano' | 'sem_lactose' | 'sem_gluten';

/**
 * Product Attributes Interface
 */
export interface ProductAttributes {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  category: ProductCategory;
  subcategory?: string | null;
  image?: string | null;
  ingredients?: string | null;
  allergens: string[];
  dietary: DietaryOption[];
  preparationTime: number;
  calories?: number | null;
  isActive: boolean;
  isPromotional: boolean;
  discountPercentage?: number | null;
  hasStock: boolean;
  stock?: number | null;
  minStock: number;
  position: number;
  tags: string[];
  isSignature: boolean;
  alcoholicContent?: number | null;
  volume?: string | null;
  spiceLevel?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Creation Attributes
 */
export interface ProductCreationAttributes extends Optional<ProductAttributes,
  'id' | 'description' | 'subcategory' | 'image' | 'ingredients' | 'allergens' |
  'dietary' | 'preparationTime' | 'calories' | 'isActive' | 'isPromotional' |
  'discountPercentage' | 'hasStock' | 'stock' | 'minStock' | 'position' |
  'tags' | 'isSignature' | 'alcoholicContent' | 'volume' | 'spiceLevel' |
  'createdAt' | 'updatedAt'
> {}

/**
 * Product Model
 */
class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public id!: string;
  public name!: string;
  public description?: string | null;
  public price!: number;
  public category!: ProductCategory;
  public subcategory?: string | null;
  public image?: string | null;
  public ingredients?: string | null;
  public allergens!: string[];
  public dietary!: DietaryOption[];
  public preparationTime!: number;
  public calories?: number | null;
  public isActive!: boolean;
  public isPromotional!: boolean;
  public discountPercentage?: number | null;
  public hasStock!: boolean;
  public stock?: number | null;
  public minStock!: number;
  public position!: number;
  public tags!: string[];
  public isSignature!: boolean;
  public alcoholicContent?: number | null;
  public volume?: string | null;
  public spiceLevel?: number | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  /**
   * Verificar se produto está disponível
   */
  public isAvailable(): boolean {
    return this.isActive && (!this.hasStock || (this.stock !== null && this.stock > 0));
  }

  /**
   * Aplicar desconto (se houver promoção)
   */
  public getPriceWithDiscount(): number {
    if (this.discountPercentage && this.discountPercentage > 0) {
      return this.price * (1 - this.discountPercentage / 100);
    }
    return this.price;
  }

  /**
   * Verificar se é item vegetariano
   */
  public isVegetarian(): boolean {
    return this.dietary && this.dietary.includes('vegetariano');
  }

  /**
   * Verificar se é sem lactose
   */
  public isLactoseFree(): boolean {
    return this.dietary && this.dietary.includes('sem_lactose');
  }
}

Product.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: false,
    validate: {
      min: 0.01
    }
  },
  category: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      isIn: [[
        'bebidas_alcoolicas',
        'bebidas_nao_alcoolicas',
        'drinks_autorais',
        'petiscos',
        'pratos_principais',
        'sobremesas',
        'porcoes',
        'combos',
        'hookah'
      ]]
    }
  },
  subcategory: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ingredients: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  allergens: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: '[]',
    get(): string[] {
      const value = this.getDataValue('allergens' as any);
      return value ? JSON.parse(value as string) : [];
    },
    set(value: string[]) {
      this.setDataValue('allergens' as any, JSON.stringify(value || []));
    }
  },
  dietary: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: '[]',
    get(): DietaryOption[] {
      const value = this.getDataValue('dietary' as any);
      return value ? JSON.parse(value as string) : [];
    },
    set(value: DietaryOption[]) {
      this.setDataValue('dietary' as any, JSON.stringify(value || []));
    },
    validate: {
      isValidDietary(value: string | DietaryOption[]) {
        const validOptions: DietaryOption[] = ['vegetariano', 'vegano', 'sem_lactose', 'sem_gluten'];
        const parsed = typeof value === 'string' ? JSON.parse(value) : value;
        if (parsed && Array.isArray(parsed)) {
          for (const item of parsed) {
            if (!validOptions.includes(item as DietaryOption)) {
              throw new Error(`Opção dietary inválida: ${item}`);
            }
          }
        }
      }
    }
  },
  preparationTime: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 15
  },
  calories: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isPromotional: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  discountPercentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    validate: {
      min: 0,
      max: 100
    }
  },
  hasStock: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null
  },
  minStock: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 5
  },
  position: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  tags: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: '[]',
    get(): string[] {
      const value = this.getDataValue('tags' as any);
      return value ? JSON.parse(value as string) : [];
    },
    set(value: string[]) {
      this.setDataValue('tags' as any, JSON.stringify(value || []));
    }
  },
  isSignature: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  alcoholicContent: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: true
  },
  volume: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  spiceLevel: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 5
    }
  }
}, {
  sequelize,
  modelName: 'Product',
  tableName: 'products',
  timestamps: true,
  indexes: [
    {
      fields: ['category']
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['position']
    }
  ]
});

export default Product;
