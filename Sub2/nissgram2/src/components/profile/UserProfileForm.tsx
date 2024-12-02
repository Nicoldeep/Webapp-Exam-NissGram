import React, { useEffect, useState } from 'react';
import CustomDropdown from './CustomDropdown';
import config from '../../apiConfig';

interface UserProfileFormProps {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  about: string;
  phoneNumber: string;
  profilePicture?: string; // Profile picture URL
  onInputChange: (field: string, value: string) => void;
  readOnlyFields?: string[]; // Fields that should be read-only
  onImageChange?: (image: File | null) => void; // Callback for handling image upload
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({
  username,
  email,
  firstName,
  lastName,
  about,
  phoneNumber,
  profilePicture,
  onInputChange,
  readOnlyFields = [],
  onImageChange,
}) => {
  const [preview, setPreview] = useState<string | null>(
    profilePicture ? `${config.API_URL}${profilePicture}` : `${config}/images/profile_image_default.png`
  );

  useEffect(() => {
    setPreview(
      profilePicture
        ? `${config.BACKEND_URL}${profilePicture}`
        : `${config.API_URL}/images/profile_image_default.png`
    );
  }, [profilePicture]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string); // Update preview
      };
      reader.readAsDataURL(file);
      if (onImageChange) onImageChange(file); // Notify parent component
    }
  };

  const handleDeleteImage = () => {
    setPreview(`${config.API_URL}/images/profile_image_default.png`); // Reset preview
    if (onImageChange) onImageChange(null); // Notify parent to clear profile picture
  };

  const menuItems = [
    {
      label: 'Upload Picture',
      action: () => document.getElementById('uploadProfilePicture')?.click(),
    },
    {
      label: 'Delete Picture',
      action: handleDeleteImage,
    },
  ];

  return (
    <div>
      {/* Profile Picture Section */}
      <div className="text-center mb-4">
        <div
          id="profileImagePreview"
          className="rounded-circle mx-auto"
          style={{
            width: '150px',
            height: '150px',
            overflow: 'hidden',
            backgroundColor: '#f0f0f0',
          }}
        >
          <img
            src={preview || `${config.API_URL}/images/profile_image_default.png`}
            alt="Profile Preview"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <div style={{ position: 'relative', marginTop: '-50px' }}>
          <CustomDropdown
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-plus"
                viewBox="0 0 16 16"
              >
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
              </svg>
            }
            menuItems={menuItems}
          />
        </div>

        <input
          type="file"
          id="uploadProfilePicture"
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      {/* Form Fields */}
      <div className="mb-3">
        <label htmlFor="username" className="form-label">
          Username
        </label>
        <input
          type="text"
          id="username"
          className="form-control"
          value={username}
          onChange={(e) => onInputChange('username', e.target.value)}
          readOnly={readOnlyFields.includes('username')}
          disabled
        />
      </div>

      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          type="email"
          id="email"
          className="form-control"
          value={email}
          onChange={(e) => onInputChange('email', e.target.value)}
          readOnly={readOnlyFields.includes('email')}
          disabled
        />
      </div>

      <div className="mb-3">
        <label htmlFor="firstName" className="form-label">
          First Name
        </label>
        <input
          type="text"
          id="firstName"
          className="form-control"
          value={firstName}
          onChange={(e) => onInputChange('firstName', e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="lastName" className="form-label">
          Last Name
        </label>
        <input
          type="text"
          id="lastName"
          className="form-control"
          value={lastName}
          onChange={(e) => onInputChange('lastName', e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="about" className="form-label">
          About
        </label>
        <textarea
          id="about"
          className="form-control"
          value={about}
          onChange={(e) => onInputChange('about', e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="phoneNumber" className="form-label">
          Phone Number
        </label>
        <input
          type="text"
          id="phoneNumber"
          className="form-control"
          value={phoneNumber}
          onChange={(e) => onInputChange('phoneNumber', e.target.value)}
        />
      </div>
    </div>
  );
};

export default UserProfileForm;
