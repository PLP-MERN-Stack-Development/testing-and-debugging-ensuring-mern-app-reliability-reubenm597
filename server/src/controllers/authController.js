import User from '../models/User.js';
import { generateToken } from '../utils/auth.js';
import logger from '../utils/logger.js';

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        error: existingUser.email === email 
          ? 'Email already registered' 
          : 'Username already taken'
      });
    }

    // Create user
    const user = new User({ username, email, password });
    await user.save();

    // Generate token
    const token = generateToken({ id: user._id, email: user.email });

    logger.info(`User registered: ${user._id}`);

    res.status(201).json({
      user: user.toJSON(),
      token
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken({ id: user._id, email: user.email });

    logger.info(`User logged in: ${user._id}`);

    res.json({
      user: user.toJSON(),
      token
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    // In a real app, you might want to blacklist the token
    logger.info(`User logged out: ${req.user.id}`);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export {
  register,
  login,
  logout,
  getMe
};