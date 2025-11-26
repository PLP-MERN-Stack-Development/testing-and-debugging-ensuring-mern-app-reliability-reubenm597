import Post from '../models/Post.js';
import logger from '../utils/logger.js';

// Get all posts with optional filtering and pagination
const getPosts = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      author, 
      published 
    } = req.query;

    const filter = {};
    
    if (category) filter.category = category;
    if (author) filter.author = author;
    if (published !== undefined) filter.published = published === 'true';

    const posts = await Post.find(filter)
      .populate('author', 'username email') // Remove category population
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Post.countDocuments(filter);

    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    logger.error('Error fetching posts:', error);
    next(error);
  }
};

// Get single post by ID
const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username email'); // Remove category population

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    logger.error('Error fetching post:', error);
    next(error);
  }
};

// Create new post
const createPost = async (req, res, next) => {
  try {
    const { title, content, category, published } = req.body;

    const post = new Post({
      title,
      content,
      category, // Now accepts string
      published,
      author: req.user.id
    });

    await post.save();
    await post.populate('author', 'username email');

    logger.info(`Post created: ${post._id} by user ${req.user.id}`);
    res.status(201).json(post);
  } catch (error) {
    logger.error('Error creating post:', error);
    next(error);
  }
};

// Update post
const updatePost = async (req, res, next) => {
  try {
    const { title, content, category, published } = req.body;
    
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this post' });
    }

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (content !== undefined) updates.content = content;
    if (category !== undefined) updates.category = category;
    if (published !== undefined) updates.published = published;

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('author', 'username email');

    logger.info(`Post updated: ${updatedPost._id} by user ${req.user.id}`);
    res.json(updatedPost);
  } catch (error) {
    logger.error('Error updating post:', error);
    next(error);
  }
};

// Delete post (unchanged)
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);

    logger.info(`Post deleted: ${req.params.id} by user ${req.user.id}`);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    logger.error('Error deleting post:', error);
    next(error);
  }
};

export {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
};