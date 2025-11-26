import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PostList from '../../components/PostList';
import * as api from '../../utils/api';

// Mock the API module
jest.mock('../../utils/api');

describe('PostList Integration', () => {
  const mockPosts = [
    {
      _id: '1',
      title: 'First Post',
      content: 'This is the first post content',
      author: { username: 'user1' },
      createdAt: '2023-01-01T00:00:00.000Z'
    },
    {
      _id: '2',
      title: 'Second Post',
      content: 'This is the second post content',
      author: { username: 'user2' },
      createdAt: '2023-01-02T00:00:00.000Z'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    api.fetchPosts.mockResolvedValue(mockPosts);
    api.deletePost.mockResolvedValue({});
  });

  it('loads and displays posts', async () => {
    render(<PostList />);

    // Check loading state
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByTestId('post-list')).toBeInTheDocument();
    });

    // Check if posts are displayed
    expect(screen.getByText('First Post')).toBeInTheDocument();
    expect(screen.getByText('Second Post')).toBeInTheDocument();
    expect(screen.getByText('user1')).toBeInTheDocument();
    expect(screen.getByText('user2')).toBeInTheDocument();
  });

  it('filters posts by category', async () => {
    const filteredPosts = [mockPosts[0]];
    api.fetchPosts.mockResolvedValue(filteredPosts);

    render(<PostList />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByTestId('post-list')).toBeInTheDocument();
    });

    // Change category filter
    const categoryFilter = screen.getByTestId('category-filter');
    fireEvent.change(categoryFilter, { target: { value: 'tech' } });

    // Check if API was called with filter
    await waitFor(() => {
      expect(api.fetchPosts).toHaveBeenCalledWith({ category: 'tech' });
    });
  });

  it('deletes a post when delete button is clicked', async () => {
    render(<PostList />);

    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByTestId('post-list')).toBeInTheDocument();
    });

    // Mock confirm dialog
    window.confirm = jest.fn(() => true);

    // Click delete button on first post
    const deleteButtons = screen.getAllByTestId('post-delete-button');
    fireEvent.click(deleteButtons[0]);

    // Check if confirm was called
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this post?');

    // Check if delete API was called
    await waitFor(() => {
      expect(api.deletePost).toHaveBeenCalledWith('1');
    });
  });

  it('shows error message when fetch fails', async () => {
    const errorMessage = 'Failed to fetch posts';
    api.fetchPosts.mockRejectedValue(new Error(errorMessage));

    render(<PostList />);

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent(errorMessage);
    });
  });

  it('displays no posts message when empty', async () => {
    api.fetchPosts.mockResolvedValue([]);

    render(<PostList />);

    // Wait for empty state
    await waitFor(() => {
      expect(screen.getByTestId('no-posts-message')).toBeInTheDocument();
    });
  });

  it('cancels delete when user declines confirmation', async () => {
    render(<PostList />);

    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByTestId('post-list')).toBeInTheDocument();
    });

    // Mock confirm dialog to return false
    window.confirm = jest.fn(() => false);

    // Click delete button
    const deleteButtons = screen.getAllByTestId('post-delete-button');
    fireEvent.click(deleteButtons[0]);

    // Check that delete API was not called
    expect(api.deletePost).not.toHaveBeenCalled();
  });
});