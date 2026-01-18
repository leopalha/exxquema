import { getRoleHomePage, redirectToRoleHome } from '../roleRedirect';

// Mock console.log
console.log = jest.fn();

describe('Role Redirect Utils', () => {
  beforeEach(() => {
    console.log.mockClear();
  });

  describe('getRoleHomePage', () => {
    test('returns correct page for admin', () => {
      expect(getRoleHomePage('admin')).toBe('/admin');
    });

    test('returns correct page for gerente', () => {
      expect(getRoleHomePage('gerente')).toBe('/admin');
    });

    test('returns correct page for cozinha', () => {
      expect(getRoleHomePage('cozinha')).toBe('/cozinha');
    });

    test('returns correct page for bar', () => {
      expect(getRoleHomePage('bar')).toBe('/staff/bar');
    });

    test('returns correct page for atendente', () => {
      expect(getRoleHomePage('atendente')).toBe('/atendente');
    });

    test('returns correct page for caixa', () => {
      expect(getRoleHomePage('caixa')).toBe('/staff/caixa');
    });

    test('returns correct page for cliente', () => {
      expect(getRoleHomePage('cliente')).toBe('/');
    });

    test('returns default page for unknown role', () => {
      expect(getRoleHomePage('unknown')).toBe('/');
      expect(getRoleHomePage('')).toBe('/');
      expect(getRoleHomePage(null)).toBe('/');
      expect(getRoleHomePage(undefined)).toBe('/');
    });

    test('handles case sensitivity', () => {
      expect(getRoleHomePage('ADMIN')).toBe('/');
      expect(getRoleHomePage('Admin')).toBe('/');
    });

    test('all role mappings are defined', () => {
      const roles = ['admin', 'gerente', 'cozinha', 'bar', 'atendente', 'caixa', 'cliente'];
      roles.forEach(role => {
        const result = getRoleHomePage(role);
        expect(result).toBeTruthy();
        expect(typeof result).toBe('string');
        expect(result.startsWith('/')).toBe(true);
      });
    });
  });

  describe('redirectToRoleHome', () => {
    let mockRouter;

    beforeEach(() => {
      mockRouter = {
        replace: jest.fn(),
        query: {}
      };
    });

    test('redirects admin to /admin', () => {
      const user = { role: 'admin', nome: 'Admin User' };
      redirectToRoleHome(mockRouter, user);

      expect(mockRouter.replace).toHaveBeenCalledWith('/admin');
      expect(console.log).toHaveBeenCalledWith('✅ Redirecionando para homePage:', '/admin');
    });

    test('redirects cliente to /', () => {
      const user = { role: 'cliente', nome: 'Cliente User' };
      redirectToRoleHome(mockRouter, user);

      expect(mockRouter.replace).toHaveBeenCalledWith('/');
    });

    test('redirects cozinha to /cozinha', () => {
      const user = { role: 'cozinha', nome: 'Kitchen User' };
      redirectToRoleHome(mockRouter, user);

      expect(mockRouter.replace).toHaveBeenCalledWith('/cozinha');
    });

    test('redirects to / when user is null', () => {
      redirectToRoleHome(mockRouter, null);

      expect(mockRouter.replace).toHaveBeenCalledWith('/');
      expect(console.log).toHaveBeenCalledWith('⚠️ REDIRECT: Sem usuário ou role, indo para /');
    });

    test('redirects to / when user has no role', () => {
      const user = { nome: 'Test User' };
      redirectToRoleHome(mockRouter, user);

      expect(mockRouter.replace).toHaveBeenCalledWith('/');
      expect(console.log).toHaveBeenCalledWith('⚠️ REDIRECT: Sem usuário ou role, indo para /');
    });

    test('uses returnTo parameter if provided', () => {
      mockRouter.query = { returnTo: '/reservations' };
      const user = { role: 'cliente', nome: 'Cliente User' };

      redirectToRoleHome(mockRouter, user);

      expect(mockRouter.replace).toHaveBeenCalledWith('/reservations');
      expect(console.log).toHaveBeenCalledWith('✅ Redirecionando para returnTo:', '/reservations');
    });

    test('ignores returnTo if it is /login', () => {
      mockRouter.query = { returnTo: '/login' };
      const user = { role: 'cliente', nome: 'Cliente User' };

      redirectToRoleHome(mockRouter, user);

      expect(mockRouter.replace).toHaveBeenCalledWith('/');
      expect(console.log).toHaveBeenCalledWith('✅ Redirecionando para homePage:', '/');
    });

    test('ignores returnTo if it is /staff/login', () => {
      mockRouter.query = { returnTo: '/staff/login' };
      const user = { role: 'admin', nome: 'Admin User' };

      redirectToRoleHome(mockRouter, user);

      expect(mockRouter.replace).toHaveBeenCalledWith('/admin');
      expect(console.log).toHaveBeenCalledWith('✅ Redirecionando para homePage:', '/admin');
    });

    test('logs debug information', () => {
      const user = { role: 'bar', nome: 'Bar Staff' };
      mockRouter.query = { returnTo: '/orders' };

      redirectToRoleHome(mockRouter, user);

      expect(console.log).toHaveBeenCalledWith('🔀 REDIRECT DEBUG:', {
        userRole: 'bar',
        userName: 'Bar Staff',
        homePage: '/staff/bar',
        returnTo: '/orders',
        willRedirectTo: '/orders'
      });
    });

    test('handles gerente role (same as admin)', () => {
      const user = { role: 'gerente', nome: 'Manager User' };
      redirectToRoleHome(mockRouter, user);

      expect(mockRouter.replace).toHaveBeenCalledWith('/admin');
    });

    test('handles caixa role', () => {
      const user = { role: 'caixa', nome: 'Cashier User' };
      redirectToRoleHome(mockRouter, user);

      expect(mockRouter.replace).toHaveBeenCalledWith('/staff/caixa');
    });

    test('handles atendente role', () => {
      const user = { role: 'atendente', nome: 'Waiter User' };
      redirectToRoleHome(mockRouter, user);

      expect(mockRouter.replace).toHaveBeenCalledWith('/atendente');
    });
  });

  describe('real-world scenarios', () => {
    let mockRouter;

    beforeEach(() => {
      mockRouter = {
        replace: jest.fn(),
        query: {}
      };
    });

    test('handles post-login redirect for customer', () => {
      const user = { role: 'cliente', nome: 'João Silva' };
      mockRouter.query = { returnTo: '/checkout' };

      redirectToRoleHome(mockRouter, user);

      expect(mockRouter.replace).toHaveBeenCalledWith('/checkout');
    });

    test('handles staff login without returnTo', () => {
      const user = { role: 'cozinha', nome: 'Chef Maria' };

      redirectToRoleHome(mockRouter, user);

      expect(mockRouter.replace).toHaveBeenCalledWith('/cozinha');
    });

    test('handles admin accessing restricted page', () => {
      const user = { role: 'admin', nome: 'Admin' };
      mockRouter.query = { returnTo: '/admin/reports' };

      redirectToRoleHome(mockRouter, user);

      expect(mockRouter.replace).toHaveBeenCalledWith('/admin/reports');
    });

    test('prevents login page loops', () => {
      const user = { role: 'cliente', nome: 'Test User' };
      mockRouter.query = { returnTo: '/login' };

      redirectToRoleHome(mockRouter, user);

      expect(mockRouter.replace).not.toHaveBeenCalledWith('/login');
      expect(mockRouter.replace).toHaveBeenCalledWith('/');
    });

    test('handles invalid user session', () => {
      redirectToRoleHome(mockRouter, { nome: 'Test' }); // No role

      expect(mockRouter.replace).toHaveBeenCalledWith('/');
    });
  });

  describe('edge cases', () => {
    let mockRouter;

    beforeEach(() => {
      mockRouter = {
        replace: jest.fn(),
        query: {}
      };
    });

    test('handles empty router query', () => {
      const user = { role: 'cliente', nome: 'Test' };
      mockRouter.query = {};

      redirectToRoleHome(mockRouter, user);

      expect(mockRouter.replace).toHaveBeenCalledWith('/');
    });

    test('handles undefined router query', () => {
      const user = { role: 'cliente', nome: 'Test' };
      delete mockRouter.query;

      redirectToRoleHome(mockRouter, user);

      expect(mockRouter.replace).toHaveBeenCalledWith('/');
    });

    test('handles empty returnTo string', () => {
      const user = { role: 'cliente', nome: 'Test' };
      mockRouter.query = { returnTo: '' };

      redirectToRoleHome(mockRouter, user);

      expect(mockRouter.replace).toHaveBeenCalledWith('/');
    });

    test('handles user with empty role string', () => {
      const user = { role: '', nome: 'Test' };

      redirectToRoleHome(mockRouter, user);

      expect(mockRouter.replace).toHaveBeenCalledWith('/');
    });

    test('handles returnTo with query parameters', () => {
      const user = { role: 'cliente', nome: 'Test' };
      mockRouter.query = { returnTo: '/products?category=drinks' };

      redirectToRoleHome(mockRouter, user);

      expect(mockRouter.replace).toHaveBeenCalledWith('/products?category=drinks');
    });

    test('handles returnTo with hash fragments', () => {
      const user = { role: 'admin', nome: 'Admin' };
      mockRouter.query = { returnTo: '/admin/users#active' };

      redirectToRoleHome(mockRouter, user);

      expect(mockRouter.replace).toHaveBeenCalledWith('/admin/users#active');
    });
  });
});
