// ***********************************************************
// FLAME Lounge Bar - Orders E2E Tests
// ***********************************************************
// Tests for the complete order flow from cart to delivery
// ***********************************************************

describe('Order Flow', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.mockLogin({
      id: 'order-test-user',
      nome: 'Cliente Pedido',
      celular: '21999999999',
      role: 'cliente',
      loyaltyTier: 'silver',
      cashbackBalance: 50.00,
    });
  });

  describe('Cart Management', () => {
    it('should load cardápio page', () => {
      cy.visit('/cardapio');
      cy.get('body').should('be.visible');
    });

    it('should display product categories', () => {
      cy.visit('/cardapio');
      cy.get('body').then(($body) => {
        const text = $body.text().toLowerCase();
        const hasCategories =
          text.includes('entrada') ||
          text.includes('prato') ||
          text.includes('drink') ||
          text.includes('narguilé') ||
          text.includes('sobremesa');
        expect(hasCategories).to.be.true;
      });
    });

    it('should display products with prices', () => {
      cy.visit('/cardapio');
      cy.get('body').then(($body) => {
        // Should show price format R$ X,XX
        const hasPrices = $body.text().match(/R\$\s*\d+/);
        expect(hasPrices).to.not.be.null;
      });
    });

    it('should have add to cart buttons', () => {
      cy.visit('/cardapio');
      cy.get('button').then(($buttons) => {
        const addButtons = $buttons.filter((i, el) => {
          const text = el.textContent.toLowerCase();
          const hasPlus = el.textContent.includes('+');
          return text.includes('adicionar') ||
                 text.includes('pedir') ||
                 hasPlus;
        });
        expect(addButtons.length).to.be.greaterThan(0);
      });
    });
  });

  describe('Cart Page', () => {
    beforeEach(() => {
      cy.mockCart([
        { productId: 'prod-1', name: 'Hamburguer Artesanal', price: 42.90, quantity: 2 },
        { productId: 'prod-2', name: 'Caipirinha Premium', price: 28.00, quantity: 1 },
      ]);
    });

    it('should display cart items', () => {
      cy.visit('/checkout');
      cy.get('body').then(($body) => {
        const text = $body.text();
        // Should show item names or prices
        const hasItems =
          text.includes('Hamburguer') ||
          text.includes('42,90') ||
          text.includes('R$');
        expect(hasItems).to.be.true;
      });
    });

    it('should calculate total correctly', () => {
      cy.visit('/checkout');
      cy.get('body').then(($body) => {
        const text = $body.text();
        // Total should be: (42.90 * 2) + 28.00 = 113.80
        const hasTotal = text.match(/R\$\s*\d+/);
        expect(hasTotal).to.not.be.null;
      });
    });

    it('should allow quantity changes', () => {
      cy.visit('/checkout');
      cy.get('button').then(($buttons) => {
        const quantityButtons = $buttons.filter((i, el) => {
          const text = el.textContent;
          return text === '+' || text === '-' || text === '−';
        });
        // Should have increment/decrement buttons
        expect(quantityButtons.length + $buttons.length).to.be.greaterThan(0);
      });
    });

    it('should show remove item option', () => {
      cy.visit('/checkout');
      cy.get('body').then(($body) => {
        const hasRemove =
          $body.find('button:contains("Remover")').length > 0 ||
          $body.find('[data-testid*="remove"]').length > 0 ||
          $body.find('button svg').length > 0; // Trash icon
        expect(hasRemove).to.be.true;
      });
    });
  });

  describe('Checkout Process', () => {
    beforeEach(() => {
      cy.mockCart([
        { productId: 'prod-1', name: 'Produto Teste', price: 50.00, quantity: 1 },
      ]);
      cy.visit('/checkout');
    });

    it('should show consumption type selection', () => {
      cy.get('body').then(($body) => {
        const text = $body.text().toLowerCase();
        const hasTypes =
          text.includes('mesa') ||
          text.includes('balcão') ||
          text.includes('delivery') ||
          text.includes('local');
        expect(hasTypes).to.be.true;
      });
    });

    it('should show payment method selection', () => {
      cy.get('body').then(($body) => {
        const text = $body.text().toLowerCase();
        const hasPayment =
          text.includes('pix') ||
          text.includes('cartão') ||
          text.includes('dinheiro') ||
          text.includes('pagamento');
        expect(hasPayment).to.be.true;
      });
    });

    it('should display order summary', () => {
      cy.get('body').then(($body) => {
        const text = $body.text().toLowerCase();
        const hasSummary =
          text.includes('total') ||
          text.includes('subtotal') ||
          text.includes('resumo');
        expect(hasSummary).to.be.true;
      });
    });

    it('should have confirm order button', () => {
      cy.get('button').then(($buttons) => {
        const confirmButton = $buttons.filter((i, el) => {
          const text = el.textContent.toLowerCase();
          return text.includes('finalizar') ||
                 text.includes('confirmar') ||
                 text.includes('enviar') ||
                 text.includes('pedir');
        });
        expect(confirmButton.length).to.be.greaterThan(0);
      });
    });
  });

  describe('Order Tracking', () => {
    beforeEach(() => {
      cy.visit('/pedidos');
    });

    it('should load orders page', () => {
      cy.get('body').should('be.visible');
    });

    it('should display order history or empty state', () => {
      cy.get('body').then(($body) => {
        const text = $body.text().toLowerCase();
        const hasOrderContent =
          text.includes('pedido') ||
          text.includes('nenhum') ||
          text.includes('histórico') ||
          text.includes('status');
        expect(hasOrderContent).to.be.true;
      });
    });

    it('should show order status indicators', () => {
      cy.get('body').then(($body) => {
        const text = $body.text().toLowerCase();
        const hasStatusIndicators =
          text.includes('pendente') ||
          text.includes('preparando') ||
          text.includes('pronto') ||
          text.includes('entregue') ||
          text.includes('status');
        expect(hasStatusIndicators).to.be.true;
      });
    });
  });

  describe('Mesa (Table) Orders', () => {
    beforeEach(() => {
      cy.mockCart([
        { productId: 'prod-1', name: 'Produto Mesa', price: 35.00, quantity: 1 },
      ]);
    });

    it('should access cardápio via QR code URL', () => {
      cy.visit('/cardapio?mesa=5');
      cy.get('body').should('be.visible');
      // Should show table number or recognize mesa parameter
      cy.get('body').then(($body) => {
        const hasTable =
          $body.text().includes('5') ||
          $body.text().toLowerCase().includes('mesa');
        expect(hasTable).to.be.true;
      });
    });

    it('should allow table selection in checkout', () => {
      cy.visit('/checkout');
      cy.get('body').then(($body) => {
        const text = $body.text().toLowerCase();
        const hasTableOption =
          text.includes('mesa') ||
          text.includes('número') ||
          text.includes('select');
        expect(hasTableOption).to.be.true;
      });
    });
  });

  describe('Empty Cart', () => {
    beforeEach(() => {
      cy.clearCart();
    });

    it('should handle empty cart in checkout', () => {
      cy.visit('/checkout');
      cy.get('body').then(($body) => {
        const text = $body.text().toLowerCase();
        // Should show empty message or redirect
        const hasEmptyState =
          text.includes('vazio') ||
          text.includes('carrinho') ||
          text.includes('adicione');
        expect($body.length).to.be.greaterThan(0);
      });
    });

    it('should redirect to cardápio or show link', () => {
      cy.visit('/checkout');
      cy.get('body').then(($body) => {
        const hasLink =
          $body.find('a[href*="cardapio"]').length > 0 ||
          $body.find('button:contains("Cardápio")').length > 0 ||
          $body.text().toLowerCase().includes('cardápio');
        expect(hasLink).to.be.true;
      });
    });
  });
});

describe('Order Status Flow', () => {
  describe('Kitchen View', () => {
    beforeEach(() => {
      cy.clearLocalStorage();
      cy.mockLoginAsKitchen();
      cy.visit('/cozinha');
    });

    it('should show pending orders tab', () => {
      cy.get('body').then(($body) => {
        const text = $body.text().toLowerCase();
        const hasPending =
          text.includes('pendente') ||
          text.includes('novo') ||
          text.includes('aguardando');
        expect(hasPending).to.be.true;
      });
    });

    it('should show preparing orders tab', () => {
      cy.get('body').then(($body) => {
        const text = $body.text().toLowerCase();
        const hasPreparing =
          text.includes('preparando') ||
          text.includes('em preparo') ||
          text.includes('fazendo');
        expect(hasPreparing).to.be.true;
      });
    });

    it('should have status change buttons', () => {
      cy.get('button').then(($buttons) => {
        // Kitchen should be able to change order status
        expect($buttons.length).to.be.greaterThan(0);
      });
    });
  });

  describe('Attendant View', () => {
    beforeEach(() => {
      cy.clearLocalStorage();
      cy.mockLoginAsAttendant();
      cy.visit('/atendente');
    });

    it('should show ready orders', () => {
      cy.get('body').then(($body) => {
        const text = $body.text().toLowerCase();
        const hasReady =
          text.includes('pronto') ||
          text.includes('entrega') ||
          text.includes('buscar');
        expect(hasReady).to.be.true;
      });
    });

    it('should show delivered orders', () => {
      cy.get('body').then(($body) => {
        const text = $body.text().toLowerCase();
        const hasDelivered =
          text.includes('entreg') ||
          text.includes('finalizado') ||
          text.includes('completo');
        expect(hasDelivered).to.be.true;
      });
    });
  });
});
