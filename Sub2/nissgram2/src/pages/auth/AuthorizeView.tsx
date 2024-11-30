import React, { useState, useEffect, createContext } from 'react';
import { Navigate } from 'react-router-dom';

const UserContext = createContext({});

function AuthorizeView({ children }: { children: React.ReactNode }) {
    const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    fetch("/api/auth/pingauth", { credentials: "include" })
        .then((res) => {
            if (res.ok) setAuthorized(true);
            else setAuthorized(false);
        })
        .catch(() => setAuthorized(false));
}, []);


if (!authorized) {
    return <Navigate to="/login" />;
}

return <>{children}</>;
}

export default AuthorizeView;
