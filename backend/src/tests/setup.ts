/**
 * FLAME Lounge Bar - Test Setup
 *
 * Configuração global para testes com Vitest
 */

import { beforeAll, afterAll, afterEach } from 'vitest';

// Setup que roda antes de todos os testes
beforeAll(async () => {
  // Configura variáveis de ambiente para testes
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-secret-key';

  // Aqui você pode inicializar database de testes, etc
  console.log('🧪 Test environment initialized');
});

// Cleanup que roda após cada teste
afterEach(async () => {
  // Limpa mocks, reseta database de testes, etc
});

// Cleanup que roda após todos os testes
afterAll(async () => {
  // Fecha conexões de database, etc
  console.log('✅ Test environment cleaned up');
});
