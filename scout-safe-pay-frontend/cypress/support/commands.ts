/// <reference types="cypress" />

// Cypress commands
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('not.include', '/login');
});

Cypress.Commands.add('logout', () => {
  cy.get('[data-testid="user-menu"]').click();
  cy.get('[data-testid="logout-btn"]').click();
  cy.url().should('include', '/');
});

Cypress.Commands.add('addToCart', (vehicleId: string) => {
  cy.visit(`/vehicle/${vehicleId}`);
  cy.get('[data-testid="add-to-cart"]').click();
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      logout(): Chainable<void>;
      addToCart(vehicleId: string): Chainable<void>;
    }
  }
}
