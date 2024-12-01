import React, { useEffect, useState } from 'react';
import ProfileHeader from '../../components/ProfileHeader';
import NavigationButtons from '../../components/NavigationButtons';
import DynamicContent from '../../components/profile/DynamicContent';
import '../../styles/profilePage.css';
import { fetchCurrentUser } from '../../api/operations'; // Import the API call function

const ProfilePage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'Pictures' | 'Notes' | 'LikedPosts'>('Pictures');
  const [userData, setUserData] = useState({
    username: '',
    description: '',
    pictureCount: 0,
    noteCount: 0,
    pictures: [],
    notes: [],
    activities: []
  });

  useEffect(() => {
    const getUserData = async () => {
      const response = await fetchCurrentUser();
      if (response.error) {
        console.error(response.error);
        return;
      }
      setUserData({
        username: response.username,
        description: response.about || 'No description available.',
        pictureCount: response.pictureCount || 0,
        noteCount: response.noteCount || 0,
        pictures: response.pictures || [],
        notes: response.notes || [],
        activities: response.likedPosts || []
      });
    };
    getUserData();
  }, []);
  

  const handleSectionChange = (section: 'Pictures' | 'Notes' | 'LikedPosts') => {
    setActiveSection(section);
  };

  return (
    <div className="container mt-4">
      {/* Profile Header Component */}
      <ProfileHeader userData={userData} />

      {/* Navigation Buttons */}
      <NavigationButtons onSectionChange={handleSectionChange} />

      {/* Dynamic Content */}
      <div className="mt-4">
        <DynamicContent
          section={activeSection}
          data={{
            pictures: userData.pictures,
            notes: userData.notes,
            activities: userData.activities
          }}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
