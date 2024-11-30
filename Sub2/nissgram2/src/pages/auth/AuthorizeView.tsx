import React, { useState, useEffect, createContext } from 'react';
import { Navigate } from 'react-router-dom';

// AuthorizeView-komponent
function AuthorizeView({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/isauthenticated', {
          method: 'GET',
          credentials: 'include',
        });
        const result = await response.json();
        setAuthenticated(result.isAuthenticated);
      } catch {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

export default AuthorizeView;
