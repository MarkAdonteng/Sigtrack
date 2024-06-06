import React, { useState } from 'react';
import { useTeamMembersContext } from '../../Context/TeamMembersContext';
import CustomMarkers from '../../components/CustomMarker';
import { useCustomMarkerContext } from '../../Context/CustomMarkerContext';
import TeamData from '../../components/TeamData';


// // Helper function to format the date
// const formatDate = (date: string | Date | undefined): string => {
//   if (date instanceof Date) {
//     // If it's already a Date object, use it
//     return date.toLocaleDateString();
//   } else {
//     // Otherwise, assume it's a string and return it as is
//     return date || '';
//   }
// };

const SecondSectionContent = () => {
  const { teamMembers } = useTeamMembersContext();
  const { displayCustomMarker } = useCustomMarkerContext();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);


  const handleSelectImage = (url: string) => {
    setSelectedImage(url);
  };
  return (
    <div className="font-mono font-bold">
      {/* Conditionally render either TeamMembers or CustomMarkers */}
      {/* <TeamMembers formatDate={formatDate} /> */}
      {displayCustomMarker ? <CustomMarkers onSelectImage={handleSelectImage} /> : <TeamData/>}

      {/* AddMembersButton can be rendered outside the conditional rendering */}
      {/* <div className='fixed bottom-0'>
        <AddMembersButton onAddMembersClick={handleAddMembers} teamId='teamId' />
      </div> */}
    </div>
  );
};

export default SecondSectionContent;
