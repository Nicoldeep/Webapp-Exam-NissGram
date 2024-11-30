import React from 'react';
import Logo from './../assets/images/Niss.png';
import ProfileIcon from './../assets/images/profile_image_default.png';
import HomeIcon from './../assets/images/homeIcon.png';
import AddIcon from './../assets/images/addIcon.png';
import LogoutIcon from './../assets/images/logoutIcon.png';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Header: React.FC = () => {

    const navigate = useNavigate();

    function handleLogout() {
        fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include", // Ensures cookies are sent with the request
        })
            .then((response) => {
                if (response.ok) {
                    console.log("Logged out successfully");
                    window.location.href = "/login"; // Redirect to login page
                } else {
                    console.error("Failed to log out");
                }
            })
            .catch((err) => console.error(err));
    }

  return (
    <header className="fixed-header">
        <a href="/" >
            <img src={Logo} alt="NissGram Logo" className="navbar-brand" style={{height: "70px", padding: "5px"}}/>
        </a>

        <nav className="icon-bar">
            <a href="/profile" className="nav-link">
                <div className="profile-container circle">
                    <img src={ProfileIcon} className="profile-picture" alt="Profile "/>
                </div>
            </a>
            <a href="/" className="nav-link">
                <img src={HomeIcon} style={{height: "40px", padding: "5px"}} alt="Home "/>
            </a>
            <a href="/createPost" className="nav-link">
                <img src={AddIcon} style={{height: "40px", padding: "5px"}} alt="Add Post "/>
            </a>
            <div className="d-inline nav-link" >
                <button type="submit" onClick={handleLogout} className="nav-link text-white p-0 border-0 bg-transparent">
                    <a href="/logout">
                        <img src={LogoutIcon} style={{height: "40px", padding: "5px"}} alt="Logout "/>
                    </a>
                </button>
            </div>
        </nav>
    </header>
  );
};

export default Header;