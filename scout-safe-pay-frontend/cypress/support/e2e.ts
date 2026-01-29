import './commands';

// Cypress configuration
beforeEach(() => {
  // Clear cookies and localStorage before each test
  cy.clearCookies();
  cy.clearLocalStorage();
});

// Handle uncaught exceptions
Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false here prevents Cypress from failing the test
  return false;
});
