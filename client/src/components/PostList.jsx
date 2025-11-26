import React, { useEffect, useState } from 'react';
import usePosts from '../hooks/usePosts';

const PostList = () => {
  const { posts, loading, error, fetchPosts } = usePosts();
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchPosts({ category: selectedCategory || undefined });
  }, [selectedCategory, fetchPosts]);

  const postsArray = Array.isArray(posts) ? posts : [];
  const categories = [...new Set(postsArray.map(post => post.category).filter(Boolean))];

  if (loading) {
    return (
      <div className="post-list" data-testid="post-list">
        <div className="loading-spinner" data-testid="loading-spinner">
          <div className="spinner"></div>
          <p>Loading posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="post-list" data-testid="post-list">
        <div className="error-message" data-testid="error-message">
          <h3>Error loading posts</h3>
          <p>{error}</p>
          <button 
            onClick={() => fetchPosts({ category: selectedCategory || undefined })}
            className="btn btn-primary"
            style={{ marginTop: '1rem' }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="post-list" data-testid="post-list">
      <div className="filters">
        <h2>Posts {postsArray.length > 0 ? `(${postsArray.length})` : ''}</h2>
        
        {categories.length > 0 && (
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            data-testid="category-filter"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="posts-grid">
        {postsArray.length === 0 ? (
          <div className="no-posts-message" data-testid="no-posts-message">
            <h3>No posts found</h3>
            <p>There are no posts to display.</p>
          </div>
        ) : (
          postsArray.map((post) => (
            <div key={post._id} className="post-card" data-testid="post-item">
              <div className="post-header">
                <h3>{post.title}</h3>
                {post.published === false && (
                  <span className="draft-badge">Draft</span>
                )}
              </div>
              
              <div className="post-content">
                {post.content}
              </div>
              
              <div className="post-meta">
                <div className="meta-left">
                  <span className="author">By {post.author?.username || 'Unknown'}</span>
                  {post.category && (
                    <span className="category">{post.category}</span>
                  )}
                </div>
                <div className="meta-right">
                  <span className="date">{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="post-actions">
                <button 
                  onClick={() => {
                    alert('Delete functionality requires authentication. This will be implemented with user login.');
                  }}
                  data-testid="post-delete-button"
                  className="btn btn-danger btn-sm"
                  style={{ opacity: 0.6, cursor: 'not-allowed' }}
                >
                  🔒 Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      {postsArray.length > 0 && (
        <div className="success-message">
          <strong>✅ Success!</strong> Loaded {postsArray.length} posts from the database.
          <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
            The MERN stack application is working correctly with MongoDB Atlas!
          </div>
        </div>
      )}
    </div>
  );
};

export default PostList;