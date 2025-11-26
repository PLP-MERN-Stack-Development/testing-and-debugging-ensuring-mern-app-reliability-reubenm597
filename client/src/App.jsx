import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import PostList from './components/PostList.jsx';
import PostForm from './components/PostForm.jsx';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="app">
          <header className="app-header">
            <h1>MERN Testing App</h1>
            <nav>
              <a href="/posts">Posts</a>
              <a href="/create-post">Create Post</a>
            </nav>
          </header>

          <main className="app-main">
            <Routes>
              <Route path="/" element={<Navigate to="/posts" replace />} />
              <Route path="/posts" element={<PostList />} />
              <Route path="/create-post" element={<PostForm />} />
              <Route path="/edit-post/:id" element={<PostForm />} />
              <Route path="*" element={<div>Page not found</div>} />
            </Routes>
          </main>

          <footer className="app-footer">
            <p>&copy; 2024 MERN Testing Application</p>
          </footer>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;