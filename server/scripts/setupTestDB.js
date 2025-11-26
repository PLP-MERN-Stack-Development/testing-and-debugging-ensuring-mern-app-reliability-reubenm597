import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const setupTestDatabase = async () => {
  try {
    // Connect to the test database
    const testDbUri = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/mern-testing-test';
    
    await mongoose.connect(testDbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to test database');

    // Create test collections or seed data if needed
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Existing collections:', collections.map(c => c.name));

    // Create indexes if needed
    // await mongoose.connection.collection('posts').createIndex({ title: 'text' });

    console.log('Test database setup completed');
    
    await mongoose.disconnect();
    console.log('Disconnected from test database');
    
  } catch (error) {
    console.error('Test database setup failed:', error);
    process.exit(1);
  }
};

// Run if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupTestDatabase();
}

export default setupTestDatabase;