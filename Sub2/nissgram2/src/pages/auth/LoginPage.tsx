import React, { useState } from 'react';
import './../../styles/auth.css'; // CSS-stil for enhetlig design
import './../../styles/loginRegister.css'; 
import { useNavigate } from 'react-router-dom';
import config from '../../apiConfig';
import { login } from './../../api/operations';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    // Frontend-validering før vi sender forespørselen
    if (!username.trim()) {
      setError('Username or email is required.');
      return;
    }
    if (!password.trim()) {
      setError('Password is required.');
      return;
    }

    setLoading(true);
    try {
      const result = await login(username, password);
      if (result.error) {
        // Differensier mellom feil som brukeren kan rette og generelle serverproblemer
        if (result.error === 'Invalid username or password') {
          setError('Invalid username or password. Please try again.');
        } else {
          setError('An error occurred while logging in. Try again');
        }
      } else {
        // Hvis alt er vellykket, naviger brukeren til hovedsiden
        setError('');
        navigate('/');
      }
    } catch (error) {
      setError('Failed to connect to the server. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <div className="row w-100" style={{ maxWidth: '800px', transform: 'translateY(-10%)' }}>
        {/* Venstre kolonne med logo */}
        <div className="col-md-5 d-flex align-items-center" style={{ paddingRight: '20px' }}>
          <img
            src={`${config.API_URL}/images/Logo/Niss.png`}
            alt="Login Illustration"
            className="img-fluid"
            style={{ maxHeight: '400px' }}
          />
        </div>
        {/* Høyre kolonne med login-skjema */}
        <div className="col-md-6 p-4">
          <h2 className="text-center mb-4">Log in</h2>
          <form onSubmit={handleLogin}>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="usernameOrEmail"
                placeholder="Enter your username or email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <label htmlFor="usernameOrEmail">Username or Email</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="password">Password</label>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="form-check mb-3">
              <input className="form-check-input" type="checkbox" id="rememberMe" />
              <label className="form-check-label" htmlFor="rememberMe">
                Remember me
              </label>
            </div>
            <button type="submit" className="btn btn-primary w-100 mb-3" disabled={loading}>
              {loading ? 'Logging in...' : 'Log in'}
            </button>
            <div className="text-center">
              <p>
                <a href="/register" className="btn btn-secondary w-100 mb-3">
                  Register
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
