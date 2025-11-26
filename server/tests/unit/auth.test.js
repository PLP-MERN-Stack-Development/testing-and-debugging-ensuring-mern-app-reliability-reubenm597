const { generateToken, verifyToken } = require('../../src/utils/auth');
const User = require('../../src/models/User');

describe('Authentication Utilities', () => {
  describe('generateToken', () => {
    it('generates a valid JWT token', () => {
      const user = { id: '123', email: 'test@example.com' };
      const token = generateToken(user);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      
      // Verify token can be decoded
      const decoded = verifyToken(token);
      expect(decoded.id).toBe(user.id);
      expect(decoded.email).toBe(user.email);
    });
  });

  describe('verifyToken', () => {
    it('verifies a valid token', () => {
      const user = { id: '123', email: 'test@example.com' };
      const token = generateToken(user);
      
      const decoded = verifyToken(token);
      expect(decoded.id).toBe(user.id);
      expect(decoded.email).toBe(user.email);
    });

    it('throws error for invalid token', () => {
      expect(() => {
        verifyToken('invalid-token');
      }).toThrow();
    });

    it('throws error for expired token', () => {
      // Create a token that expires immediately
      const expiredToken = generateToken({ id: '123' }, '1ms');
      
      // Wait for token to expire
      setTimeout(() => {
        expect(() => {
          verifyToken(expiredToken);
        }).toThrow('jwt expired');
      }, 10);
    });
  });
});