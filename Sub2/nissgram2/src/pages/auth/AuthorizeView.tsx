import React, { useState, useEffect, createContext, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { checkAuthentication } from './../../api/operations'; // Import the function

interface User {
  email: string;
}

const UserContext = createContext<User | null | undefined>(undefined);

function AuthorizeView({ children }: { children: ReactNode }) {
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // Track loading state
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchAuthentication = async () => {
      try {
        const result = await checkAuthentication(); // Use the function from operations.ts
        if (result.error) {
          throw new Error(result.error);
        }
        setAuthorized(result.isAuthenticated);
        setUser({ email: result.user });
      } catch (error) {
        console.error('Error checking authentication:', error);
        setAuthorized(false);
      } finally {
        setLoading(false); // Mark the check as complete
      }
    };

    fetchAuthentication();
  }, []);

  

  if (loading) {
    // Show a loading indicator until the authentication check completes
    return <div>Loading...</div>;
  }

  if (!authorized) {
    // Redirect to login only if not authorized and not loading
    return <Navigate to="/login" />;
  }

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function AuthorizedUser({ value }: { value: string }) {
  const user = React.useContext(UserContext);
  if (user && value === 'email') {
    return <>{user.email}</>;
  } else {
    return <></>;
  }
}

export default AuthorizeView;
