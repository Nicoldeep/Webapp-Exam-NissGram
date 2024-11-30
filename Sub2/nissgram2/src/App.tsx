import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './shared/Layout';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import CreatePost from './post/createPost';
import AuthorizeView from './pages/auth/AuthorizeView';

const App: React.FC = () => {
  return (
      <Router>
          <Routes>
              
              <Route path="/login" element={<LoginPage />} />
              <Route
                  path="/"
                  element={
                      <AuthorizeView>
                          <HomePage />
                      </AuthorizeView>
                  }
              />
                          
          </Routes>
      </Router>
  );
};

export default App;
