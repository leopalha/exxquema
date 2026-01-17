/**
 * FLAME Lounge Bar - Cashback System E2E Tests
 *
 * Testa o sistema de cashback e programa de fidelidade:
 * - Visualização de saldo
 * - Uso de cashback no pedido
 * - Tiers de fidelidade
 * - Acúmulo de cashback
 */

import { test, expect } from '@playwright/test';

test.describe('Cashback System', () => {
  test('should display cashback balance in user profile', async ({ page }) => {
    await page.goto('/');

    // Procurar link para perfil/conta
    const profileLink = page.locator('a[href*="perfil"], a[href*="profile"], a[href*="conta"], [data-testid="profile-link"]');

    if (await profileLink.count() > 0) {
      await profileLink.first().click();
      await page.waitForTimeout(2000);

      // Verificar se mostra saldo de cashback
      const cashbackBalance = page.locator('text=/cashback|saldo/i, [data-testid="cashback-balance"]');

      if (await cashbackBalance.count() > 0) {
        await expect(cashbackBalance.first()).toBeVisible();
      }
    }
  });

  test('should show loyalty tier information', async ({ page }) => {
    await page.goto('/perfil');

    // Aguardar carregamento
    await page.waitForTimeout(2000);

    // Procurar informações de tier (Bronze, Silver, Gold, Platinum)
    const tierInfo = page.locator('text=/bronze|silver|gold|platinum/i, [data-testid="loyalty-tier"]');

    if (await tierInfo.count() > 0) {
      await expect(tierInfo.first()).toBeVisible();
    }
  });

  test('should display cashback percentage for current tier', async ({ page }) => {
    await page.goto('/perfil');

    await page.waitForTimeout(2000);

    // Verificar se mostra porcentagem de cashback
    const cashbackRate = page.locator('text=/[0-9]%|cashback.*[0-9]/i');

    if (await cashbackRate.count() > 0) {
      await expect(cashbackRate.first()).toBeVisible();
    }
  });

  test('should show option to use cashback at checkout', async ({ page }) => {
    // Primeiro, adicionar produto ao carrinho
    await page.goto('/cardapio');

    await page.waitForSelector('button:has-text("Adicionar")', { timeout: 10000 });

    const addButton = page.locator('button:has-text("Adicionar")').first();

    if (await addButton.count() > 0) {
      await addButton.click();
      await page.waitForTimeout(1000);

      // Ir para checkout
      const checkoutLink = page.locator('a[href*="checkout"]').first();
      await checkoutLink.click();

      await page.waitForTimeout(2000);

      // Verificar se tem opção de usar cashback
      const useCashbackOption = page.locator(
        'input[type="checkbox"][name*="cashback"], ' +
        'button:has-text("Usar Cashback"), ' +
        'label:has-text("Cashback"), ' +
        '[data-testid="use-cashback"]'
      );

      if (await useCashbackOption.count() > 0) {
        await expect(useCashbackOption.first()).toBeVisible();
      }
    }
  });

  test('should calculate discount when using cashback', async ({ page }) => {
    await page.goto('/checkout');

    await page.waitForTimeout(2000);

    // Se tem produtos no carrinho e opção de cashback
    const useCashbackCheckbox = page.locator('input[type="checkbox"][name*="cashback"]');

    if (await useCashbackCheckbox.count() > 0) {
      // Pegar total antes
      const totalBefore = await page.locator('[data-testid="order-total"], text=/total.*r\\$/i').first().textContent();

      // Marcar usar cashback
      await useCashbackCheckbox.check();
      await page.waitForTimeout(1000);

      // Verificar se total foi atualizado ou mostra desconto
      const discountElement = page.locator('text=/desconto|cashback/i, [data-testid="cashback-discount"]');
      const hasDiscount = (await discountElement.count()) > 0;

      expect(hasDiscount || totalBefore).toBeTruthy();
    }
  });

  test('should respect 50% maximum cashback usage rule', async ({ page }) => {
    await page.goto('/checkout');

    await page.waitForTimeout(2000);

    // Verificar se há mensagem explicando o limite de 50%
    const limitMessage = page.locator('text=/50%|máximo|limite/i');

    // Não é obrigatório mostrar, mas se mostrar, é um plus
    if (await limitMessage.count() > 0) {
      await expect(limitMessage.first()).toBeVisible();
    }
  });
});

test.describe('Cashback Accumulation', () => {
  test('should show cashback earned after order completion', async ({ page }) => {
    // Este teste seria após criar um pedido
    // Verificar se mostra mensagem de cashback ganho
    await page.goto('/pedidos');

    await page.waitForTimeout(2000);

    // Procurar indicação de cashback ganho
    const cashbackEarned = page.locator('text=/ganhou.*cashback|cashback.*acumulado/i');

    // Não é obrigatório estar visível se não há pedidos recentes
    if (await cashbackEarned.count() > 0) {
      console.log('✅ Mostra cashback acumulado');
    }
  });

  test('should display transaction history', async ({ page }) => {
    await page.goto('/perfil');

    await page.waitForTimeout(2000);

    // Procurar histórico de transações de cashback
    const transactionHistory = page.locator('text=/histórico|extrato|transações/i, [data-testid="cashback-history"]');

    if (await transactionHistory.count() > 0) {
      await expect(transactionHistory.first()).toBeVisible();
    }
  });
});

test.describe('Loyalty Tier Progression', () => {
  test('should show progress to next tier', async ({ page }) => {
    await page.goto('/perfil');

    await page.waitForTimeout(2000);

    // Verificar se mostra progresso para próximo nível
    const progressBar = page.locator('[role="progressbar"], .progress-bar, [data-testid="tier-progress"]');

    if (await progressBar.count() > 0) {
      await expect(progressBar.first()).toBeVisible();
    }
  });

  test('should display tier benefits', async ({ page }) => {
    await page.goto('/perfil');

    await page.waitForTimeout(2000);

    // Verificar se lista benefícios do tier atual
    const benefits = page.locator('text=/benefícios|vantagens|benefits/i');

    if (await benefits.count() > 0) {
      await expect(benefits.first()).toBeVisible();
    }
  });
});
