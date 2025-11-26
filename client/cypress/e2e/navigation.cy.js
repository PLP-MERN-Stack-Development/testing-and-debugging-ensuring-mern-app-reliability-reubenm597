describe('Navigation Flows', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should navigate between pages correctly', () => {
    // Check initial page
    cy.url().should('include', '/posts');
    
    // Navigate to create post page
    cy.get('a[href="/create-post"]').click();
    cy.url().should('include', '/create-post');
    
    // Go back to posts
    cy.get('a[href="/posts"]').click();
    cy.url().should('include', '/posts');
  });

  it('should maintain state during navigation', () => {
    // This test would verify that component state is maintained
    // when navigating between pages
    cy.get('[data-testid="post-list"]').should('exist');
    
    // Navigate away and back
    cy.visit('/create-post');
    cy.visit('/posts');
    
    // Should still have the post list
    cy.get('[data-testid="post-list"]').should('exist');
  });

  it('should handle 404 pages', () => {
    cy.visit('/nonexistent-page');
    
    // Should show a not found message
    cy.contains('Page not found').should('exist');
  });

  it('should have working header navigation', () => {
    cy.get('header').should('exist');
    cy.get('header h1').should('contain', 'MERN Testing App');
    
    // Check navigation links
    cy.get('header nav a').should('have.length.at.least', 2);
    cy.get('header nav a').first().should('have.attr', 'href').and('include', '/posts');
  });
});