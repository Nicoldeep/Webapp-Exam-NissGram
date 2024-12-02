import React, { useState, useEffect } from 'react';
import PostDates from "./PostDates";
import config from "./../../apiConfig";
import { PostPopupProps } from "../../types/interfaces";
import { addComment, deleteComment, fetchCurrentUser} from "../../api/operations";

const PostPopup: React.FC<PostPopupProps> = ({ post, onClose }) => {
  const { postId, imgUrl, text, dateCreated, dateUpdated, likeCount, commentCount, comments } = post;

  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await fetchCurrentUser();
        setCurrentUser(user);
      } catch (err) {
        console.error("Error fetching current user:", err);
        setError("Failed to fetch current user.");
      }
    };

    fetchUser();
  }, []);

  const handleAddComment = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newComment.trim()) return;

    try {
      const result = await addComment({ postId, text: newComment });
      if (result.error) {
        setError("Failed to add comment: " + result.error);
        return;
      }
      // Assuming onClose will trigger the re-fetching of post details including new comments
      onClose();
    } catch (err) {
      console.error("Error adding comment:", err);
      setError("An error occurred while adding the comment.");
    }
    setNewComment("");
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      const result = await deleteComment(commentId);
      if (result.success) {
        onClose(); // Assume onClose will refresh the comments
      } else {
        setError("Failed to delete comment.");
      }
    } catch (err) {
      console.error("Error deleting comment:", err);
      setError("An error occurred while deleting the comment.");
    } 
  };

  const title = () =>{
    if(imgUrl){
      return post.text
    }
    else{
      return "Note"
    }
  } 

  const body = () => {
    if (imgUrl){
      return (
            <img
            src={
              imgUrl.startsWith("/images/post_images")
                ? `${config.BACKEND_URL}${imgUrl}`
                : `${config.API_URL}${config.DEFAULT_IMAGE_PATH}`
            }
            alt="Post"
            className="img-fluid rounded"
            style={{ marginTop: "10px" }}
          />
      )
    }
    else{
      return post.text
    }
  }

    const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is 0-indexed
    const year = date.getFullYear().toString().slice(-2); // Get last 2 digits of the year
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
  
    return `${day}.${month}.${year} | ${hours}:${minutes}`;
  };
  
  return (
    <div className="post-popup modal-body d-flex">
      <div className="left pe-3">
        {body()}


        <div>
          <strong > {title()}</strong>
        </div>
        <div className='likes-comments-dates'>


          <p>{likeCount} Likes</p>
          <p>{commentCount} Comments</p>
          
          <div className='postedDateModal'>

              <PostDates dateCreated={dateCreated} dateUpdated={dateUpdated} />
          </div>
        </div>
      </div>

      <div className="right">
  <h6>Comments</h6>
  <div className="comments-list">
    {comments.map((comment) => {
      const renderComment = (comment: any) => {
        console.log(comment);
        return (
          <div key={comment.commentId} className="comment-box">
            <div className="comment-header d-flex align-items-center">
              {   imgUrl && (
                <img
                  src={
                    imgUrl.startsWith("/images/postImages")
                      ? `${config.API_URL}${imgUrl}`
                      : `http://localhost:5024${imgUrl}`
                  }
                  alt="User"
                  className="rounded-circle comment-avatar"
                />
              )}
              <strong className="comment-username">{comment.simpleUser.userName ? comment.simpleUser.userName : "Unknown"}</strong>
            </div>
            <div className="comment-body">
              <strong>{comment.text}</strong>
              <small className="text-muted">{formatDate(comment.dateCommented)}</small>
              {currentUser && comment.simpleUser?.userName === currentUser.username && (
                <button onClick={() => handleDeleteComment(comment.commentId)} className="btn btn-link text-danger p-0 comment-delete">
                  <i className="fas fa-trash-alt"></i>
                </button>
              )}
            </div>
          </div>
        );
      };
      return renderComment(comment);
    })}
  </div>

  <form onSubmit={handleAddComment} className="comment-form">
    <input
      type="text"
      value={newComment}
      onChange={(e) => setNewComment(e.target.value)}
      placeholder="Write a comment..."
      required
      className="form-control"
    />
    <button className="btn btn-primary mt-2">Post</button>
  </form>
    </div>
    </div>
  );
};

export default PostPopup;
