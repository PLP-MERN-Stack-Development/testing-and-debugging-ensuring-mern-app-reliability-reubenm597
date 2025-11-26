import mongoose from 'mongoose';
import logger from '../utils/logger.js';

class DatabaseManager {
  constructor() {
    this.isConnected = false;
    this.connection = null;
  }

  async connect() {
    if (this.isConnected) {
      return this.connection;
    }

    try {
      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      };

      const mongoURI = this.getMongoURI();
      
      this.connection = await mongoose.connect(mongoURI, options);
      this.isConnected = true;
      
      logger.info(`MongoDB Connected: ${this.connection.connection.host}`);
      this.setupEventListeners();
      
      return this.connection;
    } catch (error) {
      logger.error('MongoDB connection failed:', error);
      throw error;
    }
  }

  getMongoURI() {
    const env = process.env.NODE_ENV || 'development';
    
    const uris = {
      test: process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/mern-testing-test',
      development: process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-testing',
      production: process.env.MONGODB_URI
    };

    return uris[env] || uris.development;
  }

  setupEventListeners() {
    mongoose.connection.on('connected', () => {
      logger.info('Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (error) => {
      logger.error('Mongoose connection error:', error);
      this.isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('Mongoose disconnected from MongoDB');
      this.isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('Mongoose reconnected to MongoDB');
      this.isConnected = true;
    });
  }

  async disconnect() {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      logger.info('MongoDB disconnected successfully');
    } catch (error) {
      logger.error('MongoDB disconnection error:', error);
      throw error;
    }
  }

  getStatus() {
    return {
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name,
      models: Object.keys(mongoose.connection.models || {})
    };
  }
}

// Create singleton instance
const databaseManager = new DatabaseManager();

export default databaseManager;