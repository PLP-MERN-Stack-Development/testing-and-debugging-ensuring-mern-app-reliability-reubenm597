describe('Posts Management', () => {
  beforeEach(() => {
    // Login before each test
    cy.login('test@example.com', 'password123');
    cy.visit('/posts');
  });

  it('should create a new post', () => {
    cy.intercept('POST', '/api/posts').as('createPost');

    cy.get('[data-testid="create-post-button"]').click();
    
    cy.get('[data-testid="title-input"]').type('My New Post');
    cy.get('[data-testid="content-input"]').type('This is the content of my new post');
    cy.get('[data-testid="category-input"]').type('Technology');
    
    cy.get('[data-testid="submit-button"]').click();

    cy.wait('@createPost').then((interception) => {
      expect(interception.response.statusCode).to.equal(201);
    });

    cy.get('[data-testid="post-list"]').should('contain', 'My New Post');
  });

  it('should display posts list', () => {
    cy.intercept('GET', '/api/posts').as('getPosts');

    cy.wait('@getPosts').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });

    cy.get('[data-testid="post-item"]').should('have.length.greaterThan', 0);
  });

  it('should edit an existing post', () => {
    cy.intercept('PUT', '/api/posts/*').as('updatePost');

    cy.get('[data-testid="post-edit-button"]').first().click();
    
    cy.get('[data-testid="title-input"]').clear().type('Updated Post Title');
    cy.get('[data-testid="submit-button"]').click();

    cy.wait('@updatePost').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });

    cy.get('[data-testid="post-list"]').should('contain', 'Updated Post Title');
  });

  it('should delete a post', () => {
    cy.intercept('DELETE', '/api/posts/*').as('deletePost');

    cy.get('[data-testid="post-delete-button"]').first().click();
    cy.get('[data-testid="confirm-delete-button"]').click();

    cy.wait('@deletePost').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });

    cy.get('[data-testid="success-message"]').should('contain', 'Post deleted');
  });
});