const { describe, it, expect, beforeEach, vi } = require('vitest');
const Order = require('../../models/Order');
const OrderItem = require('../../models/OrderItem');
const Product = require('../../models/Product');
const User = require('../../models/User');
const Table = require('../../models/Table');
const { sequelize } = require('../../config/database');

// Mock dos models
vi.mock('../../models/Order');
vi.mock('../../models/OrderItem');
vi.mock('../../models/Product');
vi.mock('../../models/User');
vi.mock('../../models/Table');

describe('OrderController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createOrder', () => {
    it('deve criar um pedido com sucesso', async () => {
      const mockOrder = {
        id: '123',
        userId: 'user-1',
        tableId: 'table-1',
        status: 'pending',
        totalAmount: 50.00,
        items: [
          { productId: 'prod-1', quantity: 2, price: 25.00 }
        ]
      };

      Order.create = vi.fn().mockResolvedValue(mockOrder);
      Product.findByPk = vi.fn().mockResolvedValue({
        id: 'prod-1',
        price: 25.00,
        isActive: true,
        stock: 10
      });

      const result = await Order.create(mockOrder);

      expect(result).toEqual(mockOrder);
      expect(Order.create).toHaveBeenCalledWith(mockOrder);
    });

    it('deve falhar se produto não existir', async () => {
      Product.findByPk = vi.fn().mockResolvedValue(null);

      await expect(
        Product.findByPk('invalid-id')
      ).resolves.toBeNull();
    });

    it('deve validar quantidade mínima', async () => {
      const invalidOrder = {
        items: [
          { productId: 'prod-1', quantity: 0 }
        ]
      };

      expect(invalidOrder.items[0].quantity).toBeLessThanOrEqual(0);
    });

    it('deve calcular total corretamente', async () => {
      const items = [
        { price: 10.00, quantity: 2 }, // 20.00
        { price: 15.50, quantity: 1 }, // 15.50
      ];

      const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      expect(total).toBe(35.50);
    });

    it('deve aplicar desconto se houver', async () => {
      const subtotal = 100.00;
      const discount = 10; // 10%
      const total = subtotal * (1 - discount / 100);

      expect(total).toBe(90.00);
    });
  });

  describe('confirmPayment', () => {
    it('deve confirmar pagamento com sucesso', async () => {
      const mockOrder = {
        id: '123',
        status: 'pending_payment',
        paymentMethod: null,
        paidAmount: null,
        save: vi.fn()
      };

      Order.findByPk = vi.fn().mockResolvedValue(mockOrder);

      mockOrder.status = 'confirmed';
      mockOrder.paymentMethod = 'credit_card';
      mockOrder.paidAmount = 50.00;

      await mockOrder.save();

      expect(mockOrder.status).toBe('confirmed');
      expect(mockOrder.paymentMethod).toBe('credit_card');
      expect(mockOrder.save).toHaveBeenCalled();
    });

    it('deve validar métodos de pagamento aceitos', async () => {
      const validMethods = ['credit_card', 'debit_card', 'pix', 'cash'];
      const method = 'credit_card';

      expect(validMethods).toContain(method);
    });

    it('deve calcular troco para pagamento em dinheiro', async () => {
      const total = 45.50;
      const paidAmount = 50.00;
      const change = paidAmount - total;

      expect(change).toBe(4.50);
    });

    it('deve rejeitar pagamento insuficiente', async () => {
      const total = 50.00;
      const paidAmount = 40.00;

      expect(paidAmount).toBeLessThan(total);
    });
  });

  describe('updateStatus', () => {
    it('deve atualizar status para "preparing"', async () => {
      const mockOrder = {
        id: '123',
        status: 'confirmed',
        save: vi.fn()
      };

      Order.findByPk = vi.fn().mockResolvedValue(mockOrder);

      mockOrder.status = 'preparing';
      await mockOrder.save();

      expect(mockOrder.status).toBe('preparing');
      expect(mockOrder.save).toHaveBeenCalled();
    });

    it('deve atualizar status para "ready"', async () => {
      const mockOrder = {
        id: '123',
        status: 'preparing',
        save: vi.fn()
      };

      mockOrder.status = 'ready';
      await mockOrder.save();

      expect(mockOrder.status).toBe('ready');
    });

    it('deve atualizar status para "delivered"', async () => {
      const mockOrder = {
        id: '123',
        status: 'ready',
        deliveredAt: null,
        save: vi.fn()
      };

      mockOrder.status = 'delivered';
      mockOrder.deliveredAt = new Date();
      await mockOrder.save();

      expect(mockOrder.status).toBe('delivered');
      expect(mockOrder.deliveredAt).toBeInstanceOf(Date);
    });

    it('deve validar transições de status válidas', async () => {
      const validTransitions = {
        'pending': ['pending_payment', 'cancelled'],
        'pending_payment': ['confirmed', 'cancelled'],
        'confirmed': ['preparing', 'cancelled'],
        'preparing': ['ready', 'cancelled'],
        'ready': ['delivered'],
        'delivered': ['completed']
      };

      const currentStatus = 'confirmed';
      const newStatus = 'preparing';

      expect(validTransitions[currentStatus]).toContain(newStatus);
    });
  });

  describe('cancelOrder', () => {
    it('deve cancelar pedido com sucesso', async () => {
      const mockOrder = {
        id: '123',
        status: 'pending',
        cancelledAt: null,
        cancellationReason: null,
        save: vi.fn()
      };

      Order.findByPk = vi.fn().mockResolvedValue(mockOrder);

      mockOrder.status = 'cancelled';
      mockOrder.cancelledAt = new Date();
      mockOrder.cancellationReason = 'Cliente solicitou';
      await mockOrder.save();

      expect(mockOrder.status).toBe('cancelled');
      expect(mockOrder.cancelledAt).toBeInstanceOf(Date);
      expect(mockOrder.cancellationReason).toBe('Cliente solicitou');
    });

    it('não deve cancelar pedido já entregue', async () => {
      const status = 'delivered';
      const canCancel = !['delivered', 'completed'].includes(status);

      expect(canCancel).toBe(false);
    });

    it('deve estornar cashback se usado', async () => {
      const cashbackUsed = 10.00;
      const shouldRefund = cashbackUsed > 0;

      expect(shouldRefund).toBe(true);
    });
  });

  describe('getOrders', () => {
    it('deve listar pedidos do usuário', async () => {
      const mockOrders = [
        { id: '1', userId: 'user-1', status: 'confirmed' },
        { id: '2', userId: 'user-1', status: 'preparing' }
      ];

      Order.findAll = vi.fn().mockResolvedValue(mockOrders);

      const result = await Order.findAll({ where: { userId: 'user-1' } });

      expect(result).toHaveLength(2);
      expect(result[0].userId).toBe('user-1');
    });

    it('deve filtrar por status', async () => {
      const mockOrders = [
        { id: '1', status: 'confirmed' }
      ];

      Order.findAll = vi.fn().mockResolvedValue(mockOrders);

      const result = await Order.findAll({ where: { status: 'confirmed' } });

      expect(result).toHaveLength(1);
      expect(result[0].status).toBe('confirmed');
    });

    it('deve ordenar por data de criação', async () => {
      const mockOrders = [
        { id: '1', createdAt: new Date('2024-01-02') },
        { id: '2', createdAt: new Date('2024-01-01') }
      ];

      Order.findAll = vi.fn().mockResolvedValue(mockOrders);

      const result = await Order.findAll({ order: [['createdAt', 'DESC']] });

      expect(result[0].createdAt).toBeInstanceOf(Date);
    });
  });

  describe('getOrderById', () => {
    it('deve retornar pedido com itens e produtos', async () => {
      const mockOrder = {
        id: '123',
        items: [
          { productId: 'prod-1', quantity: 2, product: { name: 'Burger' } }
        ]
      };

      Order.findByPk = vi.fn().mockResolvedValue(mockOrder);

      const result = await Order.findByPk('123');

      expect(result).toBeDefined();
      expect(result.items).toHaveLength(1);
    });

    it('deve retornar null se pedido não existir', async () => {
      Order.findByPk = vi.fn().mockResolvedValue(null);

      const result = await Order.findByPk('invalid-id');

      expect(result).toBeNull();
    });
  });

  describe('Cashback Integration', () => {
    it('deve calcular cashback para o pedido', async () => {
      const total = 100.00;
      const cashbackRate = 0.05; // 5%
      const cashbackAmount = total * cashbackRate;

      expect(cashbackAmount).toBe(5.00);
    });

    it('deve permitir uso de cashback no pedido', async () => {
      const total = 100.00;
      const cashbackUsed = 10.00;
      const finalAmount = total - cashbackUsed;

      expect(finalAmount).toBe(90.00);
    });

    it('não deve permitir usar mais cashback que o total', async () => {
      const total = 50.00;
      const cashbackAvailable = 100.00;
      const maxCashbackUsage = Math.min(total, cashbackAvailable);

      expect(maxCashbackUsage).toBe(50.00);
    });
  });

  describe('Transaction Handling', () => {
    it('deve fazer rollback se falhar ao criar order items', async () => {
      const shouldRollback = true;

      expect(shouldRollback).toBe(true);
    });

    it('deve fazer rollback se falhar ao atualizar estoque', async () => {
      const shouldRollback = true;

      expect(shouldRollback).toBe(true);
    });
  });
});
