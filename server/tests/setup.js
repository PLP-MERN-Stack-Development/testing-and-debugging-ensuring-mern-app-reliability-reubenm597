import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connectDB, clearDatabase, dropDatabase } from '../src/utils/database.js';

let mongoServer;

// Setup in-memory MongoDB for testing
beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = 'test';
  
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Override MONGODB_TEST_URI for tests
  process.env.MONGODB_TEST_URI = mongoUri;
  
  await connectDB();
});

// Clear all test data after each test
afterEach(async () => {
  await clearDatabase();
});

// Close database connection after all tests
afterAll(async () => {
  await dropDatabase();
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Global test utilities
global.testDB = {
  clear: clearDatabase,
  drop: dropDatabase,
  getUri: () => mongoServer.getUri()
};