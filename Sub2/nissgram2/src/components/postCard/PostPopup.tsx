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
        {imgUrl && (
          <img
            src={
              imgUrl.startsWith("/images/postImages")
                ? `${config.BACKEND_URL}${imgUrl}`
                : `${config.API_URL}${config.DEFAULT_IMAGE_PATH}`
            }
            alt="Post"
            className="img-fluid rounded"
            style={{ marginTop: "10px" }}
          />
        )}

        <div className="d-flex align-items-center mr-3 like-button-container">
        
        
        <span>{likeCount}</span>
      </div>
        
        <PostDates dateCreated={dateCreated} dateUpdated={dateUpdated} />
        <p>{likeCount} Likes</p>
        <p>{commentCount} Comments</p>
      </div>

      <div className="right">
        <div>
          {title()}
        </div>
      <h6>Comments</h6>
        {comments.map((comment) => {

        const renderComment = (comment:any) => {
            console.log(comment)
            return (
            <div key={comment.commentId} className="list-group" style={{maxHeight:"23rem", overflowY:"auto",width:"100%"}}>
              <div className='list-group-item d-flex justify-content-between align-items-center'>
                <strong>{comment.simpleUser.userName ? comment.simpleUser.userName : "Unknown"}:</strong> {comment.text}
                <small className="text-muted">{formatDate(comment.dateCommented)}</small>
                {currentUser && comment.simpleUser?.userName === currentUser.username && (
                  <button onClick={() => handleDeleteComment(comment.commentId)} className="btn btn-link text-danger p-0">
                    <i className="fas fa-trash-alt"></i>
                  </button>
                )}
              </div>             
            </div>
            );
          };
              return renderComment(comment);
          })}

          <form onSubmit={handleAddComment}>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            required
          />
          <button className="btn btn-primary" type="submit">Post</button>
        </form>
      </div>
    </div>
  );
};

export default PostPopup;
