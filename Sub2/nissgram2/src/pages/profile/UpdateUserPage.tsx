import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserForm from '../../components/UserProfileForm';
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
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
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
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load user data.');
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await updateUserProfile(userDetails);
      console.log('API Response:', response);
  
      // Check if the response is truly an error
      if (response && response.error) {
        throw new Error(response.error);
      }
  
      // Success: Changes were saved
      alert('Profile updated successfully!');
      navigate('/profile'); // Redirect to profile page after saving
    } catch (err: any) {
      console.error('Error updating profile:', err.message || err);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  const handleCancel = () => {
    navigate('/profile'); // Redirect to profile page without saving
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const response = await fetch('http://localhost:5024/api/userapi/delete', {
          method: 'DELETE',
          credentials: 'include',
        });
  
        if (!response.ok) {
          throw new Error('Failed to delete account.');
        }
  
        alert('Your account and all associated data have been deleted.');
        navigate('/login'); // Redirect to the login page
      } catch (err) {
        console.error(err);
        alert('An error occurred while trying to delete your account. Please try again.');
      }
    }
  };
  
  

  if (loading) return <p>Loading user data...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container">
      <form id="updateProfileForm">
        <h2 className="text-center mb-4">Update Profile</h2>

        <UserForm
          username={userDetails.username}
          email={userDetails.email}
          firstName={userDetails.firstName}
          lastName={userDetails.lastName}
          about={userDetails.about}
          phoneNumber={userDetails.phoneNumber}
          onInputChange={handleInputChange}
          readOnlyFields={['username', 'email']} // Dynamically set readonly fields
        />

        {/* Change Password Link */}
        <div style={{ textAlign: 'center', marginBottom: '20px', textDecoration: 'underline' }}>
        <a
          href="#"
          className="text-primary"
          style={{ textDecoration: 'none' }}
          onClick={() => navigate('/password')} // Redirect to the correct path
        >
          Change your password here
        </a>

        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
          <button
            type="button"
            onClick={handleSave}
            className="btn btn-success"
            style={{
              padding: '10px 20px',
              borderRadius: '5px',
            }}
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="btn btn-secondary"
            style={{
              padding: '10px 20px',
              borderRadius: '5px',
            }}
          >
            Cancel
          </button>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            type="button"
            onClick={handleDeleteAccount}
            className="btn btn-danger"
            style={{
              padding: '10px 20px',
              borderRadius: '5px',
            }}
          >
            Delete your user account
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateUserPage;
