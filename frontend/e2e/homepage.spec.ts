/**
 * FLAME Lounge Bar - Homepage E2E Tests
 */

import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');

    // Verificar título
    await expect(page).toHaveTitle(/FLAME/i);

    // Verificar elementos principais
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');

    // Verificar links de navegação
    const cardapioLink = page.locator('a[href*="cardapio"], a[href*="menu"]');
    await expect(cardapioLink.first()).toBeVisible();

    const reservasLink = page.locator('a[href*="reserv"]');
    if (await reservasLink.count() > 0) {
      await expect(reservasLink.first()).toBeVisible();
    }
  });

  test('should be responsive', async ({ page }) => {
    // Desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();

    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('body')).toBeVisible();

    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have no console errors', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');

    // Aguardar carregamento
    await page.waitForLoadState('networkidle');

    // Não deve ter erros críticos
    const criticalErrors = errors.filter(
      (err) =>
        !err.includes('favicon') &&
        !err.includes('Extension') &&
        !err.includes('Chrome')
    );

    expect(criticalErrors.length).toBe(0);
  });
});
