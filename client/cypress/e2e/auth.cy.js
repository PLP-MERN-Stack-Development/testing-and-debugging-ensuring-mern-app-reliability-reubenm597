describe('Authentication Flows', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should register a new user', () => {
    cy.intercept('POST', '/api/auth/register').as('registerRequest');

    cy.get('[data-testid="register-link"]').click();
    
    cy.get('[data-testid="username-input"]').type('testuser');
    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="confirm-password-input"]').type('password123');
    
    cy.get('[data-testid="register-button"]').click();

    cy.wait('@registerRequest').then((interception) => {
      expect(interception.response.statusCode).to.equal(201);
    });

    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="welcome-message"]').should('contain', 'testuser');
  });

  it('should log in existing user', () => {
    cy.intercept('POST', '/api/auth/login').as('loginRequest');

    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="login-button"]').click();

    cy.wait('@loginRequest').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });

    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="user-menu"]').should('be.visible');
  });

  it('should show error for invalid login', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: { error: 'Invalid credentials' }
    }).as('loginRequest');

    cy.get('[data-testid="email-input"]').type('wrong@example.com');
    cy.get('[data-testid="password-input"]').type('wrongpassword');
    cy.get('[data-testid="login-button"]').click();

    cy.wait('@loginRequest');
    cy.get('[data-testid="error-message"]').should('contain', 'Invalid credentials');
  });
});