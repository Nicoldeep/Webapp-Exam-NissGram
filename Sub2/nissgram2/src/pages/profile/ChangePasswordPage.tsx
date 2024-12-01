import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate(); // To handle navigation
  const [passwordDetails, setPasswordDetails] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setPasswordDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordDetails.newPassword !== passwordDetails.confirmNewPassword) {
      alert('New Password and Confirm Password do not match.');
      return;
    }
    console.log('Password updated:', passwordDetails);
    alert('Your password has been successfully updated!');
    navigate('/profile'); // Redirect to profile after successful update
  };

  const handleCancel = () => {
    navigate('/profile'); // Redirect to profile without saving
  };

  return (
    <div className="container">
      <h2 className="text-center mb-4">Change Your Password</h2>
      <form id="changePasswordForm" onSubmit={handleSubmit}>
        {/* Current Password */}
        <div className="mb-3">
          <label htmlFor="currentPassword" className="form-label fs-5 fw-bold">
            Current Password<span className="text-danger">*</span>
          </label>
          <input
            type="password"
            id="currentPassword"
            className="form-control"
            placeholder="Enter your current password"
            value={passwordDetails.currentPassword}
            onChange={(e) => handleInputChange('currentPassword', e.target.value)}
            required
          />
        </div>

        {/* New Password */}
        <div className="mb-3">
          <label htmlFor="newPassword" className="form-label fs-5 fw-bold">
            New Password<span className="text-danger">*</span>
          </label>
          <input
            type="password"
            id="newPassword"
            className="form-control"
            placeholder="Enter your new password"
            value={passwordDetails.newPassword}
            onChange={(e) => handleInputChange('newPassword', e.target.value)}
            required
          />
        </div>

        {/* Confirm New Password */}
        <div className="mb-3">
          <label htmlFor="confirmNewPassword" className="form-label fs-5 fw-bold">
            Confirm New Password<span className="text-danger">*</span>
          </label>
          <input
            type="password"
            id="confirmNewPassword"
            className="form-control"
            placeholder="Confirm your new password"
            value={passwordDetails.confirmNewPassword}
            onChange={(e) => handleInputChange('confirmNewPassword', e.target.value)}
            required
          />
        </div>

        {/* Submit and Cancel Buttons */}
        <div className="d-flex justify-content-center gap-4 mt-4">
          <button
            type="submit"
            className="btn btn-success btn-lg"
            style={{
              padding: '10px 20px',
              borderRadius: '5px',
            }}
          >
            Update Password
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="btn btn-secondary btn-lg" // Matches the style of cancel in UpdateUserPage
            style={{
              padding: '10px 20px',
              borderRadius: '5px',
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
