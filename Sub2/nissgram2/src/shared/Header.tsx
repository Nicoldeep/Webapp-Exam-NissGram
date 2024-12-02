import React from 'react';
import config from '../apiConfig';
import './../styles/layout.css';
import { useNavigate } from 'react-router-dom';
import { logout, fetchCurrentUser } from './../api/operations';
import { useEffect, useState } from 'react';

const Header: React.FC = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [profilepicture, setProfilePicture] = useState<string | null>(null);

    const handleLogout = async (event: React.MouseEvent) => {
      event.preventDefault();
      try {
          await logout(); // Use the new logout function
          navigate("/login");
      }
        catch (error) {
          console.error('Logout error:', error);
          setError('An error occurred during logout.');
      }
    };

    const fetchUserData = async () => {
        const currentUser = await fetchCurrentUser();
        if (currentUser.error) {
          console.error(currentUser.error);
        } else {
          if(currentUser.profilePicture != null){
            setProfilePicture(currentUser.profilePicture)
          }
        }
      };
      
      useEffect(() => {
        fetchUserData();
      }, []);


  return (
    <header className="fixed-header">
        <a href="/" >
            <img src={`${config.API_URL}/images/Logo/Niss.png`} alt="NissGram Logo" className="navbar-brand" style={{height: "70px", padding: "5px"}}/>
        </a>

        <nav className="icon-bar">
            <a href="/profile" className="nav-link">
                <div className="profile-container circle">
                <img
                        src={
                        profilepicture
                            ? `${config.BACKEND_URL}${profilepicture}` // Use profile picture from the backend URL
                            : `${config.API_URL}${config.DEFAULT_IMAGE_PATH}` // Use default profile picture
                        }
                        alt="Profile" className="rounded-circle" style={{ width: '45px', height: '45px', padding:"5px", marginTop:"-3px" }}
                    />
                </div>
            </a>
            <a href="/" className="nav-link">
                <img src={`${config.API_URL}/images/Icons/homeIcon.png`} style={{height: "40px", padding: "5px"}} alt="Home "/>
            </a>
            <a href="/createPost" className="nav-link">
                <img src={`${config.API_URL}/images/Icons/addIcon.png`} style={{height: "40px", padding: "5px"}} alt="Add Post "/>
            </a>
            <div className="d-inline nav-link" >
                <button type="submit" onClick={handleLogout} className="nav-link text-white p-0 border-0 bg-transparent">
                    <a href="/logout">
                        <img src={`${config.API_URL}/images/Icons/logoutIcon.png`} style={{height: "40px", padding: "5px"}} alt="Logout "/>
                    </a>
                </button>
            </div>
        </nav>
    </header>
  );
};

export default Header;