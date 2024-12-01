import React, { useEffect, useState } from "react";
import PostCard from "./PostCard";
import { Post } from "../../types/post";
import { fetchCurrentUser as fetchUser } from '../../api/operations'; // Import the API call function

const AllPosts: React.FC<{ posts: Post[] }> = ({ posts }) => {
  //const [isLoading, setIsLoading] = useState<boolean>(true); // For å håndtere lasting
  const [currentUser, setCurrentUser] = useState<string | null>(null); // Holder userName for innlogget bruker

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        // Kall API for å hente nåværende bruker
        const data = await fetchUser(); // Forutsetter at fetchUser returnerer JSON-data
        //console.log("Fetched current user:", data);
        setCurrentUser(data.username); // Oppdaterer brukernavnet fra API-respons
      } catch (error) {
        //console.error("Error fetching current user:", error);
        setCurrentUser(null); // Angir feilmeldingstilstand hvis API feiler
      } 
    };

    fetchCurrentUser();
  }, []);


  // Feilmelding hvis brukeren ikke kunne lastes
  if (!currentUser) {
    return (
      <p>Error: Could not fetch the current user. Please try again later.</p>
    );
  }

  // Renderer listen over innlegg hvis data er lastet
  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.postId} {...post} currentUserName={currentUser} />
      ))}
    </div>
  );
};

export default AllPosts;
