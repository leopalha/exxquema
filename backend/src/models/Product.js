"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
/**
 * Product Model
 */
class Product extends sequelize_1.Model {
    /**
     * Verificar se produto está disponível
     */
    isAvailable() {
        return this.isActive && (!this.hasStock || (this.stock !== null && this.stock > 0));
    }
    /**
     * Aplicar desconto (se houver promoção)
     */
    getPriceWithDiscount() {
        if (this.discountPercentage && this.discountPercentage > 0) {
            return this.price * (1 - this.discountPercentage / 100);
        }
        return this.price;
    }
    /**
     * Verificar se é item vegetariano
     */
    isVegetarian() {
        return this.dietary && this.dietary.includes('vegetariano');
    }
    /**
     * Verificar se é sem lactose
     */
    isLactoseFree() {
        return this.dietary && this.dietary.includes('sem_lactose');
    }
}
Product.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [2, 100]
        }
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true
    },
    price: {
        type: sequelize_1.DataTypes.DECIMAL(8, 2),
        allowNull: false,
        validate: {
            min: 0.01
        }
    },
    category: {
        type: sequelize_1.DataTypes.TEXT,
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
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true
    },
    image: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    ingredients: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true
    },
    allergens: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        defaultValue: '[]',
        get() {
            const value = this.getDataValue('allergens');
            return value ? JSON.parse(value) : [];
        },
        set(value) {
            this.setDataValue('allergens', JSON.stringify(value || []));
        }
    },
    dietary: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        defaultValue: '[]',
        get() {
            const value = this.getDataValue('dietary');
            return value ? JSON.parse(value) : [];
        },
        set(value) {
            this.setDataValue('dietary', JSON.stringify(value || []));
        },
        validate: {
            isValidDietary(value) {
                const validOptions = ['vegetariano', 'vegano', 'sem_lactose', 'sem_gluten'];
                const parsed = typeof value === 'string' ? JSON.parse(value) : value;
                if (parsed && Array.isArray(parsed)) {
                    for (const item of parsed) {
                        if (!validOptions.includes(item)) {
                            throw new Error(`Opção dietary inválida: ${item}`);
                        }
                    }
                }
            }
        }
    },
    preparationTime: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 15
    },
    calories: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true
    },
    isPromotional: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    discountPercentage: {
        type: sequelize_1.DataTypes.DECIMAL(5, 2),
        allowNull: true,
        validate: {
            min: 0,
            max: 100
        }
    },
    hasStock: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    stock: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    minStock: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 5
    },
    position: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0
    },
    tags: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        defaultValue: '[]',
        get() {
            const value = this.getDataValue('tags');
            return value ? JSON.parse(value) : [];
        },
        set(value) {
            this.setDataValue('tags', JSON.stringify(value || []));
        }
    },
    isSignature: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    alcoholicContent: {
        type: sequelize_1.DataTypes.DECIMAL(4, 2),
        allowNull: true
    },
    volume: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: true
    },
    spiceLevel: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 0,
            max: 5
        }
    }
}, {
    sequelize: database_1.sequelize,
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
exports.default = Product;
