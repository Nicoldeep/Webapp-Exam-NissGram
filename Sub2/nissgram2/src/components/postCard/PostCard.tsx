import React from "react";
import config from '../../apiConfig';
import PostProfileHeader from "./PostProfileHeader";
import "../../styles/postCard.css";
import PostDates from "./PostDates";
import PostActions from "./PostActions";
import PostDropdown from "./PostDropdown";
import { Post } from "../../types/interfaces";

interface PostCardProps {
  post: Post; // The post object as a single prop
  currentUserName: string; // Current logged-in user's username
}

const PostCard: React.FC<PostCardProps> = ({ post, currentUserName }) => {
  const {
    simpleUser,
    imgUrl,
    text,
    likeCount,
    commentCount,
    dateCreated,
    dateUpdated,
    userLiked,
    postId,
  } = post;

  // Fallback values for user object and profilePicture
  let userProfilePicture = simpleUser?.profilePicture;
  const username = simpleUser?.userName || "unknown";

  if(userProfilePicture == null || userProfilePicture == "string"){
    userProfilePicture =  "/images/profile_pictures/profile_image_default.png";
  }
  const handleEdit = () => {
    console.log(`Editing post with ID: ${postId}`);
  };

  const handleDelete = () => {
    console.log(`Deleting post with ID: ${postId}`);
  };

  return (
    <div className="post-card" style={{ position: "relative", marginBottom: "20px" }}>
      <div className="d-flex justify-content-between align-items-center">
        <PostProfileHeader
          profilePicture={userProfilePicture} // Use fallback value
          userName={username} // Use fallback value
          userProfileLink={`/user/${username}`} // Use fallback value
        />
        {currentUserName === simpleUser?.userName && (
          <PostDropdown onEdit={handleEdit} onDelete={handleDelete} postId={postId} />
        )}
      </div>
      {imgUrl && (
        <img
          src={
            imgUrl.startsWith("/images/postImages")
              ? `${config.API_URL}${imgUrl}`
              : `${config.BACKEND_URL}${imgUrl}`
          }
          alt="Post"
          className="img-fluid rounded"
          style={{ marginTop: "10px" }}
        />
      )}
      <p>{text}</p>
      <hr />
      <PostDates dateCreated={dateCreated} dateUpdated={dateUpdated} />
      <PostActions
        post={{
          postId,
          simpleUser,
          imgUrl,
          text,
          dateCreated,
          dateUpdated,
          userLiked,
          likeCount,
          commentCount,
        }}
      />
    </div>
  );
};

export default PostCard;