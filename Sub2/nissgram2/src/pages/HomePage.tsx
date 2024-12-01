import React, { useEffect, useState } from "react";
import AllPosts from "../components/postCard/AllPosts";
import { Post } from "../types/post";
import API_URL from '../apiConfig';
import './../styles/layout.css';

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:5024/api/HomeAPI/index", {
          method: "GET",
          credentials: "include", // Dette sender med cookies (auth token)
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await response.json();

        // Map data to align with the Post interface
        const enrichedPosts: Post[] = data.map((post: any) => ({
          postId: post.postId,
          imgUrl: post.imgUrl,
          text: post.text,
          dateCreated: new Date(post.dateCreated),
          dateUpdated: new Date(post.dateUpdated),
          user: {
            id: post.userId, // Juster hvis backend sender en annen struktur
            userName: post.username,
            profilePicture: post.user?.profilePicture || `${API_URL}/images/profile_image_default.png`, // Fallback til default
          },
          userLiked: false, // Oppdater basert på logikk hvis tilgjengelig
          likeCount: post.likeCount,
          commentCount: post.commentCount,
          onLike: () => console.log(`Liked post ${post.postId}`),
          onCommentClick: () => console.log(`Comment clicked for post ${post.postId}`),
          onUpdate: () => console.log(`Update post ${post.postId}`),
          onDelete: () => console.log(`Delete post ${post.postId}`),
        }));

        setPosts(enrichedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } 
    };

    fetchPosts();
  }, []);



  return (
    <div style={{ padding: "20px" }}>
      <AllPosts posts={posts} />
    </div>
  );
};

export default HomePage;
