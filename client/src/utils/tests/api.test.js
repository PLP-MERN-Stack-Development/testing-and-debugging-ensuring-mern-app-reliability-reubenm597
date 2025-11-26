import axios from 'axios';
import { getPosts, createPost, login } from '../api';

// Mock axios
jest.mock('axios');

describe('API Utilities', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('getPosts', () => {
    it('should fetch posts successfully', async () => {
      const mockPosts = [{ id: 1, title: 'Test Post' }];
      axios.get.mockResolvedValue({ data: mockPosts });

      const result = await getPosts();

      expect(axios.get).toHaveBeenCalledWith('/posts', { params: {} });
      expect(result).toEqual(mockPosts);
    });

    it('should fetch posts with filters', async () => {
      const filters = { category: 'tech', page: 1 };
      axios.get.mockResolvedValue({ data: [] });

      await getPosts(filters);

      expect(axios.get).toHaveBeenCalledWith('/posts', { params: filters });
    });
  });

  describe('createPost', () => {
    it('should create a post with auth header', async () => {
      const postData = { title: 'New Post', content: 'Content' };
      const mockResponse = { id: 1, ...postData };
      localStorage.setItem('token', 'test-token');
      axios.post.mockResolvedValue({ data: mockResponse });

      const result = await createPost(postData);

      expect(axios.post).toHaveBeenCalledWith('/posts', postData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const credentials = { email: 'test@example.com', password: 'password' };
      const mockResponse = { user: { id: 1 }, token: 'jwt-token' };
      axios.post.mockResolvedValue({ data: mockResponse });

      const result = await login(credentials.email, credentials.password);

      expect(axios.post).toHaveBeenCalledWith('/auth/login', credentials);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('error handling', () => {
    it('should handle API errors', async () => {
      const errorMessage = 'Network Error';
      axios.get.mockRejectedValue(new Error(errorMessage));

      await expect(getPosts()).rejects.toThrow(errorMessage);
    });

    it('should handle response errors', async () => {
      const errorResponse = {
        response: {
          data: { error: 'Invalid credentials' }
        }
      };
      axios.post.mockRejectedValue(errorResponse);

      await expect(login('wrong@example.com', 'wrong')).rejects.toThrow('Invalid credentials');
    });
  });
});