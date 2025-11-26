import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { connectDB, setupDatabaseEventListeners, checkDatabaseHealth } from './utils/database.js';
import postsRouter from './routes/posts.js';
import authRouter from './routes/auth.js';
import errorHandler from './middleware/errorHandler.js';
import logger from './utils/logger.js';

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use(limiter);

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  next();
});

// Database connection
const initializeDatabase = async () => {
  try {
    await connectDB();
    setupDatabaseEventListeners();
    
    if (process.env.NODE_ENV === 'development') {
      // Initialize with sample data in development
      const { initializeWithSampleData } = await import('./utils/database.js');
      await initializeWithSampleData();
    }
  } catch (error) {
    logger.error('Database initialization failed:', error);
    process.exit(1);
  }
};

// Initialize database
initializeDatabase();

// Routes
app.use('/api/posts', postsRouter);
app.use('/api/auth', authRouter);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const dbHealth = await checkDatabaseHealth();
    
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: dbHealth
    });
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: 'Service unavailable',
      database: { status: 'unhealthy' }
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;