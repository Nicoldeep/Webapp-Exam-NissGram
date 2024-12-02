import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserProfileForm from '../../components/profile/UserProfileForm';
import { fetchCurrentUser, updateUserProfile } from '../../api/operations';

const UpdateUserPage: React.FC = () => {
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    about: '',
    phoneNumber: '',
    profilePicture: '',
  });

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deleteProfilePicture, setDeleteProfilePicture] = useState<boolean>(false);

  // Fetch user data
  useEffect(() => {
    const getUserData = async () => {
      try {
        setLoading(true);
        const response = await fetchCurrentUser();

        if (response.error) {
          throw new Error(response.error);
        }

        setUserDetails({
          username: response.username || '',
          email: response.email || '',
          firstName: response.firstName || '',
          lastName: response.lastName || '',
          about: response.about || '',
          phoneNumber: response.phoneNumber || '',
          profilePicture: response.profilePicture || '',
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load user data.');
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, []);

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  // Handle profile picture change
  const handleImageChange = (image: File | null) => {
    if (image) {
      setProfilePicture(image); // Set new profile picture
      setDeleteProfilePicture(false); // Reset delete flag if a new image is added
    } else {
      setProfilePicture(null); // Clear the profile picture
      setDeleteProfilePicture(true); // Set delete flag
    }
  };

  // Save updated user data
  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      const formData = new FormData();
      formData.append('about', userDetails.about);
      formData.append('firstName', userDetails.firstName);
      formData.append('lastName', userDetails.lastName);
      formData.append('phoneNumber', userDetails.phoneNumber);

      if (profilePicture) {
        formData.append('profilePicture', profilePicture);
      }

      const response = await updateUserProfile(formData);

      if (response && response.error) {
        throw new Error(response.error);
      }

      setSuccessMessage('Profile updated successfully!');
      navigate('/profile');
    } catch (err: any) {
      console.error('Error updating profile:', err.message || err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading user data...</p>;

  return (
    <div className="container">
      <form id="updateProfileForm">
        <h2 className="text-center mb-4">Update Profile</h2>

        {error && (
          <div className="alert alert-danger text-center">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success text-center">
            {successMessage}
          </div>
        )}

        <UserProfileForm
          username={userDetails.username}
          email={userDetails.email}
          firstName={userDetails.firstName}
          lastName={userDetails.lastName}
          about={userDetails.about}
          phoneNumber={userDetails.phoneNumber}
          profilePicture={userDetails.profilePicture}
          onInputChange={handleInputChange}
          onImageChange={handleImageChange}
          readOnlyFields={['username', 'email']}
        />

        <div className="d-flex justify-content-center gap-3 mt-4">
          <button type="button" onClick={handleSave} className="btn btn-success">
            Save
          </button>
          <button type="button" onClick={() => navigate('/profile')} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateUserPage;
