import React from 'react';
import config from '../apiConfig';
import './../styles/layout.css';
import { useNavigate } from 'react-router-dom';
import { logout, fetchCurrentUser } from './../api/operations';
import { useEffect, useState } from 'react';

const Sidebar: React.FC = () => {
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
    <div className="d-flex">
        <nav className="side-navbar">
            <ul className="nav flex-column text-center flex-grow-1">
                <li className="nav-item mb-3">
                    <a href="/profile" className="nav-link">
                    <img
            src={
              profilepicture
                ? `${config.BACKEND_URL}${profilepicture}` // Use profile picture from the backend URL
                : `${config.API_URL}${config.DEFAULT_IMAGE_PATH}` // Use default profile picture
            }
            alt="Profile" className="rounded-circle" style={{ width: '50px', height: '50px' }}
          />
                    </a>
                </li>
                <li className="nav-item mb-3">
                    <a href="/" className="nav-link">
                        <img src={`${config.API_URL}/images/Icons/homeIcon.png`} alt="Home Icon" style={{ height: "40px", width: "40px" }}/>
                    </a>
                </li>
                <li className="nav-item mb-3">
                    <a href="/createPost" className="nav-link">
                        <img src={`${config.API_URL}/images/Icons/addIcon.png`} alt="Add Post Icon" style={{ height: "40px", width: "40px" }} />
                    </a>
                </li>
            </ul>
            <div className="d-flex align-items-center justify-content-center" style={{height: "100%"}}>
                <button type="submit" onClick={handleLogout} className="text-white p-0 border-0 bg-transparent">
                    <a href="/logout" className="nav-link">
                        <img src={`${config.API_URL}/images/Icons/logoutIcon.png`} alt="Logout Icon" style={{ height: "40px", width: "40px", margin: "15px" }} />
                    </a>
                </button>
            </div>
        </nav>
    </div>
  );
};

export default Sidebar;
