import express from 'express';
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
} from '../controllers/postsController.js';
import { authenticate } from '../middleware/auth.js';
import { validatePost } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', getPosts);
router.get('/:id', getPostById);

// Protected routes
router.post('/', authenticate, validatePost, createPost);
router.put('/:id', authenticate, validatePost, updatePost);
router.delete('/:id', authenticate, deletePost);

export default router;