import React, { useState } from 'react';
import usePosts from '../hooks/usePosts';

const PostForm = ({ onSuccess, initialData = {} }) => {
  const { createPost, updatePost, loading, error } = usePosts();
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    content: initialData.content || '',
    category: initialData.category || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (initialData._id) {
        await updatePost(initialData._id, formData);
      } else {
        await createPost(formData);
      }
      
      setFormData({ title: '', content: '', category: '' });
      onSuccess?.();
    } catch (err) {
      console.error('Form submission error:', err);
      // Error is already set in the hook
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="post-form" data-testid="post-form">
      {error && (
        <div className="error-message" data-testid="error-message">
          {error}
          <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
            <strong>Note:</strong> Authentication is required to create posts. 
            For now, you can view existing posts on the main page.
          </div>
        </div>
      )}
      
      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          disabled={true} // Disable until auth is implemented
          data-testid="title-input"
          placeholder="Authentication required to create posts"
        />
      </div>

      <div className="form-group">
        <label htmlFor="content">Content *</label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          rows="5"
          disabled={true} // Disable until auth is implemented
          data-testid="content-input"
          placeholder="Please log in to create new posts"
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">Category</label>
        <input
          type="text"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          disabled={true} // Disable until auth is implemented
          data-testid="category-input"
          placeholder="Disabled until authentication is set up"
        />
      </div>

      <button 
        type="submit" 
        disabled={true} // Disable until auth is implemented
        data-testid="submit-button"
        style={{ opacity: 0.6, cursor: 'not-allowed' }}
      >
        🔒 Create Post (Login Required)
      </button>

      <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0f8ff', borderRadius: '0.375rem' }}>
        <strong>Development Note:</strong> Authentication is required to create posts. 
        The posts are read-only for demonstration purposes. Check the main page to see existing posts.
      </div>
    </form>
  );
};

export default PostForm;