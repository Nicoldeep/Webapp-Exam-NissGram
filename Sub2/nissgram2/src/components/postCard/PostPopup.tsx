import React from "react";
import PostDates from "./PostDates";
import PostActions from "./PostActions";
import API_URL from "../../apiConfig";
import './../../styles/popUp.css';
import { post } from "axios";
import { useState } from "react";
import { addComment, deleteComment} from "./../../api/operations";

interface CommentUser{
  userName: string;
  profilePicture: string;
}

interface Comment{
  commentId: number;
  text: string;
  dateCommented: string;
  user: CommentUser; 
}


interface PostPopupProps {
  postId: number;
  user: { userName: string; profilePicture: string; id: number };
  imgUrl?: string;
  text: string;
  dateCreated: Date;
  dateUpdated: Date;
  comments: Array<{
    commentId: number;
    text: string;
    dateCommented: string;
    user: { userName: string; profilePicture: string };
  }>;
  userLiked: boolean;
  likeCount: number;
  commentCount: number;
  onLike: () => void;
  onAddComment: (text: string) => void;
  onDeleteComment: (commentId: number) => void;
  onClose: () => void;
  onCommentClick: () => void;
}

const PostPopup: React.FC<PostPopupProps> = ({
  postId,
  user,
  imgUrl = '',
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
  onClose,
  onCommentClick,
})  => {

  const [newComment, setNewComment] = useState('');
  const handleAddComment = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newComment.trim()) return;
    const result = await addComment({
      postId: postId,
      text: newComment,
      username: user.userName, // This should match the backend expected field
      dateCommented: new Date().toISOString(),
    });

    console.log(newComment, user.userName, new Date().toISOString(),)

    if (result.error) {
      console.error('Failed to add comment:', result.error);
    } else {
      setNewComment('');
      // Push new comment to comments array to update UI
      comments.push({
        commentId: result.commentId, // Make sure your API returns the new ID
        text: newComment,
        dateCommented: new Date().toISOString(),
        user: { userName: user.userName, profilePicture: user.profilePicture }
      });
      // Call any additional state updates or side-effects here
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    const result = await deleteComment(commentId);
    if (result.error) {
      console.error('Failed to delete comment:', result.error);
    } else {
      // Filter out the deleted comment from the local state to update UI
      const updatedComments = comments.filter(comment => comment.commentId !== commentId);
      comments = updatedComments; // Assuming this updates your state correctly
    }
  };
  
  return (
    <div className="post-popup modal-content">
      
      <div className="modal-body d-flex">
          {/* Post Image or Text */}
        <div className="left pe-3">
         
            {imgUrl ? (
              <img
                src={imgUrl.startsWith('/images/postImages') ? `${API_URL}${imgUrl}` : `http://localhost:5024${imgUrl}`}
                alt="Post image"
                className="img-fluid rounded mb-3"
                style={{ maxHeight: "400px" }}
              />
            ): (
              <p className="font-italic">{text}</p>
            )}
          
          <div className="likes-comments-dates">
              <PostActions
                postId={user?.id || 0}
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
            <div className="postedDateModal">
              <PostDates dateCreated={dateCreated} dateUpdated={dateUpdated}/>
            </div>
          </div>
        </div>

          
        {/* R Post Actions */}
        <div className="right">
          <h5 className="mb-3">{imgUrl ? " " : "Note"}</h5>
          <h6>Comments</h6>
          <div className="comments-list" style={{ maxHeight: "200px", overflowY: "auto" }}>
            {comments.map((comment) => (
              <div key={comment.commentId} className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <img src={comment.user.profilePicture} alt={`${comment.user.userName}'s profile`} className="rounded-circle me-2" style={{ width: "30px", height: "30px" }} />
                  <div>
                    <strong>{comment.user.userName}</strong>
                    <p>{comment.text}</p>
                    <small>{new Date(comment.dateCommented).toLocaleString()}</small>
                  </div>
                </div>
                {comment.user.userName === user.userName && (
                  <button onClick={() => handleDeleteComment(comment.commentId)} className="btn btn-link text-danger p-0">
                    <i className="fas fa-trash-alt"></i>
                  </button>
                )}
              </div>
            ))}
          </div>

        {/*Add comment */}
          <form onSubmit={handleAddComment}>
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="form-control"
                placeholder="Write a comment..."
                required
              />
              <button type="submit" className="btn btn-primary">Post</button>
            </form>
      </div>
    </div>
    </div>
  );
};

export default PostPopup;
