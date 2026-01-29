describe('Checkout Process', () => {
  beforeEach(() => {
    cy.login('admin@autoscout.dev', 'Admin123456');
    cy.addToCart('test-vehicle-1');
  });

  it('should display cart page with items', () => {
    cy.visit('/cart');
    cy.get('[data-testid="cart-item"]').should('have.length', 1);
    cy.contains(/Total|€/i).should('be.visible');
  });

  it('should proceed to checkout', () => {
    cy.visit('/cart');
    cy.get('[data-testid="checkout-btn"]').click();
    cy.url().should('include', '/checkout');
  });

  it('should validate shipping address', () => {
    cy.visit('/checkout');
    cy.get('[data-testid="checkout-next"]').click();
    cy.contains(/required|invalid/i).should('be.visible');
  });

  it('should complete checkout', () => {
    cy.visit('/checkout');
    
    // Fill shipping address
    cy.get('input[name="fullName"]').type('John Doe');
    cy.get('input[name="email"]').type('john@example.com');
    cy.get('input[name="phone"]').type('+1234567890');
    cy.get('input[name="street"]').type('123 Main St');
    cy.get('input[name="city"]').type('Berlin');
    cy.get('input[name="zipCode"]').type('10115');
    
    cy.get('[data-testid="checkout-next"]').click();
    
    // Select payment method
    cy.get('input[value="card"]').check();
    cy.get('[data-testid="checkout-next"]').click();
    
    // Complete order
    cy.get('[data-testid="place-order"]').click();
    cy.contains(/Order Confirmed|Success/i).should('be.visible');
  });
});
