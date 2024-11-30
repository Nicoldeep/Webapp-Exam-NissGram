import React, { useEffect, useState } from 'react';
//import { getPosts } from './../api/apiClient';
import PostCard from '../components/PostCard';
import { Post } from '../types/post';

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  return (
    <div className="container">
        Halla
    </div>
  );
};

export default HomePage;
