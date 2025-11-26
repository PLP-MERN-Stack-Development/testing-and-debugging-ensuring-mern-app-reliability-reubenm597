import { useState, useCallback } from 'react';
import { createPost, getPosts, updatePost, deletePost } from '../utils/api';

const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPosts = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🎯 Fetching posts with filters:', filters);
      const data = await getPosts(filters);
      console.log('📦 Raw API response:', data);
      
      // The API returns { posts: [], totalPages, currentPage, total }
      let postsArray = [];
      
      if (data && Array.isArray(data.posts)) {
        // This is our expected format: { posts: [], ... }
        postsArray = data.posts;
        console.log('✅ Using posts array from response object');
      } else if (Array.isArray(data)) {
        // Fallback: if it's directly an array
        postsArray = data;
        console.log('✅ Using direct array format');
      } else {
        console.warn('❌ Unexpected API response format, defaulting to empty array:', data);
        postsArray = [];
      }
      
      console.log(`📊 Final posts array: ${postsArray.length} posts`);
      console.log('📝 Posts content:', postsArray);
      setPosts(postsArray);
      
    } catch (err) {
      console.error('💥 Error fetching posts:', err);
      setError(err.message || 'Failed to fetch posts');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // For now, let's skip create/update/delete until we have auth
  const createNewPost = useCallback(async (postData) => {
    setError('Authentication required to create posts');
    throw new Error('Please log in to create posts');
  }, []);

  const updateExistingPost = useCallback(async (postId, updates) => {
    setError('Authentication required to update posts');
    throw new Error('Please log in to update posts');
  }, []);

  const removePost = useCallback(async (postId) => {
    setError('Authentication required to delete posts');
    throw new Error('Please log in to delete posts');
  }, []);

  return {
    posts,
    loading,
    error,
    fetchPosts,
    createPost: createNewPost,
    updatePost: updateExistingPost,
    deletePost: removePost,
  };
};

export default usePosts;