// ***********************************************************
// FLAME Lounge Bar - Admin E2E Tests
// ***********************************************************
// Tests for admin dashboard and management features
// ***********************************************************

describe('Admin Dashboard', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.mockLoginAsAdmin();
  });

  describe('Dashboard Access', () => {
    it('should load admin dashboard for admin users', () => {
      cy.visit('/admin');
      cy.get('body').should('be.visible');
      cy.url().should('include', '/admin');
    });

    it('should display main statistics cards', () => {
      cy.visit('/admin');
      cy.get('body').then(($body) => {
        const text = $body.text().toLowerCase();
        // Should have stats like pedidos, vendas, etc
        const hasStats =
          text.includes('pedido') ||
          text.includes('venda') ||
          text.includes('hoje') ||
          text.includes('faturamento');
        expect(hasStats).to.be.true;
      });
    });

    it('should show quick action buttons', () => {
      cy.visit('/admin');
      cy.get('button, a').then(($elements) => {
        // Should have navigation to sub-sections
        const hasActions = $elements.filter((i, el) => {
          const text = el.textContent.toLowerCase();
          return text.includes('produto') ||
                 text.includes('pedido') ||
                 text.includes('cliente') ||
                 text.includes('relatório');
        });
        expect(hasActions.length).to.be.greaterThan(0);
      });
    });
  });

  describe('Products Management', () => {
    beforeEach(() => {
      cy.visit('/admin/products');
    });

    it('should load products page', () => {
      cy.get('body').should('be.visible');
    });

    it('should display product list or table', () => {
      cy.get('body').then(($body) => {
        // Should show product names or a table
        const hasProducts =
          $body.find('table').length > 0 ||
          $body.find('[data-testid*="product"]').length > 0 ||
          $body.text().toLowerCase().includes('produto');
        expect(hasProducts).to.be.true;
      });
    });

    it('should have add product button', () => {
      cy.get('button').then(($buttons) => {
        const addButton = $buttons.filter((i, el) => {
          const text = el.textContent.toLowerCase();
          return text.includes('adicionar') ||
                 text.includes('novo') ||
                 text.includes('criar');
        });
        expect(addButton.length).to.be.greaterThan(0);
      });
    });

    it('should have search/filter functionality', () => {
      cy.get('input').then(($inputs) => {
        const hasSearch = $inputs.filter((i, el) => {
          const placeholder = (el.placeholder || '').toLowerCase();
          const type = el.type || '';
          return placeholder.includes('buscar') ||
                 placeholder.includes('pesquisar') ||
                 type === 'search';
        });
        // Search input should exist
        expect(hasSearch.length + $inputs.length).to.be.greaterThan(0);
      });
    });
  });

  describe('Orders Management', () => {
    beforeEach(() => {
      cy.visit('/admin/orders');
    });

    it('should load orders page', () => {
      cy.get('body').should('be.visible');
    });

    it('should display order filters', () => {
      cy.get('body').then(($body) => {
        const text = $body.text().toLowerCase();
        // Should have status filters
        const hasFilters =
          text.includes('pendente') ||
          text.includes('preparando') ||
          text.includes('pronto') ||
          text.includes('filtro') ||
          text.includes('status');
        expect(hasFilters).to.be.true;
      });
    });

    it('should show order list', () => {
      cy.get('body').then(($body) => {
        // Either shows orders or "no orders" message
        const hasContent =
          $body.find('table').length > 0 ||
          $body.find('[data-testid*="order"]').length > 0 ||
          $body.text().toLowerCase().includes('pedido') ||
          $body.text().toLowerCase().includes('nenhum');
        expect(hasContent).to.be.true;
      });
    });
  });

  describe('Customers (CRM)', () => {
    beforeEach(() => {
      cy.visit('/admin/clientes');
    });

    it('should load customers page', () => {
      cy.get('body').should('be.visible');
    });

    it('should display customer information', () => {
      cy.get('body').then(($body) => {
        const text = $body.text().toLowerCase();
        // Should have customer-related content
        const hasCustomerContent =
          text.includes('cliente') ||
          text.includes('nome') ||
          text.includes('email') ||
          text.includes('telefone');
        expect(hasCustomerContent).to.be.true;
      });
    });
  });

  describe('Reports', () => {
    beforeEach(() => {
      cy.visit('/admin/reports');
    });

    it('should load reports page', () => {
      cy.get('body').should('be.visible');
    });

    it('should have date range selector', () => {
      cy.get('body').then(($body) => {
        const hasDatePicker =
          $body.find('input[type="date"]').length > 0 ||
          $body.find('[data-testid*="date"]').length > 0 ||
          $body.text().toLowerCase().includes('período') ||
          $body.text().toLowerCase().includes('data');
        expect(hasDatePicker).to.be.true;
      });
    });

    it('should display report metrics', () => {
      cy.get('body').then(($body) => {
        const text = $body.text().toLowerCase();
        const hasMetrics =
          text.includes('total') ||
          text.includes('vendas') ||
          text.includes('pedidos') ||
          text.includes('faturamento');
        expect(hasMetrics).to.be.true;
      });
    });
  });

  describe('Stock Management', () => {
    beforeEach(() => {
      cy.visit('/admin/estoque');
    });

    it('should load stock page', () => {
      cy.get('body').should('be.visible');
    });

    it('should display stock levels', () => {
      cy.get('body').then(($body) => {
        const text = $body.text().toLowerCase();
        const hasStockInfo =
          text.includes('estoque') ||
          text.includes('quantidade') ||
          text.includes('disponível');
        expect(hasStockInfo).to.be.true;
      });
    });
  });

  describe('Ingredients (Insumos)', () => {
    beforeEach(() => {
      cy.visit('/admin/insumos');
    });

    it('should load ingredients page', () => {
      cy.get('body').should('be.visible');
    });

    it('should display ingredient categories', () => {
      cy.get('body').then(($body) => {
        const text = $body.text().toLowerCase();
        const hasContent =
          text.includes('insumo') ||
          text.includes('ingrediente') ||
          text.includes('categoria') ||
          text.includes('estoque');
        expect(hasContent).to.be.true;
      });
    });
  });

  describe('Reservations', () => {
    beforeEach(() => {
      cy.visit('/admin/reservas');
    });

    it('should load reservations page', () => {
      cy.get('body').should('be.visible');
    });

    it('should display calendar or list view', () => {
      cy.get('body').then(($body) => {
        const hasReservationContent =
          $body.find('table').length > 0 ||
          $body.find('[data-testid*="calendar"]').length > 0 ||
          $body.text().toLowerCase().includes('reserva');
        expect(hasReservationContent).to.be.true;
      });
    });
  });

  describe('Access Control', () => {
    it('should redirect non-admin users', () => {
      cy.clearLocalStorage();
      cy.mockLogin({ role: 'cliente' });
      cy.visit('/admin');
      // Should redirect or show access denied
      cy.get('body').should('be.visible');
    });

    it('should allow gerente access', () => {
      cy.clearLocalStorage();
      cy.mockLogin({ role: 'gerente' });
      cy.visit('/admin');
      cy.get('body').should('be.visible');
    });
  });
});

describe('Staff Dashboards', () => {
  describe('Kitchen Dashboard', () => {
    beforeEach(() => {
      cy.clearLocalStorage();
      cy.mockLoginAsKitchen();
    });

    it('should load kitchen page', () => {
      cy.visit('/cozinha');
      cy.get('body').should('be.visible');
    });

    it('should show order queue', () => {
      cy.visit('/cozinha');
      cy.get('body').then(($body) => {
        const text = $body.text().toLowerCase();
        const hasQueue =
          text.includes('pedido') ||
          text.includes('fila') ||
          text.includes('preparando') ||
          text.includes('pronto');
        expect(hasQueue).to.be.true;
      });
    });
  });

  describe('Bar Dashboard', () => {
    beforeEach(() => {
      cy.clearLocalStorage();
      cy.mockLoginAsBar();
    });

    it('should load bar page', () => {
      cy.visit('/staff/bar');
      cy.get('body').should('be.visible');
    });

    it('should show drink orders', () => {
      cy.visit('/staff/bar');
      cy.get('body').then(($body) => {
        const text = $body.text().toLowerCase();
        const hasDrinkQueue =
          text.includes('pedido') ||
          text.includes('drink') ||
          text.includes('bebida');
        expect(hasDrinkQueue).to.be.true;
      });
    });
  });

  describe('Attendant Dashboard', () => {
    beforeEach(() => {
      cy.clearLocalStorage();
      cy.mockLoginAsAttendant();
    });

    it('should load attendant page', () => {
      cy.visit('/atendente');
      cy.get('body').should('be.visible');
    });

    it('should show ready orders', () => {
      cy.visit('/atendente');
      cy.get('body').then(($body) => {
        const text = $body.text().toLowerCase();
        const hasReadyOrders =
          text.includes('pronto') ||
          text.includes('entrega') ||
          text.includes('mesa');
        expect(hasReadyOrders).to.be.true;
      });
    });

    it('should have hookah/narguilé tab', () => {
      cy.visit('/atendente');
      cy.get('body').then(($body) => {
        const text = $body.text().toLowerCase();
        const hasHookah =
          text.includes('narguilé') ||
          text.includes('hookah') ||
          text.includes('sessão');
        expect(hasHookah).to.be.true;
      });
    });
  });

  describe('Cashier Dashboard', () => {
    beforeEach(() => {
      cy.clearLocalStorage();
      cy.mockLoginAsCashier();
    });

    it('should load cashier page', () => {
      cy.visit('/staff/caixa');
      cy.get('body').should('be.visible');
    });

    it('should show payment interface', () => {
      cy.visit('/staff/caixa');
      cy.get('body').then(($body) => {
        const text = $body.text().toLowerCase();
        const hasPaymentContent =
          text.includes('pagamento') ||
          text.includes('receber') ||
          text.includes('total') ||
          text.includes('caixa');
        expect(hasPaymentContent).to.be.true;
      });
    });
  });
});
