import React, { useState } from "react";
import API_URL from "../../apiConfig";
import { Modal } from 'react-bootstrap';
import PostPopup from "./PostPopup";
import PostProfileHeader from "./PostProfileHeader"
import './../../styles/popUp.css';

// Make sure PostPopupProps are imported if they're defined in another file
interface PostActionsProps {
  postId: number;
  user: {
    id: number;
    userName: string;
    profilePicture: string;
  };
  imgUrl: string;
  text: string;
  dateCreated: Date;
  dateUpdated: Date;
  comments: Array<{
    commentId: number;
    text: string;
    dateCommented: string;
    user: {
      userName: string;
      profilePicture: string;
    };
  }>;
  userLiked: boolean;
  likeCount: number;
  commentCount: number;
  onLike: () => void;
  onAddComment: (text: string) => void;
  onDeleteComment: (commentId: number) => void;
  onCommentClick: () => void;
}

const PostActions: React.FC<PostActionsProps> = ({
  postId,
  user,
  imgUrl,
  text,
  dateCreated,
  dateUpdated,
  comments,
  userLiked,
  likeCount,
  commentCount,
  onLike,
  onAddComment,
  onDeleteComment,
  onCommentClick,
}) => {
  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal(!showModal);
  const [userLikedd, setUserLiked] = useState(userLiked);
  const [likeCountt, setLikeCount] = useState(likeCount);
  
  const handleLike = () => {
    setUserLiked(!userLiked);
    setLikeCount(userLiked ? likeCountt - 1 : likeCountt + 1);
  const [userLiked, setUserLiked] = useState(initialUserLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [error, setError] = useState<string | null>(null);

  const handleLike = async () => {
    try {
      // Oppdater state lokalt
      const newLikedState = !userLiked;
      setUserLiked(newLikedState);
      setLikeCount((prev) => (newLikedState ? prev + 1 : prev - 1));

      // Send like til backend
      const response = await fetch(`http://localhost:5024/api/PostAPI/like/${postId}`, {
        method: "POST",
        credentials: "include", // Inkluderer autentiseringstoken
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || "Failed to update like status.");
      }

      const data = await response.json();
      console.log("Backend response:", data);
    } catch (error: any) {
      console.error("Error updating like status:", error);

      // Tilbakestill state ved feil
      setUserLiked(!userLiked);
      setLikeCount((prev) => (userLiked ? prev + 1 : prev - 1));
      setError("An error occurred while updating your like.");
    }
  };

  return (
    <div className="d-flex align-items-center">
      {/* Feilmelding */}
      {error && <div className="text-danger">{error}</div>}

      {/* Like-knappen */}
      <div className="d-flex align-items-center mr-3 like-button-container">
        <button
          onClick={(e) => {
            e.preventDefault(); // Forhindre standard form-oppførsel
            handleLike(); // Håndter likes
          }}
          className="btn p-0"
          style={{ border: "none", background: "transparent" }}
        >
          <img
            src={`${API_URL}/images/Icons/${userLiked ? "heart-red" : "heart"}.png`}
            alt="Like Icon"
            className="like-img me-2"
            style={{ marginLeft: "5px", width: "25px", height: "24px" }}
          />
        </button>
        <span>{likeCount}</span>
      </div>

      <button onClick={toggleModal} className="btn comment-button-container">
        <img src={`${API_URL}/images/Icons/chat.png`} alt="Comment Icon" />
        <span>{commentCount}</span>
      </button>

      <Modal show={showModal} onHide={toggleModal} centered className="modal-xl"  >
        <Modal.Header closeButton >
          <Modal.Title>
          <div >
          <PostProfileHeader 
              profilePicture={user?.profilePicture || `${API_URL}/images/default-profile.png`}
              userName={user?.userName || "Unknown"}
              userProfileLink={`/user/${user?.userName || "unknown"}`}
          />
          </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PostPopup
            postId={postId}
            user={user}
            imgUrl={imgUrl}
            text={text}
            dateCreated={dateCreated}
            dateUpdated={dateUpdated}
            comments={comments}
            userLiked={userLikedd}
            likeCount={likeCountt}
            commentCount={commentCount}
            onLike={onLike}
            onAddComment={onAddComment}
            onDeleteComment={onDeleteComment}
            onClose={toggleModal}
            onCommentClick={onCommentClick}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PostActions;
