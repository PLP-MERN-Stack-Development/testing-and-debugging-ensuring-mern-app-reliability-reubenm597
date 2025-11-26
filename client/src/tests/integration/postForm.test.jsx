import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PostForm from '../../components/PostForm';
import * as api from '../../utils/api';

// Mock the API module
jest.mock('../../utils/api');

describe('PostForm Integration', () => {
  const mockOnSuccess = jest.fn();
  const mockPost = {
    _id: '123',
    title: 'Test Post',
    content: 'Test content',
    category: 'tech'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('submits form with valid data and calls onSuccess', async () => {
    api.createPost.mockResolvedValueOnce({ ...mockPost, _id: '456' });

    render(<PostForm onSuccess={mockOnSuccess} />);

    // Fill out the form
    fireEvent.change(screen.getByTestId('title-input'), {
      target: { value: 'New Post' }
    });
    fireEvent.change(screen.getByTestId('content-input'), {
      target: { value: 'This is the post content' }
    });
    fireEvent.change(screen.getByTestId('category-input'), {
      target: { value: 'technology' }
    });

    // Submit the form
    fireEvent.click(screen.getByTestId('submit-button'));

    // Verify loading state
    expect(screen.getByTestId('submit-button')).toBeDisabled();

    // Wait for API call and success callback
    await waitFor(() => {
      expect(api.createPost).toHaveBeenCalledWith({
        title: 'New Post',
        content: 'This is the post content',
        category: 'technology'
      });
    });

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });

    // Verify form is reset
    expect(screen.getByTestId('title-input')).toHaveValue('');
  });

  it('handles form submission errors', async () => {
    const errorMessage = 'Failed to create post';
    api.createPost.mockRejectedValueOnce(new Error(errorMessage));

    render(<PostForm onSuccess={mockOnSuccess} />);

    // Fill out required fields
    fireEvent.change(screen.getByTestId('title-input'), {
      target: { value: 'Error Post' }
    });
    fireEvent.change(screen.getByTestId('content-input'), {
      target: { value: 'This will fail' }
    });

    // Submit the form
    fireEvent.click(screen.getByTestId('submit-button'));

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent(errorMessage);
    });

    // Verify button is enabled again
    expect(screen.getByTestId('submit-button')).not.toBeDisabled();
  });

  it('pre-fills form with initial data for editing', () => {
    render(<PostForm initialData={mockPost} onSuccess={mockOnSuccess} />);

    expect(screen.getByTestId('title-input')).toHaveValue(mockPost.title);
    expect(screen.getByTestId('content-input')).toHaveValue(mockPost.content);
    expect(screen.getByTestId('category-input')).toHaveValue(mockPost.category);
  });

  it('calls updatePost when editing existing post', async () => {
    api.updatePost.mockResolvedValueOnce({ ...mockPost, title: 'Updated Title' });

    render(<PostForm initialData={mockPost} onSuccess={mockOnSuccess} />);

    // Change title
    fireEvent.change(screen.getByTestId('title-input'), {
      target: { value: 'Updated Title' }
    });

    // Submit the form
    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(api.updatePost).toHaveBeenCalledWith(mockPost._id, {
        title: 'Updated Title',
        content: mockPost.content,
        category: mockPost.category
      });
    });
  });
});