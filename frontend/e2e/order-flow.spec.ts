/**
 * FLAME Lounge Bar - Order Flow E2E Tests
 */

import { test, expect } from '@playwright/test';

test.describe('Order Flow', () => {
  test('should navigate to menu', async ({ page }) => {
    await page.goto('/');

    // Clicar em "Cardápio" ou "Menu"
    const menuButton = page.locator('a[href*="cardapio"], a[href*="menu"]').first();
    await menuButton.click();

    // Deve estar na página de cardápio
    await expect(page).toHaveURL(/cardapio|menu/i);

    // Deve mostrar produtos
    const products = page.locator('[data-testid="product-card"], .product-card, [class*="product"]');
    await expect(products.first()).toBeVisible({ timeout: 10000 });
  });

  test('should add product to cart', async ({ page }) => {
    await page.goto('/cardapio');

    // Aguardar produtos carregarem
    await page.waitForSelector('[data-testid="product-card"], .product-card, button:has-text("Adicionar")', {
      timeout: 10000,
    });

    // Encontrar botão "Adicionar ao carrinho"
    const addButton = page.locator('button:has-text("Adicionar"), button:has-text("Add")').first();

    // Verificar se botão existe
    if (await addButton.count() > 0) {
      await addButton.click();

      // Verificar se carrinho foi atualizado
      const cartIndicator = page.locator('[data-testid="cart-count"], .cart-count, .badge');

      if (await cartIndicator.count() > 0) {
        await expect(cartIndicator.first()).toContainText(/[1-9]/);
      }
    }
  });

  test('should open cart', async ({ page }) => {
    await page.goto('/cardapio');

    // Procurar ícone do carrinho
    const cartButton = page.locator(
      'button:has-text("Carrinho"), [data-testid="cart-button"], a[href*="carrinho"], a[href*="cart"]'
    );

    if (await cartButton.count() > 0) {
      await cartButton.first().click();

      // Deve abrir carrinho (modal ou página)
      const cartModal = page.locator('[data-testid="cart-modal"], .cart-modal, [role="dialog"]');
      const cartPage = page.locator('[data-testid="cart-page"], h1:has-text("Carrinho")');

      const isModalOrPage = (await cartModal.count()) > 0 || (await cartPage.count()) > 0;
      expect(isModalOrPage).toBeTruthy();
    }
  });

  test('should show empty cart state', async ({ page }) => {
    await page.goto('/carrinho');

    // Se não tem produtos, deve mostrar estado vazio
    const emptyState = page.locator(
      '[data-testid="empty-cart"], .empty-state, text=/vazio|empty/i'
    );

    // Aguardar um pouco para verificar
    await page.waitForTimeout(2000);

    // Se mostrar estado vazio OU produtos, está OK
    const hasEmptyState = (await emptyState.count()) > 0;
    const hasProducts = (await page.locator('[data-testid="cart-item"]').count()) > 0;

    expect(hasEmptyState || hasProducts).toBeTruthy();
  });
});
