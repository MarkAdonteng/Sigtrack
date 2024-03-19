import React, { useEffect} from 'react';
import { useSelectedMembers } from '../../Context/membersContext';
import AddMembersButton from '../../components/AddMembersButton';
import { useTeamMembersContext } from '../../Context/TeamMembersContext';
import TeamMembers from '../../components/TeamMembers';

// Helper function to format the date
const formatDate = (date: string | Date): string => {
  if (date instanceof Date) {
    // If it's already a Date object, use it
    return date.toLocaleDateString();
  } else {
    // Otherwise, assume it's a string and return it as is
    return date;
  }
};

const SecondSectionContent = () => {
  const { selectedMembers, dispatch } = useSelectedMembers();
  const { teamMembers } = useTeamMembersContext();


  useEffect(() => {
    // Save selectedMembers to local storage
    localStorage.setItem('selectedMembers', JSON.stringify(selectedMembers));
  }, [selectedMembers]);

  useEffect(() => {
    // Load selectedMembers from local storage
    const loadedSelectedMembers = localStorage.getItem('selectedMembers');
    if (loadedSelectedMembers) {
      dispatch({ type: 'SET_SELECTED_MEMBERS', payload: JSON.parse(loadedSelectedMembers) });
    }
  }, [dispatch]);

  const handleAddMembers = async () => {
    // Add logic for adding members
  };

  return (
    <div className="font-mono font-bold">
      <TeamMembers teamMembers={teamMembers} formatDate={formatDate} />

     
      <AddMembersButton onAddMembersClick={handleAddMembers} teamId='teamId' />
    </div>
  );
};

export default SecondSectionContent;
