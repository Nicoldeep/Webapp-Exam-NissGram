import React from 'react';
import { Post } from '../types/post';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className="card mb-4 mx-auto" style={{ maxWidth: '600px' }}>
      <div className="card-body">
        <h5>{post.userName}</h5>
        {post.imgUrl && <img src={post.imgUrl} alt="Post Image" className="img-fluid rounded mb-3" />}
        <p>{post.text}</p>
        <p className="text-muted">
          Posted on {new Date(post.dateCreated).toLocaleDateString()} | Updated on{' '}
          {new Date(post.dateUpdated).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default PostCard;
