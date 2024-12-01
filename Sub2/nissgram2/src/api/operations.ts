// operations.ts

const apiUrl = 'http://localhost:5024/api';

// Helper function to call API
async function callApi(endpoint: string, method: string, body?: any) {
    const headers = { 'Content-Type': 'application/json' };
    const config: RequestInit = {
        method: method,
        headers: headers,
        credentials: 'include',
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${apiUrl}${endpoint}`, config);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'API call failed');
        }
        return data;
    } catch (error) {
        if (error instanceof Error) return { error: error.message };
        return { error: 'An unexpected error occurred' };
    }
}

// API operations

// API operation for creating a post
export const createPost = async (postDetails: { text: string; imgUrl?: string }) => {
    return callApi('/posts/create', 'POST', postDetails);
};


//API operation for login
export const login = async (username: string, password: string) => {
    return callApi('/auth/login', 'POST', { username, password });
};

//API operation for register
export const register = async (userDetails: any) => {
    return callApi('/auth/register', 'POST', userDetails);
};

//API operation for checking authentication
export const checkAuthentication = async () => {
    return callApi('/auth/isauthenticated', 'GET');
};

// Flere operations/calls mot backend!



//API operation to call the POST /api/UserAPI/update endpoint 
export const updateUserProfile = async (userDetails: any) => {
    return callApi('/userapi/update', 'POST', userDetails);
  };
  
//API function to fetch the current users profile
export const fetchCurrentUser = async () => {
    return callApi('/userapi/current', 'GET');
};