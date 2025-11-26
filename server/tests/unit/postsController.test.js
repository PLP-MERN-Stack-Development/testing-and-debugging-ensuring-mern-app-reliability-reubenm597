import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
} from '../../src/controllers/postsController.js';
import Post from '../../src/models/Post.js';

jest.mock('../../src/models/Post');
jest.mock('../../src/utils/logger');

describe('Posts Controller', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      params: {},
      query: {},
      body: {},
      user: { id: 'user123' }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  describe('getPosts', () => {
    it('should return posts with pagination', async () => {
      const mockPosts = [{ title: 'Post 1' }, { title: 'Post 2' }];
      Post.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnValue(mockPosts)
      });
      Post.countDocuments.mockResolvedValue(2);

      mockReq.query = { page: '1', limit: '10' };

      await getPosts(mockReq, mockRes, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith({
        posts: mockPosts,
        totalPages: 1,
        currentPage: 1,
        total: 2
      });
    });
  });

  describe('getPostById', () => {
    it('should return post when found', async () => {
      const mockPost = { _id: '123', title: 'Test Post' };
      Post.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockPost)
      });

      mockReq.params.id = '123';

      await getPostById(mockReq, mockRes, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith(mockPost);
    });

    it('should return 404 when post not found', async () => {
      Post.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });

      mockReq.params.id = 'nonexistent';

      await getPostById(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Post not found' });
    });
  });

  describe('createPost', () => {
    it('should create a new post', async () => {
      const mockPost = {
        _id: 'new123',
        title: 'New Post',
        content: 'Content',
        author: 'user123',
        save: jest.fn().mockResolvedValue(true),
        populate: jest.fn().mockResolvedValue({
          _id: 'new123',
          title: 'New Post',
          author: { username: 'testuser' }
        })
      };

      Post.mockImplementation(() => mockPost);
      mockReq.body = { title: 'New Post', content: 'Content' };

      await createPost(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalled();
    });
  });
});