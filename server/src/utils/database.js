import mongoose from 'mongoose';
import logger from './logger.js';

// Database connection options for Mongoose 6+
const connectionOptions = {
  // Remove deprecated options
  // useNewUrlParser and useUnifiedTopology are no longer needed in Mongoose 6+
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

// MongoDB connection URI
const getMongoURI = () => {
  if (process.env.NODE_ENV === 'test') {
    return process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/mern-testing-test';
  }
  return process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-testing';
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = getMongoURI();
    
    // Mask password in logs for security
    const maskedURI = mongoURI.replace(/mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/, 'mongodb$1://***:***@');
    logger.info(`Connecting to MongoDB: ${maskedURI}`);
    
    const conn = await mongoose.connect(mongoURI, connectionOptions);

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    logger.info(`Database Name: ${conn.connection.name}`);
    
    return conn;
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    
    // Enhanced error handling
    if (error.name === 'MongoNetworkError') {
      logger.error('Network error - Please check if MongoDB is running and accessible');
    } else if (error.name === 'MongoServerSelectionError') {
      logger.error('Server selection error - Please check your MongoDB connection string');
    } else if (error.name === 'MongooseServerSelectionError') {
      logger.error('Mongoose server selection error - Check network connectivity');
    }
    
    process.exit(1);
  }
};

// Disconnect from MongoDB
const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected successfully');
  } catch (error) {
    logger.error('MongoDB disconnection error:', error);
    throw error;
  }
};

// Check database connection status
const getConnectionStatus = () => {
  return {
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host,
    name: mongoose.connection.name,
    port: mongoose.connection.port,
    models: Object.keys(mongoose.connection.models)
  };
};

// Database health check
const checkDatabaseHealth = async () => {
  try {
    // Simple query to check if database is responsive
    await mongoose.connection.db.admin().ping();
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      details: getConnectionStatus()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
      details: getConnectionStatus()
    };
  }
};

// Clear database (for testing purposes)
const clearDatabase = async () => {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('clearDatabase can only be used in test environment');
  }

  try {
    const collections = mongoose.connection.collections;
    
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
    
    logger.info('Test database cleared successfully');
  } catch (error) {
    logger.error('Error clearing test database:', error);
    throw error;
  }
};

// Drop database (for testing purposes)
const dropDatabase = async () => {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('dropDatabase can only be used in test environment');
  }

  try {
    await mongoose.connection.db.dropDatabase();
    logger.info('Test database dropped successfully');
  } catch (error) {
    logger.error('Error dropping test database:', error);
    throw error;
  }
};

// Initialize database with sample data (for development)
const initializeWithSampleData = async () => {
  if (process.env.NODE_ENV !== 'development') {
    logger.warn('Sample data initialization is only recommended for development environment');
    return;
  }

  try {
    const User = mongoose.model('User');
    const Post = mongoose.model('Post');
    
    // Check if sample data already exists
    const userCount = await User.countDocuments();
    const postCount = await Post.countDocuments();
    
    if (userCount > 0 || postCount > 0) {
      logger.info('Sample data already exists, skipping initialization');
      return;
    }
    
    // Create sample users
    const sampleUsers = [
      {
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
      },
      {
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123'
      },
      {
        username: 'janedoe',
        email: 'jane@example.com',
        password: 'password123'
      }
    ];
    
    const createdUsers = await User.insertMany(sampleUsers);
    logger.info(`Created ${createdUsers.length} sample users`);
    
    // Create sample posts
    const samplePosts = [
      {
        title: 'Welcome to Our Blog',
        content: 'This is the first post in our amazing blog. We are excited to share our thoughts and experiences with you.',
        author: createdUsers[0]._id,
        published: true
      },
      {
        title: 'Getting Started with MERN Stack',
        content: 'The MERN stack is a powerful combination of technologies for building modern web applications. In this post, we will explore the basics.',
        author: createdUsers[1]._id,
        published: true
      },
      {
        title: 'The Importance of Testing',
        content: 'Testing is crucial for building reliable applications. Learn how to implement comprehensive testing strategies in your projects.',
        author: createdUsers[2]._id,
        published: false
      }
    ];
    
    const createdPosts = await Post.insertMany(samplePosts);
    logger.info(`Created ${createdPosts.length} sample posts`);
    
    logger.info('Sample data initialization completed successfully');
  } catch (error) {
    logger.error('Error initializing sample data:', error);
    throw error;
  }
};

// Database event listeners
const setupDatabaseEventListeners = () => {
  mongoose.connection.on('connected', () => {
    logger.info('Mongoose connected to MongoDB');
  });

  mongoose.connection.on('error', (error) => {
    logger.error('Mongoose connection error:', error);
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('Mongoose disconnected from MongoDB');
  });

  mongoose.connection.on('reconnected', () => {
    logger.info('Mongoose reconnected to MongoDB');
  });

  // Close the Mongoose connection when the application is terminated
  process.on('SIGINT', async () => {
    try {
      await mongoose.connection.close();
      logger.info('Mongoose connection closed through app termination');
      process.exit(0);
    } catch (error) {
      logger.error('Error closing mongoose connection:', error);
      process.exit(1);
    }
  });
};

export {
  connectDB,
  disconnectDB,
  getConnectionStatus,
  checkDatabaseHealth,
  clearDatabase,
  dropDatabase,
  initializeWithSampleData,
  setupDatabaseEventListeners,
  getMongoURI
};