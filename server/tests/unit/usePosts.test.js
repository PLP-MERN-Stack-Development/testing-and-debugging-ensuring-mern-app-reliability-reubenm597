import { renderHook, act } from '@testing-library/react';
import usePosts from '../../hooks/usePosts';
import * as api from '../../utils/api';

jest.mock('../../utils/api');

describe('usePosts Hook', () => {
  const mockPosts = [
    { _id: '1', title: 'Post 1', content: 'Content 1' },
    { _id: '2', title: 'Post 2', content: 'Content 2' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches posts successfully', async () => {
    api.getPosts.mockResolvedValue(mockPosts);

    const { result } = renderHook(() => usePosts());

    await act(async () => {
      await result.current.fetchPosts();
    });

    expect(result.current.posts).toEqual(mockPosts);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('handles fetch posts error', async () => {
    const errorMessage = 'Failed to fetch posts';
    api.getPosts.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => usePosts());

    await act(async () => {
      try {
        await result.current.fetchPosts();
      } catch (err) {
        // Expected to throw
      }
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.loading).toBe(false);
  });

  it('creates a new post', async () => {
    const newPost = { title: 'New Post', content: 'New Content' };
    const createdPost = { ...newPost, _id: '3' };
    
    api.createPost.mockResolvedValue(createdPost);
    api.getPosts.mockResolvedValue(mockPosts);

    const { result } = renderHook(() => usePosts());

    // First fetch some posts
    await act(async () => {
      await result.current.fetchPosts();
    });

    // Then create a new post
    await act(async () => {
      await result.current.createPost(newPost);
    });

    expect(api.createPost).toHaveBeenCalledWith(newPost);
    expect(result.current.posts).toContainEqual(createdPost);
  });

  it('deletes a post', async () => {
    api.getPosts.mockResolvedValue(mockPosts);
    api.deletePost.mockResolvedValue({});

    const { result } = renderHook(() => usePosts());

    // First fetch posts
    await act(async () => {
      await result.current.fetchPosts();
    });

    // Then delete a post
    await act(async () => {
      await result.current.deletePost('1');
    });

    expect(api.deletePost).toHaveBeenCalledWith('1');
    expect(result.current.posts).not.toContainEqual(
      expect.objectContaining({ _id: '1' })
    );
  });
});