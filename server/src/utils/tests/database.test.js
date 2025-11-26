import mongoose from 'mongoose';
import { 
  connectDB, 
  disconnectDB, 
  getConnectionStatus, 
  checkDatabaseHealth,
  clearDatabase,
  getMongoURI 
} from '../database.js';
import logger from '../logger.js';

// Mock logger to avoid console output during tests
jest.mock('../logger.js');

describe('Database Utilities', () => {
  let originalEnv;

  beforeAll(() => {
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    // Restore original environment variables
    process.env = { ...originalEnv };
    jest.clearAllMocks();
  });

  describe('getMongoURI', () => {
    it('should return test URI for test environment', () => {
      process.env.NODE_ENV = 'test';
      process.env.MONGODB_TEST_URI = 'mongodb://test-host/test-db';
      
      const uri = getMongoURI();
      expect(uri).toBe('mongodb://test-host/test-db');
    });

    it('should return default test URI when no test env var', () => {
      process.env.NODE_ENV = 'test';
      delete process.env.MONGODB_TEST_URI;
      
      const uri = getMongoURI();
      expect(uri).toBe('mongodb://localhost:27017/mern-testing-test');
    });

    it('should return production URI for production environment', () => {
      process.env.NODE_ENV = 'production';
      process.env.MONGODB_URI = 'mongodb://prod-host/prod-db';
      
      const uri = getMongoURI();
      expect(uri).toBe('mongodb://prod-host/prod-db');
    });

    it('should return default URI when no env var', () => {
      process.env.NODE_ENV = 'development';
      delete process.env.MONGODB_URI;
      
      const uri = getMongoURI();
      expect(uri).toBe('mongodb://localhost:27017/mern-testing');
    });
  });

  describe('getConnectionStatus', () => {
    it('should return connection status information', () => {
      // Mock mongoose connection
      mongoose.connection.readyState = 1;
      mongoose.connection.host = 'localhost';
      mongoose.connection.name = 'test-db';
      mongoose.connection.port = 27017;
      mongoose.connection.models = { User: {}, Post: {} };

      const status = getConnectionStatus();

      expect(status).toEqual({
        readyState: 1,
        host: 'localhost',
        name: 'test-db',
        port: 27017,
        models: ['User', 'Post']
      });
    });
  });

  describe('checkDatabaseHealth', () => {
    it('should return healthy status when database is responsive', async () => {
      // Mock successful ping
      mongoose.connection.db = {
        admin: jest.fn().mockReturnValue({
          ping: jest.fn().mockResolvedValue(true)
        })
      };

      const health = await checkDatabaseHealth();

      expect(health.status).toBe('healthy');
      expect(health.timestamp).toBeDefined();
      expect(health.details).toBeDefined();
    });

    it('should return unhealthy status when database ping fails', async () => {
      // Mock failed ping
      mongoose.connection.db = {
        admin: jest.fn().mockReturnValue({
          ping: jest.fn().mockRejectedValue(new Error('Connection failed'))
        })
      };

      const health = await checkDatabaseHealth();

      expect(health.status).toBe('unhealthy');
      expect(health.error).toBe('Connection failed');
      expect(health.timestamp).toBeDefined();
    });
  });

  describe('clearDatabase', () => {
    it('should throw error when not in test environment', async () => {
      process.env.NODE_ENV = 'development';

      await expect(clearDatabase()).rejects.toThrow('clearDatabase can only be used in test environment');
    });

    it('should clear all collections in test environment', async () => {
      process.env.NODE_ENV = 'test';
      
      const mockDeleteMany = jest.fn().mockResolvedValue({});
      mongoose.connection.collections = {
        users: { deleteMany: mockDeleteMany },
        posts: { deleteMany: mockDeleteMany }
      };

      await clearDatabase();

      expect(mockDeleteMany).toHaveBeenCalledTimes(2);
    });
  });

  describe('connectDB', () => {
    it('should handle connection errors gracefully', async () => {
      const mockError = new Error('Connection failed');
      mongoose.connect = jest.fn().mockRejectedValue(mockError);

      // Mock process.exit to prevent test from actually exiting
      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

      await connectDB();

      expect(mockExit).toHaveBeenCalledWith(1);
      expect(logger.error).toHaveBeenCalledWith('MongoDB connection error:', mockError);

      mockExit.mockRestore();
    });
  });

  describe('disconnectDB', () => {
    it('should disconnect successfully', async () => {
      mongoose.disconnect = jest.fn().mockResolvedValue();

      await disconnectDB();

      expect(mongoose.disconnect).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith('MongoDB disconnected successfully');
    });

    it('should handle disconnection errors', async () => {
      const mockError = new Error('Disconnection failed');
      mongoose.disconnect = jest.fn().mockRejectedValue(mockError);

      await expect(disconnectDB()).rejects.toThrow('Disconnection failed');
      expect(logger.error).toHaveBeenCalledWith('MongoDB disconnection error:', mockError);
    });
  });
});