import React from 'react';
import { Navigate } from 'react-router-dom';

// Sjekk om cookie eksisterer
const isAuthenticated = () => {
  const cookies = document.cookie;
  return cookies.includes('.AspNetCore.Identity.Application'); // Sjekker spesifikk cookie fra backend
};

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
