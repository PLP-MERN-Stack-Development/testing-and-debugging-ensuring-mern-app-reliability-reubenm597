// Import commands
import './commands';

// Global before each
beforeEach(() => {
  // Clear localStorage
  cy.window().then((win) => {
    win.localStorage.clear();
  });
});

// Handle uncaught exceptions
Cypress.on('uncaught:exception', (err, runnable) => {
  console.error('Uncaught exception:', err);
  return false;
});