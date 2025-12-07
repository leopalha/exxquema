// ***********************************************************
// FLAME Lounge Bar - Custom Cypress Commands
// ***********************************************************

import '@testing-library/cypress/add-commands';

// ===========================================
// AUTHENTICATION COMMANDS
// ===========================================

/**
 * Login via API (mais rápido que UI)
 */
Cypress.Commands.add('loginViaAPI', (email = 'test@flame.com', password = 'Test123!') => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/auth/login`,
    body: { email, password },
    failOnStatusCode: false,
  }).then((response) => {
    if (response.status === 200 && response.body.success) {
      const { token, user } = response.body.data;
      cy.window().then((win) => {
        win.localStorage.setItem('flame-auth', JSON.stringify({
          state: { user, token, isAuthenticated: true },
          version: 0,
        }));
      });
    }
    return response;
  });
});

/**
 * Login via UI (para testes de autenticação)
 */
Cypress.Commands.add('login', (email = 'test@flame.com', password = 'Test123!') => {
  cy.visit('/login');
  cy.get('input[type="email"], input[name="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url({ timeout: 10000 }).should('not.include', '/login');
});

/**
 * Mock login - set auth token directly in localStorage
 */
Cypress.Commands.add('mockLogin', (user = {}) => {
  const defaultUser = {
    id: 'test-user-id',
    nome: 'Usuário Teste',
    email: 'teste@flame.com',
    celular: '21999999999',
    role: 'cliente',
    loyaltyTier: 'bronze',
    cashbackBalance: 50.00,
    ...user
  };

  cy.window().then((win) => {
    win.localStorage.setItem('flame-auth', JSON.stringify({
      state: {
        user: defaultUser,
        token: 'mock-jwt-token-' + Date.now(),
        isAuthenticated: true,
      },
      version: 0,
    }));
  });
});

/**
 * Mock login como Admin
 */
Cypress.Commands.add('mockLoginAsAdmin', () => {
  cy.mockLogin({
    id: 'admin-user-id',
    nome: 'Admin Teste',
    email: 'admin@flame.com',
    role: 'admin',
  });
});

/**
 * Mock login como Staff (Cozinha)
 */
Cypress.Commands.add('mockLoginAsKitchen', () => {
  cy.mockLogin({
    id: 'kitchen-user-id',
    nome: 'Cozinha Teste',
    email: 'cozinha@flame.com',
    role: 'cozinha',
  });
});

/**
 * Mock login como Staff (Bar)
 */
Cypress.Commands.add('mockLoginAsBar', () => {
  cy.mockLogin({
    id: 'bar-user-id',
    nome: 'Bar Teste',
    email: 'bar@flame.com',
    role: 'bar',
  });
});

/**
 * Mock login como Atendente
 */
Cypress.Commands.add('mockLoginAsAttendant', () => {
  cy.mockLogin({
    id: 'attendant-user-id',
    nome: 'Atendente Teste',
    email: 'atendente@flame.com',
    role: 'atendente',
  });
});

/**
 * Mock login como Caixa
 */
Cypress.Commands.add('mockLoginAsCashier', () => {
  cy.mockLogin({
    id: 'cashier-user-id',
    nome: 'Caixa Teste',
    email: 'caixa@flame.com',
    role: 'caixa',
  });
});

/**
 * Logout
 */
Cypress.Commands.add('logout', () => {
  cy.window().then((win) => {
    win.localStorage.removeItem('flame-auth');
    win.localStorage.removeItem('token');
  });
  cy.clearCookies();
});

// ===========================================
// CART COMMANDS
// ===========================================

/**
 * Adicionar item ao carrinho via UI
 */
Cypress.Commands.add('addToCart', (productName) => {
  cy.visit('/cardapio');
  cy.contains(productName).parents('[data-testid="product-card"]').within(() => {
    cy.get('button').contains('+').click();
  });
});

/**
 * Mock carrinho com itens
 */
Cypress.Commands.add('mockCart', (items = []) => {
  const defaultItems = items.length > 0 ? items : [
    { productId: 'prod-1', name: 'Produto Teste', price: 29.90, quantity: 2 },
  ];

  cy.window().then((win) => {
    win.localStorage.setItem('flame-cart', JSON.stringify({
      state: {
        items: defaultItems,
        total: defaultItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      },
      version: 0,
    }));
  });
});

/**
 * Limpar carrinho
 */
Cypress.Commands.add('clearCart', () => {
  cy.window().then((win) => {
    win.localStorage.removeItem('flame-cart');
  });
});

// ===========================================
// UI FEEDBACK COMMANDS
// ===========================================

/**
 * Verificar toast de sucesso
 */
Cypress.Commands.add('checkToast', (message) => {
  cy.get('[role="status"], [class*="toast"]', { timeout: 5000 })
    .should('be.visible')
    .and('contain', message);
});

/**
 * Verificar toast de erro
 */
Cypress.Commands.add('checkErrorToast', (message) => {
  cy.get('[role="alert"], [class*="toast"]', { timeout: 5000 })
    .should('be.visible')
    .and('contain', message);
});

/**
 * Esperar loading desaparecer
 */
Cypress.Commands.add('waitForLoading', () => {
  cy.get('[class*="loading"], [class*="spinner"], [class*="animate-spin"]', { timeout: 1000 })
    .should('not.exist');
});

// ===========================================
// API COMMANDS
// ===========================================

/**
 * Esperar resposta da API
 */
Cypress.Commands.add('waitForApi', (alias, timeout = 10000) => {
  cy.wait(alias, { timeout });
});

/**
 * Interceptar chamadas à API
 */
Cypress.Commands.add('interceptApi', (method, path, response, alias) => {
  cy.intercept(method, `${Cypress.env('apiUrl')}${path}`, response).as(alias);
});

/**
 * Interceptar chamadas à API com fixture
 */
Cypress.Commands.add('interceptApiWithFixture', (method, path, fixturePath, alias) => {
  cy.intercept(method, `${Cypress.env('apiUrl')}${path}`, { fixture: fixturePath }).as(alias);
});

// ===========================================
// PAGE COMMANDS
// ===========================================

/**
 * Verificar se página carrega sem erros
 */
Cypress.Commands.add('checkPageLoads', (url) => {
  cy.visit(url);
  cy.get('body').should('be.visible');
  cy.get('[data-testid="error-boundary"]').should('not.exist');
});

/**
 * Verificar redirecionamento para login
 */
Cypress.Commands.add('shouldRedirectToLogin', () => {
  cy.url({ timeout: 5000 }).should('include', '/login');
});

/**
 * Verificar acesso negado
 */
Cypress.Commands.add('shouldShowAccessDenied', () => {
  cy.contains(/acesso negado|não autorizado|sem permissão/i).should('be.visible');
});

// ===========================================
// VIEWPORT COMMANDS
// ===========================================

/**
 * Mobile viewport (iPhone SE)
 */
Cypress.Commands.add('setMobileViewport', () => {
  cy.viewport(375, 667);
});

/**
 * Tablet viewport (iPad)
 */
Cypress.Commands.add('setTabletViewport', () => {
  cy.viewport(768, 1024);
});

/**
 * Desktop viewport
 */
Cypress.Commands.add('setDesktopViewport', () => {
  cy.viewport(1280, 720);
});

// ===========================================
// FORM COMMANDS
// ===========================================

/**
 * Preencher formulário com dados
 */
Cypress.Commands.add('fillForm', (fields) => {
  Object.entries(fields).forEach(([name, value]) => {
    cy.get(`input[name="${name}"], textarea[name="${name}"], select[name="${name}"]`)
      .clear()
      .type(value);
  });
});

/**
 * Selecionar opção em dropdown
 */
Cypress.Commands.add('selectOption', (name, value) => {
  cy.get(`select[name="${name}"]`).select(value);
});

/**
 * Toggle checkbox
 */
Cypress.Commands.add('toggleCheckbox', (name, checked = true) => {
  const checkbox = cy.get(`input[name="${name}"][type="checkbox"]`);
  if (checked) {
    checkbox.check();
  } else {
    checkbox.uncheck();
  }
});
