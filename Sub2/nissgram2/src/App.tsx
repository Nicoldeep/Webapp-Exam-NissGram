import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./shared/Layout";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";
import CreatePost from "./post/createPost";
import UpdatePost from "./post/updatePost";
import PrivateRoute from "./pages/auth/PrivateRoute"; // Importing PrivateRoute for protected routes

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Layout wrapping all pages */}
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />
          <Route
            path="profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="createPost"
            element={
              <PrivateRoute>
                <CreatePost />
              </PrivateRoute>
            }
          />
          <Route
            path="updatePost"
            element={
              <PrivateRoute>
                <UpdatePost
                  postId={123}
                  existingImgUrl=" "
                  text="This is the current text of the post."
                  onUpdate={(postId, updatedText, updatedImage) => {
                    console.log("Updated Post:", { postId, updatedText, updatedImage });
                  }}
                />
              </PrivateRoute>
            }
          />

          {/* Catch-all for undefined routes */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
