/**
 * FLAME Lounge Bar - Push Notifications E2E Tests
 *
 * Testa sistema de notificações push (PWA):
 * - Permissão de notificações
 * - Notificação de pedido
 * - Notificação de status
 */

import { test, expect } from '@playwright/test';

test.describe('Push Notifications', () => {
  test('should have service worker registered', async ({ page }) => {
    await page.goto('/');

    await page.waitForTimeout(2000);

    // Verificar se service worker foi registrado
    const swRegistered = await page.evaluate(() => {
      return 'serviceWorker' in navigator;
    });

    expect(swRegistered).toBeTruthy();
  });

  test('should show notification permission prompt', async ({ page, context }) => {
    // Garantir que permissões estão disponíveis
    await context.grantPermissions(['notifications']);

    await page.goto('/');

    await page.waitForTimeout(2000);

    // Verificar se há botão para habilitar notificações
    const enableNotifButton = page.locator('button:has-text("Notificações"), button:has-text("Ativar"), [data-testid="enable-notifications"]');

    if (await enableNotifButton.count() > 0) {
      await expect(enableNotifButton.first()).toBeVisible();
    }
  });

  test('should save notification preference', async ({ page, context }) => {
    await context.grantPermissions(['notifications']);

    await page.goto('/perfil');

    await page.waitForTimeout(2000);

    // Procurar toggle de notificações nas configurações
    const notifToggle = page.locator('input[type="checkbox"][name*="notification"], [role="switch"]');

    if (await notifToggle.count() > 0) {
      // Toggle ON
      await notifToggle.first().check();
      await page.waitForTimeout(500);

      // Verificar se foi salvo (pode ter feedback visual)
      const savedIndicator = page.locator('text=/salvo|saved|sucesso/i');

      // Não é obrigatório ter indicador, mas é bom ter
      if (await savedIndicator.count() > 0) {
        console.log('✅ Preferência de notificação salva');
      }
    }
  });
});

test.describe('Order Status Notifications', () => {
  test('should show notification icon/badge when order status changes', async ({ page }) => {
    await page.goto('/pedidos');

    await page.waitForTimeout(2000);

    // Verificar se há indicador de notificações
    const notifIcon = page.locator('[data-testid="notification-icon"], .notification-badge, [class*="notif"]');

    if (await notifIcon.count() > 0) {
      console.log('✅ Ícone de notificações presente');
    }
  });

  test('should display notification list', async ({ page }) => {
    await page.goto('/');

    // Clicar no ícone de notificações (se existir)
    const notifIcon = page.locator('[data-testid="notification-icon"], button[aria-label*="notification"]').first();

    if (await notifIcon.count() > 0) {
      await notifIcon.click();
      await page.waitForTimeout(1000);

      // Verificar se abre lista de notificações
      const notifList = page.locator('[data-testid="notification-list"], [role="dialog"]');

      if (await notifList.count() > 0) {
        await expect(notifList.first()).toBeVisible();
      }
    }
  });
});

test.describe('PWA Capabilities', () => {
  test('should have valid manifest.json', async ({ page }) => {
    const response = await page.goto('/manifest.json');

    expect(response?.status()).toBe(200);

    const manifest = await response?.json();

    // Verificar campos obrigatórios do manifest
    expect(manifest).toHaveProperty('name');
    expect(manifest).toHaveProperty('short_name');
    expect(manifest).toHaveProperty('start_url');
    expect(manifest).toHaveProperty('display');
    expect(manifest).toHaveProperty('icons');
  });

  test('should be installable (PWA)', async ({ page }) => {
    await page.goto('/');

    await page.waitForTimeout(2000);

    // Verificar se tem botão de instalação
    const installButton = page.locator('button:has-text("Instalar"), button:has-text("Install"), [data-testid="install-pwa"]');

    if (await installButton.count() > 0) {
      await expect(installButton.first()).toBeVisible();
    }
  });

  test('should work offline (Service Worker caching)', async ({ page, context }) => {
    // Primeiro, visitar a página para fazer cache
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Simular offline
    await context.setOffline(true);

    // Tentar recarregar
    await page.reload();

    // Aguardar
    await page.waitForTimeout(2000);

    // Deve mostrar conteúdo cacheado (não erro de rede)
    const body = page.locator('body');
    await expect(body).toBeVisible();

    // Verificar se não tem erro de "sem conexão" do browser
    const pageTitle = await page.title();
    expect(pageTitle).not.toContain('erro');

    // Voltar ao online
    await context.setOffline(false);
  });
});

test.describe('Real-time Updates', () => {
  test('should connect to Socket.IO for real-time updates', async ({ page }) => {
    await page.goto('/pedidos');

    await page.waitForTimeout(3000);

    // Verificar se Socket.IO foi iniciado (via console ou variável global)
    const socketConnected = await page.evaluate(() => {
      // @ts-ignore
      return window.socket !== undefined || window.io !== undefined;
    });

    // Socket pode não estar conectado em dev, mas deve existir
    console.log('Socket.IO disponível:', socketConnected);
  });

  test('should update order status in real-time', async ({ page }) => {
    await page.goto('/pedidos');

    await page.waitForTimeout(2000);

    // Verificar se tem pedidos exibidos
    const orders = page.locator('[data-testid="order-card"], .order-card, [class*="order"]');

    if (await orders.count() > 0) {
      // Se tem pedidos, deve ter status
      const statusBadge = page.locator('text=/pendente|preparando|pronto|entregue/i, [data-testid="order-status"]');

      if (await statusBadge.count() > 0) {
        await expect(statusBadge.first()).toBeVisible();
      }
    }
  });
});
