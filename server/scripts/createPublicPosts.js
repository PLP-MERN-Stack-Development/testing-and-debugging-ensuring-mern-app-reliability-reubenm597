import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Post from '../src/models/Post.js';
import User from '../src/models/User.js';

dotenv.config();

const createPublicPosts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find or create a user
    let user = await User.findOne({ email: 'public@example.com' });
    if (!user) {
      user = new User({
        username: 'publicuser',
        email: 'public@example.com',
        password: 'public123'
      });
      await user.save();
      console.log('Created public user');
    }

    // Delete existing public posts to avoid duplicates
    await Post.deleteMany({ 'author': user._id });
    console.log('Cleaned up existing public posts');

    // Create public posts with string categories
    const publicPosts = [
      {
        title: 'Welcome to Our Testing Application',
        content: 'This is a public post that demonstrates our MERN stack application with comprehensive testing. The app includes unit tests, integration tests, and end-to-end tests to ensure reliability.',
        author: user._id,
        published: true,
        category: 'technology' // Changed to string
      },
      {
        title: 'Understanding React Testing',
        content: 'React Testing Library helps you write tests that simulate how users interact with your components. This leads to more reliable and maintainable tests.',
        author: user._id,
        published: true,
        category: 'technology' // Changed to string
      },
      {
        title: 'API Testing Strategies',
        content: 'Learn how to test your Express.js APIs using Supertest. Proper API testing ensures your backend services work correctly and handle errors gracefully.',
        author: user._id,
        published: true,
        category: 'development' // Changed to string
      },
      {
        title: 'Database Testing with MongoDB',
        content: 'MongoDB testing strategies include using in-memory databases for tests and proper setup/teardown procedures to ensure test isolation.',
        author: user._id,
        published: false,
        category: 'database' // Changed to string
      }
    ];

    await Post.insertMany(publicPosts);
    console.log(`Created ${publicPosts.length} public posts`);

    // Verify the posts
    const posts = await Post.find({ author: user._id }).populate('author');
    console.log('\nPublic posts created:');
    posts.forEach(post => {
      console.log(`- "${post.title}" by ${post.author.username} (${post.category})`);
    });

  } catch (error) {
    console.error('Error creating public posts:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

createPublicPosts();