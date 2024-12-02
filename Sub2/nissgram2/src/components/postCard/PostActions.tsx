import React, { useState } from "react";
import config from "../../apiConfig";
import { Modal } from "react-bootstrap";
import PostPopup from "./PostPopup";
import PostProfileHeader from "./PostProfileHeader";
import { Post, PostDetails } from "../../types/interfaces";
import "../../styles/popUp.css";
import { likePost, getPostDetails} from "../../api/operations";

interface PostActionsProps {
  post: Post; // The post object
}

const PostActions: React.FC<PostActionsProps> = ({ post }) => {
  const { postId, simpleUser, imgUrl, text, dateCreated, dateUpdated, userLiked: initialUserLiked, likeCount: initialLikeCount, commentCount } = post;

  const [showModal, setShowModal] = useState(false);
  const [userLiked, setUserLiked] = useState(initialUserLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [postDetails, setPostDetails] = useState<PostDetails | null>(null); // Use PostDetails type
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const toggleModal = async () => {
    if (!showModal) {
      setLoading(true);
      try {
        const data: PostDetails = await getPostDetails(postId); // Fetch full post details
        setPostDetails(data); // Set PostDetails data
        if(simpleUser.profilePicture == null || simpleUser.profilePicture == "string"){
          simpleUser.profilePicture =  "/images/profile_pictures/profile_image_default.png";
        }
      } catch (err) {
        console.error("Error fetching post details:", err);
        setError("Failed to load post details.");
      } finally {
        setLoading(false);
      }
    }
    setShowModal(!showModal);
  };

  const handleLike = async () => {
    try {
      const newLikedState = !userLiked;
      setUserLiked(newLikedState); // Optimistically update UI
  
      const response = await likePost(postId); // Send likePost request to the API
  
      if (response && response.likeCount !== undefined) {
        setLikeCount(response.likeCount); // Update with the API's like count
      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (err) {
      console.error("Error liking the post:", err);
  
      // Revert optimistic state changes on failure
      setUserLiked(!userLiked);
      setError("Failed to update like status.");
    }
  };

  return (
    <div className="d-flex align-items-center">
      {error && <div className="text-danger">{error}</div>}

      <div className="d-flex align-items-center mr-3 like-button-container">
        <button
          onClick={(e) => {
            e.preventDefault();
            handleLike();
          }}
          className="btn p-0"
          style={{ border: "none", background: "transparent" }}
        >
          <img
            src={`${config.API_URL}/images/Icons/${userLiked ? "heart-red" : "heart"}.png`}
            alt="Like Icon"
            className="like-img me-2"
            style={{ marginLeft: "5px", width: "25px", height: "24px" }}
          />
        </button>
        <span>{likeCount}</span>
      </div>

      <button
        onClick={toggleModal}
        className="btn comment-button-container"
        disabled={loading} // Disable the button while loading
      >
        <img src={`${config.API_URL}/images/Icons/chat.png`} alt="Comment Icon" />
        <span>{commentCount}</span>
      </button>

      <Modal show={showModal} onHide={toggleModal} centered className="modal-xl">
        <Modal.Header closeButton>
          <Modal.Title>
            <PostProfileHeader
              profilePicture={simpleUser.profilePicture}
              userName={simpleUser.userName}
              userProfileLink={`/user/${simpleUser.userName}`}
            />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body">
          {loading ? (
            <p>Loading post details...</p>
          ) : postDetails ? (
            <PostPopup
              post={postDetails} // Pass the full PostDetails object
              onClose={toggleModal}
            />
          ) : (
            <p>Error loading post details.</p>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PostActions;
