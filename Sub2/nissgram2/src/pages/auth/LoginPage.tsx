import React, { useState } from 'react';
import './../../styles/auth.css';
import NissGramLogo from './../../assets/images/Niss.png';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRememberMe = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5024/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Viktig for å tillate cookies
        body: JSON.stringify({
          username: formData.usernameOrEmail,
          password: formData.password,
          rememberMe: rememberMe,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Login successful', responseData);

        // Videresend til hjemmesiden
        navigate('/');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed. Please try again.' + response);
      }
    } catch (err) {
      setError('Unable to connect to the server. Please try again later.');
      console.error(err);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <div className="row w-100" style={{ maxWidth: '800px', transform: 'translateY(-10%)' }}>
        {/* Left Column with Logo */}
        <div className="col-md-5 d-flex align-items-center" style={{ paddingRight: '20px' }}>
          <img
            src={NissGramLogo}
            alt="Login Illustration"
            className="img-fluid"
            style={{ maxHeight: '400px' }}
          />
        </div>

        {/* Right Column with Login Form */}
        <div className="col-md-6 p-4">
          <h2 className="text-center mb-4">Log in</h2>
          <form onSubmit={handleLogin}>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="usernameOrEmail"
                name="usernameOrEmail"
                placeholder="Enter your username or email"
                value={formData.usernameOrEmail}
                onChange={handleChange}
                required
              />
              <label htmlFor="usernameOrEmail">Username or Email</label>
            </div>

            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <label htmlFor="password">Password</label>
            </div>

            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={handleRememberMe}
              />
              <label className="form-check-label" htmlFor="rememberMe">
                Remember me
              </label>
            </div>

            {/* Error Message */}
            {error && <p className="text-danger">{error}</p>}

            <button type="submit" className="btn btn-primary w-100 mb-3">
              Log in
            </button>

            <div className="text-center">
              <a href="/register" className="btn btn-secondary w-100 mb-3">
                Register
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
