```
# 🧪 MERN Testing Application

A comprehensive MERN stack application with complete testing setup including unit tests, integration tests, and end-to-end tests. This project demonstrates modern testing strategies for full-stack JavaScript applications.

![MERN Stack](https://img.shields.io/badge/MERN-Full%20Stack-green)
![Testing](https://img.shields.io/badge/Testing-Complete-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🚀 Features

- **Frontend**: React with Vite, modern ES6+ features
- **Backend**: Express.js with MongoDB and Mongoose
- **Testing**: Jest, React Testing Library, Supertest, Cypress
- **Authentication**: JWT-based auth (ready for implementation)
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Input validation middleware
- **Error Handling**: Global error handling and React error boundaries
- **Logging**: Winston logger with structured logging




```
## 📁 Project Structure
mern-testing/
├── client/ # React frontend
│ ├── src/
│ │ ├── components/ # React components
│ │ ├── hooks/ # Custom React hooks
│ │ ├── tests/ # Test files
│ │ └── utils/ # Utility functions
│ └── cypress/ # E2E tests
├── server/ # Express backend
│ ├── src/
│ │ ├── controllers/ # Route controllers
│ │ ├── models/ # Database models
│ │ ├── routes/ # API routes
│ │ └── middleware/ # Custom middleware
│ └── tests/ # Test files
└── config files # Configuration files

text

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mern-testing
Install dependencies

bash
npm run install-all
Set up environment variables

Copy client/.env.example to client/.env

Copy server/.env.example to server/.env

Update with your MongoDB connection string and other settings

Set up test database (optional)

bash
npm run setup-test-db
Running the Application
Development mode (recommended):

bash
npm run dev
This starts both client (http://localhost:3000) and server (http://localhost:5000).

Run separately:

bash
# Terminal 1 - Server
cd server
npm run dev

# Terminal 2 - Client
cd client
npm run dev
🧪 Testing
Run All Tests
bash
npm test
Run Specific Test Types
bash
# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# E2E tests only
npm run test:e2e

# With coverage report
npm run test:coverage
Test Watch Mode
bash
npm run test:watch
📊 Testing Strategy
Unit Tests
Client: React components, hooks, utilities

Server: Controllers, middleware, utilities

Tools: Jest, React Testing Library

Integration Tests
API endpoints: HTTP request/response testing

Database operations: MongoDB integration

Component integration: React components with APIs

Tools: Supertest, Jest

End-to-End Tests
User flows: Navigation, form submissions

Critical paths: Registration, login, CRUD operations

Tools: Cypress

🐛 Debugging
Client-side Debugging
React Developer Tools browser extension

Browser DevTools with console logging

Error boundaries for React error handling

Vite dev server with hot reload

Server-side Debugging
Winston structured logging

Global error handling middleware

MongoDB query debugging

Environment-specific logging levels

🗄️ API Endpoints
Posts
GET /api/posts - Get all posts (public)

GET /api/posts/:id - Get single post (public)

POST /api/posts - Create new post (authenticated)

PUT /api/posts/:id - Update post (authenticated + author)

DELETE /api/posts/:id - Delete post (authenticated + author)

Authentication
POST /api/auth/register - Register new user

POST /api/auth/login - Login user

POST /api/auth/logout - Logout user

GET /api/auth/me - Get current user

Health Check
GET /api/health - Server status and database health

📈 Code Coverage
The project aims for at least 70% code coverage across:

Statements

Branches

Functions

Lines

View coverage reports in the coverage/ directory after running tests.

🔧 Configuration
Jest Configuration
Root jest.config.js for multi-project setup

Client-specific configuration in client/jest.config.js

Server-specific configuration in server/jest.config.js

Environment Variables
Server (.env):

env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mern-testing
MONGODB_TEST_URI=mongodb://localhost:27017/mern-testing-test
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
Client (.env):

env
VITE_API_URL=http://localhost:5000/api
🚀 Deployment
Production Build
bash
# Build client
cd client
npm run build

# Start server
cd ../server
npm start
Environment Setup
Set production environment variables

Build client application

Start server with process manager (PM2 recommended)

Configure reverse proxy (nginx)

Database
Production: MongoDB Atlas recommended

Development: Local MongoDB or Atlas

Testing: MongoDB Memory Server

🤝 Contributing
Fork the repository

Create a feature branch: git checkout -b feature/amazing-feature

Write tests for new functionality

Ensure all tests pass: npm test

Commit your changes: git commit -m 'Add amazing feature'

Push to the branch: git push origin feature/amazing-feature

Open a pull request

Development Guidelines
Write tests for all new features

Maintain code coverage above 70%

Follow existing code style and patterns

Update documentation for API changes

🐛 Common Issues
MongoDB Connection Issues
Check if MongoDB is running

Verify connection string in .env file

Ensure network connectivity to MongoDB Atlas

CORS Errors
Verify CLIENT_URL in server .env matches your client URL

Check proxy configuration in vite.config.js

Test Failures
Ensure test database is properly set up

Check environment variables for test configuration

Verify all services are running before E2E tests

📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
React team for excellent testing utilities

Jest team for comprehensive testing framework

MongoDB for flexible document database

Vite team for fast development build tool

Happy Testing! 🧪🚀

text

## 🚀 How to Create These Files:

### 1. Create .gitignore:
```bash
# In the root directory
touch .gitignore
# Copy and paste the .gitignore content above
2. Create README.md:
bash
# In the root directory
touch README.md
# Copy and paste the README.md content above
3. Optional: Create LICENSE file:
bash
touch LICENSE
