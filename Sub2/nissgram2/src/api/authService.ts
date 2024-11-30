import API_URL from '../apiConfig';

const headers = { 
  'Content-Type': 'application/json',
};

const handleResponse = async (response: Response) => {
  if (response.ok) {
    return response.status === 204 ? null : response.json();
  } else {
    const errorText = await response.text();
    throw new Error(errorText || 'An error occurred');
  }
};

export const login = async (usernameOrEmail: string, password: string) => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ usernameOrEmail, password }),
  });
  return handleResponse(response);
};

export const register = async (username: string, email: string, password: string) => {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ username, email, password }),
  });
  return handleResponse(response);
};

export async function logout() {
  const response = await fetch('/logout', {
      method: 'POST',
      credentials: 'include',
  });

  if (!response.ok) {
      throw new Error('Failed to log out');
  }

  return response.json();
}

