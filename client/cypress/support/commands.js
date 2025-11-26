// Custom Cypress commands

Cypress.Commands.add('login', (email, password) => {
  cy.session([email, password], () => {
    cy.request('POST', 'http://localhost:5000/api/auth/login', {
      email,
      password
    }).then((response) => {
      window.localStorage.setItem('token', response.body.token);
    });
  });
});

Cypress.Commands.add('createPost', (postData) => {
  return cy.request({
    method: 'POST',
    url: 'http://localhost:5000/api/posts',
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem('token')}`
    },
    body: postData
  });
});

Cypress.Commands.add('deletePost', (postId) => {
  return cy.request({
    method: 'DELETE',
    url: `http://localhost:5000/api/posts/${postId}`,
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem('token')}`
    }
  });
});