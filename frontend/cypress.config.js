const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 30000,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    env: {
      apiUrl: process.env.CYPRESS_API_URL || 'http://localhost:7000/api',
      // Production URLs (for CI/CD)
      prodBaseUrl: 'https://flame-lounge.vercel.app',
      prodApiUrl: 'https://backend-production-28c3.up.railway.app/api',
    },
    setupNodeEvents(on, config) {
      // Log test results
      on('after:spec', (spec, results) => {
        if (results && results.stats) {
          console.log(`📊 ${spec.name}: ${results.stats.passes} passed, ${results.stats.failures} failed`);
        }
      });

      // Allow environment variable overrides
      config.env.apiUrl = process.env.CYPRESS_API_URL || config.env.apiUrl;
      return config;
    },
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
});
