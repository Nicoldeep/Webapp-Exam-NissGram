import React from "react";
import PostCard from "../postCard/PostCard";
import { Post, UserProfile } from "../../types/interfaces";

interface PostsSectionProps {
  activeSection: "Pictures" | "Notes" | "LikedPosts";
  profileData: UserProfile;
  currentUser : string;
  isProfilePage?: boolean; // Add a flag to differentiate between pages
}

const PostsSection: React.FC<PostsSectionProps> = ({ activeSection, profileData, currentUser, isProfilePage = false, }) => {
  const getPostsForSection = (): Post[] => {
    switch (activeSection) {
      case "Pictures":
        return profileData.pictures;
      case "Notes":
        return profileData.notes;
      case "LikedPosts":
        return profileData.likedPosts;
      default:
        return [];
    }
  };

  const posts = getPostsForSection();

  if (!posts || posts.length === 0) {
    return <p>No posts available in this section.</p>;
  }

  return (
    <div
    className={isProfilePage ? "row row-cols-1 row-cols-md-3 g-4" : "row justify-content-center"}>
      {posts.map((post) => (
        <div
        key={post.postId}
        className={isProfilePage ? "col" : "col-md-6 mb-4 d-flex justify-content-center"}>
          <PostCard post={post} currentUserName={currentUser}  />
        </div>
      ))}
    </div>
  );
};

export default PostsSection;
