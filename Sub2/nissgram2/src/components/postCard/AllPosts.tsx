// src/components/postCard/AllPosts.tsx
import React, { useEffect, useState } from "react";
import PostCard from "./PostCard";
import { Post } from "../../types/interfaces";
import { getCurrentUser } from "../../services/postService";
import { likedPosts } from "../../api/operations";


const AllPosts: React.FC<{ posts: Post[] }> = ({ posts }) => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedPosts, setUpdatedPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        // Fetch current user
        const { username, error: userError } = await getCurrentUser();
        if (userError) {
          throw new Error(userError);
        }

        setCurrentUser(username);

        // Fetch liked posts
        const likedPostsResponse = await likedPosts();
        const likedPostIds = likedPostsResponse?.hasLiked || [];

        // Update posts with `userLiked` property
        const postsWithLikes = posts.map((post) => ({
          ...post,
          userLiked: likedPostIds.includes(post.postId), // Set userLiked based on likedPostIds
        }));

        setUpdatedPosts(postsWithLikes);
        setError(null);
      } catch (err) {
        console.error("Error fetching user data or liked posts:", err);
        setError("Failed to load posts. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [posts]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!currentUser) {
    return <p>Error: Could not fetch the current user. Please try again later.</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {updatedPosts.map((post) => (
        <div
          key={post.postId}
          style={{
            width: "40%", // Each post takes 50% of the page width
            marginBottom: "20px", // Space between posts
          }}
      >
          <PostCard post={post} currentUserName={currentUser} />
        </div>
      ))}
    </div>
  );
};

export default AllPosts;