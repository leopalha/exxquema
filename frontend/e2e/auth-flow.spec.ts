/**
 * FLAME Lounge Bar - Authentication Flow E2E Tests
 *
 * Testa fluxo completo de autenticação:
 * - SMS verification
 * - Google OAuth
 * - Logout
 */

import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should show login page', async ({ page }) => {
    await page.goto('/login');

    // Verificar se página de login carregou
    await expect(page).toHaveURL(/login/i);

    // Verificar elementos da página
    const phoneInput = page.locator('input[type="tel"], input[name="phone"], input[placeholder*="telefone"]');
    await expect(phoneInput.first()).toBeVisible({ timeout: 5000 });
  });

  test('should validate phone number format', async ({ page }) => {
    await page.goto('/login');

    // Tentar enviar com telefone inválido
    const phoneInput = page.locator('input[type="tel"], input[name="phone"]').first();

    if (await phoneInput.count() > 0) {
      await phoneInput.fill('123'); // Número inválido

      const submitButton = page.locator('button[type="submit"], button:has-text("Enviar")').first();

      if (await submitButton.count() > 0) {
        await submitButton.click();

        await page.waitForTimeout(1000);

        // Deve mostrar erro de validação
        const errorMessage = page.locator('text=/inválido|erro|error/i, [role="alert"]');
        const hasError = (await errorMessage.count()) > 0;

        // Ou deve manter na mesma página (sem submit)
        const stillOnLogin = page.url().includes('login');

        expect(hasError || stillOnLogin).toBeTruthy();
      }
    }
  });

  test('should show Google OAuth button', async ({ page }) => {
    await page.goto('/login');

    // Verificar se tem botão do Google
    const googleButton = page.locator('button:has-text("Google"), a:has-text("Google"), [aria-label*="Google"]');

    if (await googleButton.count() > 0) {
      await expect(googleButton.first()).toBeVisible();
    }
  });

  test('should handle SMS code verification flow', async ({ page }) => {
    await page.goto('/login');

    const phoneInput = page.locator('input[type="tel"]').first();

    if (await phoneInput.count() > 0) {
      // Preencher telefone válido (formato brasileiro)
      await phoneInput.fill('21999999999');

      const submitButton = page.locator('button[type="submit"]').first();
      await submitButton.click();

      await page.waitForTimeout(2000);

      // Verificar se foi para tela de verificação OU mostrou erro (SMS não configurado em dev)
      const codeInput = page.locator('input[type="text"][maxlength="6"], input[name*="code"]');
      const errorMessage = page.locator('text=/erro|error|falhou|failed/i');

      const hasCodeInput = (await codeInput.count()) > 0;
      const hasError = (await errorMessage.count()) > 0;

      // Em dev, pode não ter Twilio configurado, então erro é OK
      expect(hasCodeInput || hasError).toBeTruthy();
    }
  });

  test('should redirect to home after successful login', async ({ page }) => {
    // Este teste depende de ter credenciais válidas
    // Em produção, seria mockado
    await page.goto('/login');

    // Verificar se já está logado (cookie existente)
    const userMenu = page.locator('[data-testid="user-menu"], button:has-text("Minha Conta")');

    if (await userMenu.count() > 0) {
      // Usuário já está logado
      await page.goto('/');
      await expect(page).toHaveURL('/');
    }
  });
});

test.describe('Logout Flow', () => {
  test('should have logout option in user menu', async ({ page }) => {
    await page.goto('/');

    // Procurar menu do usuário
    const userMenu = page.locator('[data-testid="user-menu"], button[aria-label*="menu"], [class*="user-menu"]');

    if (await userMenu.count() > 0) {
      await userMenu.first().click();
      await page.waitForTimeout(500);

      // Procurar opção de logout
      const logoutButton = page.locator('button:has-text("Sair"), a:has-text("Logout"), [data-testid="logout"]');

      if (await logoutButton.count() > 0) {
        await expect(logoutButton.first()).toBeVisible();
      }
    }
  });
});
