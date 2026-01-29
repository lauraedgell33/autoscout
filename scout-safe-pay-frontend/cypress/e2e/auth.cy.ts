describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display login page', () => {
    cy.visit('/login');
    cy.contains('Sign In').should('be.visible');
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
  });

  it('should show error on invalid credentials', () => {
    cy.login('invalid@email.com', 'wrongpassword');
    cy.contains(/invalid credentials|error/i).should('be.visible');
  });

  it('should successfully login with valid credentials', () => {
    cy.login('admin@autoscout.dev', 'Admin123456');
    cy.url().should('include', '/dashboard');
  });

  it('should logout successfully', () => {
    cy.login('admin@autoscout.dev', 'Admin123456');
    cy.logout();
    cy.url().should('include', '/');
  });
});
