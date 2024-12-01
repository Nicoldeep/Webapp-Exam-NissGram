import React from "react";
import PostDates from "./PostDates";
import PostActions from "./PostActions";

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
  return (
    <div className="post-popup">
      
      <div className="modal-body d-flex flex-column">
          {/* Post Image or Text */}
        <div className="left pe-3">
          <div className="mb-3">
            {imgUrl ? (
              <img
                src={imgUrl}
                alt="Post"
                className="img-fluid rounded mb-3"
                style={{ maxHeight: "600px" }}
              />
            ) : (
              <p className="font-italic">{text}</p>
            )}
          </div>
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

        {/* Post Actions */}
        <div className="d-flex align-items-center mb-3">
          <button
            className={`btn btn-sm ${userLiked ? "btn-danger" : "btn-outline-danger"} me-3`}
            onClick={onLike}
          >
            {userLiked ? "Unlike" : "Like"} ({likeCount})
          </button>
          <span className="text-muted">Comments: {commentCount}</span>
        </div>

        {/* Comments Section */}
        <div>
          <h6>Comments</h6>
          <div className="comments-list mb-3" style={{ maxHeight: "200px", overflowY: "auto" }}>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.commentId} className="d-flex align-items-start mb-3">
                  <img
                    src={comment.user.profilePicture}
                    alt={`${comment.user.userName}'s profile`}
                    className="rounded-circle me-2"
                    style={{ width: "30px", height: "30px" }}
                  />
                  <div>
                    <strong>{comment.user.userName}</strong>
                    <p className="mb-1">{comment.text}</p>
                    <small className="text-muted">{new Date(comment.dateCommented).toLocaleString()}</small>
                    {comment.user.userName === user.userName && (
                      <button
                        className="btn btn-link text-danger p-0 ms-3"
                        onClick={() => onDeleteComment(comment.commentId)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted">No comments yet. Be the first to comment!</p>
            )}
          </div>

          {/* Add Comment */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const commentText = formData.get("commentText")?.toString().trim();
              if (commentText) onAddComment(commentText);
              (e.target as HTMLFormElement).reset();
            }}
          >
            <div className="input-group">
              <input
                type="text"
                name="commentText"
                className="form-control"
                placeholder="Write a comment..."
                required
              />
              <button className="btn btn-primary" type="submit">
                Post
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="modal-footer text-muted">
        <small>Posted: {new Date(dateCreated).toLocaleString()}</small>
        <small className="ms-auto">Last updated: {new Date(dateUpdated).toLocaleString()}</small>
      </div>
    </div>
  );
};

export default PostPopup;
