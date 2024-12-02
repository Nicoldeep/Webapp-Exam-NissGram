import "./../styles/layout.css";
import React, { useEffect, useState } from "react";
import AllPosts from "../components/postCard/AllPosts";
import { Post } from "../types/interfaces";
import { getAllPosts } from "../services/postService";


const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchPosts = async () => {
      const { posts, error } = await getAllPosts();
      if (error) {
        setError(error);
      } else {
        
        setPosts(posts);
        setError(null);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  return (
    <div className="home-page">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <AllPosts posts={posts} />
      )}
    </div>
  );
};

export default HomePage;
