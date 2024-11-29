import React, { useState } from 'react';
import './../../styles/auth.css';
import DefaultProfilePicture from './../../assets/images/profile_image_default.png';
import { useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    about: '',
    profilePicture: DefaultProfilePicture,
  });

  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file upload for profile picture
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setFormData((prev) => ({ ...prev, profilePicture: reader.result as string }));
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Submit registration form
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:5024/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setError('');
        navigate('/'); // Navigate to login page after successful registration
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please check your network connection.');
      console.error(err);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleRegister} encType="multipart/form-data">
        {/* Profile Picture Upload Section */}
        <div className="mb-4 text-center position-relative">
          <div className="fs-5 fw-bold mb-2">Profile Picture</div>
          <div
            className="rounded-circle mx-auto mb-3"
            style={{
              width: '150px',
              height: '150px',
              overflow: 'hidden',
              backgroundColor: '#f8f9fa',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <img
              src={formData.profilePicture}
              alt="Profile Preview"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '50%',
              }}
            />
          </div>
          <input
            type="file"
            id="uploadProfilePicture"
            name="profilePicture"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <label
            htmlFor="uploadProfilePicture"
            className="btn btn-secondary"
            style={{ cursor: 'pointer' }}
          >
            Upload Picture
          </label>
        </div>

        {/* Username */}
        <div className="mb-3">
          <label htmlFor="username" className="form-label fs-5 fw-bold">
            Username<span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id="username"
            name="username"
            className="form-control"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label fs-5 fw-bold">
            Email<span className="text-danger">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* First Name */}
        <div className="mb-3">
          <label htmlFor="firstName" className="form-label fs-5 fw-bold">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            className="form-control"
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>

        {/* Last Name */}
        <div className="mb-3">
          <label htmlFor="lastName" className="form-label fs-5 fw-bold">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            className="form-control"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>

        {/* About */}
        <div className="mb-3">
          <label htmlFor="about" className="form-label fs-5 fw-bold">
            About
          </label>
          <textarea
            id="about"
            name="about"
            className="form-control"
            value={formData.about}
            onChange={handleChange}
          />
        </div>

        {/* Password */}
        <div className="mb-3">
          <label htmlFor="password" className="form-label fs-5 fw-bold">
            Password<span className="text-danger">*</span>
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Confirm Password */}
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label fs-5 fw-bold">
            Confirm Password<span className="text-danger">*</span>
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="form-control"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        {/* Error and Success Messages */}
        {error && <p className="text-danger">{error}</p>}
        {success && <p className="text-success">Registration successful! Log in now.</p>}

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary w-100 mb-3">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
