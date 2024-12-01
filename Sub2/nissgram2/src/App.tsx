import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./shared/Layout";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/profile/ProfilePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";
import CreatePost from "./pages/post/createPost"; 
import UpdatePost from "./pages/post/updatePost";
import UpdateUserPage from "./pages/profile/UpdateUserPage"; // Correct path to your UpdateUserPage component
import ChangePasswordPage from './pages/profile/ChangePasswordPage';
import './styles/layout.css';
import AuthorizeView from './pages/auth/AuthorizeView';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />

          <Route
                  path="/"
                  element={
                      <AuthorizeView>
                          <HomePage />
                      </AuthorizeView>
                  }
            />
          <Route
                  path="/profile"
                  element={
                      <AuthorizeView>
                         <ProfilePage />
                      </AuthorizeView>
                  }
            />
            <Route
                  path="/update-profile"
                  element={
                      <AuthorizeView>
                         <UpdateUserPage />
                      </AuthorizeView>
                  }
            />
            <Route
                  path="/password"
                  element={
                      <AuthorizeView>
                         <ChangePasswordPage />
                      </AuthorizeView>
                  }
            />
            <Route
                  path="/createPost"
                  element={
                      <AuthorizeView>
                         <CreatePost />
                      </AuthorizeView>
                  }
            />
            <Route
                  path="/updatePost/:postId"
                  element={
                      <AuthorizeView>
                         <UpdatePost />
                      </AuthorizeView>
                  }
            />
            <Route
                  path="*"
                  element={
                      <AuthorizeView>
                         <NotFoundPage />
                      </AuthorizeView>
                  }
            />
        
        </Route>
      </Routes>
    </Router>
  );
};

export default App;