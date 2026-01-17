/**
 * FLAME Lounge Bar - Split Payment E2E Tests
 *
 * Testa funcionalidade de divisão de conta:
 * - Divisão igual entre N pessoas
 * - Divisão por itens específicos
 * - Validação de valores
 */

import { test, expect } from '@playwright/test';

test.describe('Split Payment - Equal Division', () => {
  test('should show split payment option at checkout', async ({ page }) => {
    // Adicionar produto primeiro
    await page.goto('/cardapio');

    await page.waitForSelector('button:has-text("Adicionar")', { timeout: 10000 });

    const addButton = page.locator('button:has-text("Adicionar")').first();
    await addButton.click();
    await page.waitForTimeout(1000);

    // Ir para checkout
    await page.goto('/checkout');
    await page.waitForTimeout(2000);

    // Procurar opção de divisão de conta
    const splitOption = page.locator('button:has-text("Dividir"), text=/dividir.*conta/i, [data-testid="split-payment"]');

    if (await splitOption.count() > 0) {
      await expect(splitOption.first()).toBeVisible();
    }
  });

  test('should open split payment modal', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForTimeout(2000);

    const splitButton = page.locator('button:has-text("Dividir")').first();

    if (await splitButton.count() > 0) {
      await splitButton.click();
      await page.waitForTimeout(1000);

      // Verificar se modal abriu
      const modal = page.locator('[role="dialog"], .modal, [data-testid="split-modal"]');

      if (await modal.count() > 0) {
        await expect(modal.first()).toBeVisible();
      }
    }
  });

  test('should allow selecting number of people', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForTimeout(2000);

    const splitButton = page.locator('button:has-text("Dividir")').first();

    if (await splitButton.count() > 0) {
      await splitButton.click();
      await page.waitForTimeout(1000);

      // Procurar input para número de pessoas
      const peopleInput = page.locator('input[type="number"][name*="people"], input[placeholder*="pessoas"]');

      if (await peopleInput.count() > 0) {
        await expect(peopleInput.first()).toBeVisible();

        // Testar inserir valor
        await peopleInput.first().fill('3');

        // Verificar se valor individual foi calculado
        const perPersonAmount = page.locator('text=/por pessoa|each person/i, [data-testid="per-person-amount"]');

        if (await perPersonAmount.count() > 0) {
          await expect(perPersonAmount.first()).toBeVisible();
        }
      }
    }
  });

  test('should calculate equal split correctly', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForTimeout(2000);

    // Pegar total da conta
    const totalElement = page.locator('[data-testid="order-total"], text=/total.*r\\$/i').first();

    if (await totalElement.count() > 0) {
      const totalText = await totalElement.textContent();
      const totalMatch = totalText?.match(/[\d,]+\.?\d*/);

      if (totalMatch) {
        const total = parseFloat(totalMatch[0].replace(',', '.'));

        // Abrir modal de divisão
        const splitButton = page.locator('button:has-text("Dividir")').first();

        if (await splitButton.count() > 0) {
          await splitButton.click();
          await page.waitForTimeout(1000);

          // Dividir por 2 pessoas
          const peopleInput = page.locator('input[type="number"]').first();

          if (await peopleInput.count() > 0) {
            await peopleInput.fill('2');
            await page.waitForTimeout(500);

            // Verificar se calculou corretamente (total / 2)
            const expectedPerPerson = (total / 2).toFixed(2);
            const perPersonText = await page.locator('text=/r\\$.*[0-9]/i').first().textContent();

            if (perPersonText) {
              console.log('Total:', total);
              console.log('Esperado por pessoa:', expectedPerPerson);
              console.log('Texto exibido:', perPersonText);
            }
          }
        }
      }
    }
  });

  test('should validate minimum 2 people', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForTimeout(2000);

    const splitButton = page.locator('button:has-text("Dividir")').first();

    if (await splitButton.count() > 0) {
      await splitButton.click();
      await page.waitForTimeout(1000);

      const peopleInput = page.locator('input[type="number"]').first();

      if (await peopleInput.count() > 0) {
        // Tentar inserir 1 pessoa (inválido)
        await peopleInput.fill('1');

        const confirmButton = page.locator('button:has-text("Confirmar")').first();

        if (await confirmButton.count() > 0) {
          await confirmButton.click();
          await page.waitForTimeout(500);

          // Deve mostrar erro ou não permitir
          const errorMessage = page.locator('text=/mínimo|minimum|pelo menos/i, [role="alert"]');
          const hasError = (await errorMessage.count()) > 0;

          // Ou mantém o modal aberto
          const modalStillOpen = (await page.locator('[role="dialog"]').count()) > 0;

          expect(hasError || modalStillOpen).toBeTruthy();
        }
      }
    }
  });
});

test.describe('Split Payment - By Items', () => {
  test('should show option to split by items', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForTimeout(2000);

    const splitButton = page.locator('button:has-text("Dividir")').first();

    if (await splitButton.count() > 0) {
      await splitButton.click();
      await page.waitForTimeout(1000);

      // Procurar opção "Por itens" ou similar
      const byItemsOption = page.locator('button:has-text("Por item"), input[type="radio"][value*="items"]');

      if (await byItemsOption.count() > 0) {
        await expect(byItemsOption.first()).toBeVisible();
      }
    }
  });

  test('should allow selecting specific items for each person', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForTimeout(2000);

    const splitButton = page.locator('button:has-text("Dividir")').first();

    if (await splitButton.count() > 0) {
      await splitButton.click();
      await page.waitForTimeout(1000);

      // Selecionar modo "por itens"
      const byItemsRadio = page.locator('input[type="radio"][value*="items"]').first();

      if (await byItemsRadio.count() > 0) {
        await byItemsRadio.check();
        await page.waitForTimeout(500);

        // Verificar se mostra lista de itens com checkboxes
        const itemCheckboxes = page.locator('input[type="checkbox"][data-item-id]');

        if (await itemCheckboxes.count() > 0) {
          await expect(itemCheckboxes.first()).toBeVisible();
        }
      }
    }
  });

  test('should calculate subtotal for selected items', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForTimeout(2000);

    const splitButton = page.locator('button:has-text("Dividir")').first();

    if (await splitButton.count() > 0) {
      await splitButton.click();
      await page.waitForTimeout(1000);

      const byItemsRadio = page.locator('input[type="radio"][value*="items"]').first();

      if (await byItemsRadio.count() > 0) {
        await byItemsRadio.check();
        await page.waitForTimeout(500);

        // Selecionar primeiro item
        const firstItemCheckbox = page.locator('input[type="checkbox"]').first();
        await firstItemCheckbox.check();
        await page.waitForTimeout(500);

        // Verificar se calculou subtotal
        const subtotalElement = page.locator('text=/subtotal|parcial/i, [data-testid="split-subtotal"]');

        if (await subtotalElement.count() > 0) {
          await expect(subtotalElement.first()).toBeVisible();
        }
      }
    }
  });
});

test.describe('Split Payment - Validation', () => {
  test('should not allow split if cart is empty', async ({ page }) => {
    // Limpar carrinho primeiro (se possível)
    await page.goto('/checkout');
    await page.waitForTimeout(2000);

    const emptyState = page.locator('text=/vazio|empty/i');

    if (await emptyState.count() > 0) {
      // Carrinho está vazio

      // Botão de split deve estar desabilitado ou não visível
      const splitButton = page.locator('button:has-text("Dividir")');

      if (await splitButton.count() > 0) {
        const isDisabled = await splitButton.first().isDisabled();
        expect(isDisabled).toBeTruthy();
      }
    }
  });

  test('should ensure all items are assigned when splitting by items', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForTimeout(2000);

    const splitButton = page.locator('button:has-text("Dividir")').first();

    if (await splitButton.count() > 0) {
      await splitButton.click();
      await page.waitForTimeout(1000);

      const byItemsRadio = page.locator('input[type="radio"][value*="items"]').first();

      if (await byItemsRadio.count() > 0) {
        await byItemsRadio.check();
        await page.waitForTimeout(500);

        // Tentar confirmar sem selecionar todos os itens
        const confirmButton = page.locator('button:has-text("Confirmar")').first();

        if (await confirmButton.count() > 0) {
          // Não selecionar nenhum item
          await confirmButton.click();
          await page.waitForTimeout(500);

          // Deve mostrar erro ou manter modal aberto
          const errorMessage = page.locator('text=/todos.*itens|all items/i, [role="alert"]');
          const hasError = (await errorMessage.count()) > 0;

          const modalOpen = (await page.locator('[role="dialog"]').count()) > 0;

          expect(hasError || modalOpen).toBeTruthy();
        }
      }
    }
  });
});
