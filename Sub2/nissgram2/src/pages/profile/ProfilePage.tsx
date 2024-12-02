import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfileHeader from "../../components/profile/ProfileHeader";
import NavigationButtons from "../../components/profile/NavigationButtons";
import PostsSection from "../../components/profile/PostsSection";
import { UserProfile } from "../../types/interfaces";
import { getUserProfile, getUserProfileByUsername } from "../../api/operations";

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username?: string }>(); // Extract username from route
  const [activeSection, setActiveSection] = useState<"Pictures" | "Notes" | "LikedPosts">("Pictures");
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [loggedInUsername, setLoggedInUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);

        // Fetch the logged-in user's profile to determine username
        const loggedInUser = await getUserProfile();
        setLoggedInUsername(loggedInUser.username);

        let data;
        if (username) {
          // Fetch profile by username
          data = await getUserProfileByUsername(username);
        } else {
          // Fetch logged-in user's profile
          data = loggedInUser;
        }

        const userProfile: UserProfile = {
          username: data.username,
          pictureCount: data.pictureCount,
          noteCount: data.noteCount,
          profilePicture: data.profilePicture,
          about: data.about || "",
          pictures: data.pictures || [],
          notes: data.notes || [],
          likedPosts: username ? [] : data.likedPosts || [], // Hide likedPosts for other users
        };

        setProfileData(userProfile);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("Failed to load profile data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [username]); // Refetch data when username changes

  const handleSectionChange = (section: "Pictures" | "Notes" | "LikedPosts") => {
    if (username && section === "LikedPosts") return; // Prevent showing LikedPosts for other users
    setActiveSection(section);
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!profileData) {
    return <p>Error: No profile data available.</p>;
  }

  const isOwnProfile = loggedInUsername === profileData.username;

  return (
    <div className="container mt-4">
      <ProfileHeader
        profilepicture={profileData.profilePicture || "/images/profile_pictures/profile_image_default.png"}
        username={profileData.username}
        pictureCount={profileData.pictureCount}
        noteCount={profileData.noteCount}
        about={profileData.about || "No description available"}
        isOwnProfile={isOwnProfile} // Pass the flag to ProfileHeader
      />
      <NavigationButtons
        onSectionChange={handleSectionChange}
        hideLikedPosts={!!username} // Pass a flag to hide LikedPosts for other users
      />
      <div className="profile-posts">
        <PostsSection activeSection={activeSection} profileData={profileData} currentUser={loggedInUsername || "" } isProfilePage={true}  />
      </div>
    </div>
  );
};

export default ProfilePage;
