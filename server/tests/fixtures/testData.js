// Test data fixtures for consistent testing

export const testUser = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'password123'
};

export const testAdmin = {
  username: 'adminuser',
  email: 'admin@example.com',
  password: 'admin123',
  role: 'admin'
};

export const testPost = {
  title: 'Test Post Title',
  content: 'This is a test post content that is long enough to pass validation.',
  category: '507f1f77bcf86cd799439011' // Valid ObjectId
};

export const invalidPost = {
  title: 'AB', // Too short
  content: 'Short' // Too short
};

export const updatedPost = {
  title: 'Updated Post Title',
  content: 'This is the updated content of the post, which is also long enough.'
};

// MongoDB ObjectIds for testing
export const validObjectId = '507f1f77bcf86cd799439011';
export const anotherValidObjectId = '507f1f77bcf86cd799439012';

// JWT token for testing (this is a mock token, not valid for real authentication)
export const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YzVjNGU0ZGM1MjMzMDIwMDAwMDAwMSIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsImlhdCI6MTcwNzU2ODAwMCwiZXhwIjoxNzA4MTcyODAwfQ.mock-signature';

export default {
  testUser,
  testAdmin,
  testPost,
  invalidPost,
  updatedPost,
  validObjectId,
  anotherValidObjectId,
  mockToken
};