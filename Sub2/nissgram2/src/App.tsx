import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './shared/Layout';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import CreatePost from './post/createPost';
import UpdatePost from './post/updatePost';
import AuthorizeView from './pages/auth/AuthorizeView';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* Protected Routes with Layout */}
        <Route
          path="/"
          element={
            <AuthorizeView>
              <Layout />
            </AuthorizeView>
          }
        >
          {/* Nested Routes */}
          <Route index element={<HomePage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="createPost" element={<CreatePost />} />
          <Route
            path="updatePost"
            element={
              <UpdatePost
                postId={123}
                existingImgUrl=""
                text="This is the current text of the post."
                onUpdate={(postId, updatedText, updatedImage) => {
                  console.log('Updated Post:', { postId, updatedText, updatedImage });
                }}
              />
            }
          />
        </Route>

        {/* Catch-all for undefined routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
