import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './../../styles/auth.css'; 
import { register, login } from './../../api/operations';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    about: '',
    phoneNumber: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setUserDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { firstName, lastName, about, password, confirmPassword, username, email } = userDetails;

    // Frontend validation for password requirements
    if (!password || password.length < 8) {
        setError("Password must be at least 8 characters long.");
        return;
    }
    if (!/[A-Z]/.test(password)) {
        setError("Password must contain at least one uppercase letter (A-Z).");
        return;
    }
    if (!/[0-9]/.test(password)) {
        setError("Password must contain at least one digit (0-9).");
        return;
    }
    if (!/[^\w\s]/.test(password)) {
        setError("Password must contain at least one non-alphanumeric character.");
        return;
    }
    if (password !== confirmPassword) {
        setError("Passwords do not match. Please re-enter the same password.");
        return;
    }

    // Required fields validation
    if (!username || !email) {
        setError("Username and Email are required fields.");
        return;
    }

    // Validation for First Name
    if (firstName && !/^[a-zA-ZæøåÆØÅ.\- ]{2,20}$/.test(firstName)) {
        setError("First name must be letters only and between 2 to 20 characters.");
        return;
    }

    // Validation for Last Name
    if (lastName && !/^[a-zA-ZæøåÆØÅ.\- ]{2,20}$/.test(lastName)) {
        setError("Last name must be letters only and between 2 to 20 characters.");
        return;
    }

    // Validation for About Section
    if (about && about.length > 500) {
        setError("The About section cannot exceed 500 characters.");
        return;
    }

    setLoading(true);
    setError('');

    try {
        const registerCall = await register(userDetails);

        if (!registerCall.error) {
            const loginCall = await login(username, password);

            if (!loginCall.error) {
                setError('');
                navigate('/'); // Navigate to the home page
            } else {
                setError("Registration succeeded, but login failed. Please try logging in manually.");
            }
        } else {
            setError("Registration failed due to a server error. Please check your details and try again.");
        }
    } catch (err) {
        if (err instanceof Error) {
            setError("An error occurred: " + err.message);
        } else {
            setError("An unexpected error occurred. Please try again later.");
        }
    } finally {
        setLoading(false);
    }
};


  return (
    <div className="container">
      <form onSubmit={handleSubmit} id="registerForm" method="post" encType="multipart/form-data">
        <h2 className="text-center mb-4" style={{paddingTop: "2rem"}}>Register</h2>
      
        <div className="mb-3">
          <label htmlFor="username" className="form-label fs-5 fw-bold">Username<span className="text-danger">*</span></label>
          <input type="text" className="form-control" id="username" name="username" value={userDetails.username} onChange={handleInputChange} />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label fs-5 fw-bold">Email<span className="text-danger">*</span></label>
          <input type="email" className="form-control" id="email" name="email" value={userDetails.email} onChange={handleInputChange} />
        </div>

        <div className="mb-3">
          <label htmlFor="firstName" className="form-label fs-5 fw-bold">First Name</label>
          <input type="text" className="form-control" id="firstName" name="firstName" value={userDetails.firstName} onChange={handleInputChange} />
        </div>

        <div className="mb-3">
          <label htmlFor="lastName" className="form-label fs-5 fw-bold">Last Name</label>
          <input type="text" className="form-control" id="lastName" name="lastName" value={userDetails.lastName} onChange={handleInputChange} />
        </div>

        <div className="mb-3">
          <label htmlFor="about" className="form-label fs-5 fw-bold">About</label>
          <textarea className="form-control" id="about" name="about" value={userDetails.about} onChange={handleInputChange}></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="phoneNumber" className="form-label fs-5 fw-bold">Phone Number</label>
          <input type="text" className="form-control" id="phoneNumber" name="phoneNumber" value={userDetails.phoneNumber} onChange={handleInputChange} />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label fs-5 fw-bold">Password<span className="text-danger">*</span></label>
          <input type="password" className="form-control" id="password" name="password" value={userDetails.password} onChange={handleInputChange} />
        </div>

        <div className="mb-3" style={{paddingBottom: "2rem"}}>
          <label htmlFor="confirmPassword" className="form-label fs-5 fw-bold">Confirm Password<span className="text-danger">*</span></label>
          <input type="password" className="form-control" id="confirmPassword" name="confirmPassword" value={userDetails.confirmPassword} onChange={handleInputChange} />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <button type="submit" className="btn btn-primary w-100 mb-3 fs-4" >Register</button>

        <div className="text-center fs-5" >
          <p>Already have an account? <a href="/login" style={{ textDecoration: 'underline' }}>Log in here</a></p>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;