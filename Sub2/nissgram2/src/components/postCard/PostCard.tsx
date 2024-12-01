import React from "react";
import API_URL from "../../apiConfig";
import PostProfileHeader from "./PostProfileHeader";
import '../../styles/postCard.css';
import PostDates from "./PostDates";
import PostActions from "./PostActions";
import { Post } from "../../types/post"; // Sørg for at typen Post er riktig definert.
import { post } from "axios";

const PostCard: React.FC<Post> = ({
  user,
  imgUrl = '',
  text,
  likeCount,
  commentCount,
  dateCreated,
  dateUpdated,
  onLike,
  onCommentClick,
  userLiked, // Passer for likes
}) => {
  return (
    <div className="post-card">
      {/* Profilheader */}
      <PostProfileHeader
        profilePicture={user?.profilePicture || `${API_URL}/images/default-profile.png`}
        userName={user?.userName || "Unknown"}
        userProfileLink={`/user/${user?.userName || "unknown"}`}
      />

      {/* Postens bilde */}
      {imgUrl && (
        <img
          src={imgUrl.startsWith('/images/postImages') ? `${API_URL}${imgUrl}` : `http://localhost:5024${imgUrl}`}
          alt="Post image"
          className="post-image"
        />
      )}

      {/* Postens tekst */}
      <p>{text}</p>

      {/* Datoer */}
      <PostDates dateCreated={dateCreated} dateUpdated={dateUpdated} />
      
      {/* Likes og kommentarer */}
      <div className="likes-comments-dates">
      <PostActions
      postId={user?.id}
      userLiked={userLiked}
      likeCount={likeCount}
      commentCount={commentCount}
      onLike={onLike}
      onCommentClick={onCommentClick}
      user={user} // Assuming 'user' is an object with required details
      imgUrl={imgUrl}
      text={text}
      dateCreated={dateCreated}
      dateUpdated={dateUpdated}
      comments={[]} // Assuming you have comments data
      onAddComment={() => {}} // Placeholder function
      onDeleteComment={() => {}} // Placeholder function
    />
      </div>
    </div>
  );
};

export default PostCard;
