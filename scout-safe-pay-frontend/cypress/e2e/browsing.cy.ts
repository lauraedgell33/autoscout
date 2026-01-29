describe('Vehicle Browsing', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display vehicle listings', () => {
    cy.visit('/browse');
    cy.get('[data-testid="vehicle-card"]').should('have.length.greaterThan', 0);
  });

  it('should filter vehicles by price', () => {
    cy.visit('/browse');
    cy.get('[data-testid="price-filter"]').type('50000');
    cy.get('[data-testid="apply-filters"]').click();
    cy.get('[data-testid="vehicle-card"]').each(($card) => {
      cy.wrap($card).contains(/€\d+/);
    });
  });

  it('should add vehicle to cart', () => {
    cy.addToCart('test-vehicle-1');
    cy.get('[data-testid="cart-badge"]').should('contain', '1');
  });

  it('should view vehicle details', () => {
    cy.visit('/browse');
    cy.get('[data-testid="vehicle-card"]').first().click();
    cy.contains(/Description|Specifications/i).should('be.visible');
  });
});
