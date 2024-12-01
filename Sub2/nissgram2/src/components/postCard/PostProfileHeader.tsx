import React from "react";
import PostDropdown from "./PostDropdown";


interface PostProfileHeaderProps {
  profilePicture: string;
  userName: string;
  userProfileLink: string;

}

const PostProfileHeader: React.FC<PostProfileHeaderProps> = ({
  profilePicture,
  userName,
  userProfileLink,

}) => {
  return (
    <div className="d-flex align-items-center justify-content-between">
      <div className="d-flex align-items-center">
        <img
          src={profilePicture}
          alt="Profile"
          className="rounded-circle"
          style={{ width: "40px", height: "40px", marginRight: "10px" }}
        />
        <a href={userProfileLink} className="text-decoration-none text-dark">
          {userName}
        </a>
      </div>

     
    </div>
  );
};

export default PostProfileHeader;
