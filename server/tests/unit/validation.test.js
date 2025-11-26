import {
  validatePost,
  validateRegistration,
  validateLogin
} from '../../src/middleware/validation.js';

describe('Validation Middleware', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      body: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  describe('validatePost', () => {
    it('should call next for valid post data', () => {
      mockReq.body = {
        title: 'Valid Post Title',
        content: 'This is a valid post content that meets the minimum length requirement.'
      };

      validatePost(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should return 400 for missing title', () => {
      mockReq.body = {
        content: 'This is content but no title.'
      };

      validatePost(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Title is required and must be at least 3 characters long'
      });
    });

    it('should return 400 for short title', () => {
      mockReq.body = {
        title: 'AB',
        content: 'Valid content here.'
      };

      validatePost(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 for missing content', () => {
      mockReq.body = {
        title: 'Valid Title'
      };

      validatePost(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Content is required and must be at least 10 characters long'
      });
    });

    it('should return 400 for short content', () => {
      mockReq.body = {
        title: 'Valid Title',
        content: 'Short'
      };

      validatePost(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });

  describe('validateRegistration', () => {
    it('should call next for valid registration data', () => {
      mockReq.body = {
        username: 'validuser',
        email: 'valid@example.com',
        password: 'password123'
      };

      validateRegistration(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should return 400 for short username', () => {
      mockReq.body = {
        username: 'ab',
        email: 'valid@example.com',
        password: 'password123'
      };

      validateRegistration(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 for invalid email', () => {
      mockReq.body = {
        username: 'validuser',
        email: 'invalid-email',
        password: 'password123'
      };

      validateRegistration(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 for short password', () => {
      mockReq.body = {
        username: 'validuser',
        email: 'valid@example.com',
        password: '123'
      };

      validateRegistration(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });

  describe('validateLogin', () => {
    it('should call next for valid login data', () => {
      mockReq.body = {
        email: 'valid@example.com',
        password: 'password123'
      };

      validateLogin(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should return 400 for missing email', () => {
      mockReq.body = {
        password: 'password123'
      };

      validateLogin(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 for missing password', () => {
      mockReq.body = {
        email: 'valid@example.com'
      };

      validateLogin(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });
});