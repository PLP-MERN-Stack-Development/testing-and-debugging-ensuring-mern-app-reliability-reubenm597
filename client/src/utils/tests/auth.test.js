import jwt from 'jsonwebtoken';
import { generateToken, verifyToken } from '../auth.js';

jest.mock('jsonwebtoken');

describe('Auth Utilities', () => {
  const mockPayload = { id: '123', email: 'test@example.com' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateToken', () => {
    it('should generate a token with correct payload and options', () => {
      const mockToken = 'mock.jwt.token';
      jwt.sign.mockReturnValue(mockToken);

      const result = generateToken(mockPayload);

      expect(jwt.sign).toHaveBeenCalledWith(
        mockPayload,
        process.env.JWT_SECRET || 'your-fallback-secret-key',
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );
      expect(result).toBe(mockToken);
    });

    it('should generate token with custom expiration', () => {
      generateToken(mockPayload, '1h');

      expect(jwt.sign).toHaveBeenCalledWith(
        mockPayload,
        expect.any(String),
        { expiresIn: '1h' }
      );
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const mockToken = 'valid.jwt.token';
      jwt.verify.mockReturnValue(mockPayload);

      const result = verifyToken(mockToken);

      expect(jwt.verify).toHaveBeenCalledWith(
        mockToken,
        process.env.JWT_SECRET || 'your-fallback-secret-key'
      );
      expect(result).toEqual(mockPayload);
    });

    it('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token';
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => {
        verifyToken(invalidToken);
      }).toThrow('Invalid token');
    });
  });
});