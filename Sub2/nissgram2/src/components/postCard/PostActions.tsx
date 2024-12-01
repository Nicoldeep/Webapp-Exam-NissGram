import React, { useState } from "react";
import API_URL from "../../apiConfig";
import { Modal } from 'react-bootstrap';
import PostPopup from "./PostPopup";
import PostProfileHeader from "./PostProfileHeader"

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
  };

  return (
    <div className="d-flex align-items-center">
      <div className="like-button-container" onClick={handleLike}>
        <img src={`${API_URL}/images/Icons/${userLikedd ? "heart-red" : "heart"}.png`} alt="Like Icon" className="like-img" />
        <span>{likeCountt}</span>
      </div>

      <button onClick={toggleModal} className="btn comment-button-container">
        <img src={`${API_URL}/images/Icons/chat.png`} alt="Comment Icon" />
        <span>{commentCount}</span>
      </button>

      <Modal show={showModal} onHide={toggleModal} centered class="modal-dialog modal-xl" >
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
