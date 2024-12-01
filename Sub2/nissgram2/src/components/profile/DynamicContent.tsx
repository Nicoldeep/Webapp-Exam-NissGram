import React from 'react';
import PicturesSection from '../PicturesSection';
import NotesSection from '../NotesSection';
import ActivitySection from './ActivitySection';

type Section = 'Pictures' | 'Notes' | 'LikedPosts';

interface DynamicContentProps {
  section: Section;
  data: {
    pictures: string[];
    notes: string[];
    activities: string[];
  };
}

const DynamicContent: React.FC<DynamicContentProps> = ({ section, data }) => {
  switch (section) {
    case 'Pictures':
      return <PicturesSection pictures={data.pictures} />;
    case 'Notes':
      return <NotesSection notes={data.notes} />;
    case 'LikedPosts':
      return <ActivitySection activities={data.activities} />;
    default:
      return null;
  }
};


export default DynamicContent;
