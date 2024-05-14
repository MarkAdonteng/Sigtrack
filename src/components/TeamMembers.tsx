// TeamMembers.tsx
import React, { useState, useEffect } from 'react';
import { getFirestore, doc, updateDoc, arrayRemove, collection, getDoc } from 'firebase/firestore';
import { useTeamMembersContext } from '../Context/TeamMembersContext';
import { useTeamId } from '../Context/TeamIdContext';
import { MemberData } from '../Context/TeamMembersContext';
import TeamMemberItem from './TeamMemberItem';
import EditMemberModal from './EditMemberModal';
import DisplayedTeamAndMember from './TeamDisplay';
import { useTeamsContext } from '../Context/TeamsContext';

interface TeamMembersProps {
  formatDate: (date: string | Date | undefined) => string;
}

export interface DisplayedTeamAndMembers {
  teamName: string;
  teamColor: string;
  members: MemberData[];
}

const TeamMembers: React.FC<TeamMembersProps> = ({ formatDate }) => {
  const { teamMembers, setTeamMembers } = useTeamMembersContext();
  const [showDetailsForm, setshowDetailsForm] = useState(false);
  const [showConfirmDeleteForm, setShowConfirmDeleteForm] = useState(false);
  const [ConfirmDeleteformData, setConfirmDeleteFormData] = useState<MemberData | null>(null);
  const [formData, setFormData] = useState<{ name: string; dateCreated: string | Date } | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [teamName, setTeamName] = useState<string>('');
  const [teamColor, setTeamColor] = useState<string>('');
  const { teamId } = useTeamId();

  const [displayedTeamsAndMembers, setDisplayedTeamsAndMembers] = useState<DisplayedTeamAndMembers[]>([]);
  

  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]); 
 

  useEffect(() => {
    const fetchTeamData = async () => {
      if (teamId) {
        const firestore = getFirestore();
        const teamDocRef = doc(firestore, 'Teams', teamId);
        const teamDocSnapshot = await getDoc(teamDocRef);
        if (teamDocSnapshot.exists()) {
          const teamData = teamDocSnapshot.data();
          if (teamData) {
            // Check if the team data already exists in displayedTeamsAndMembers
            const teamExists = displayedTeamsAndMembers.some(
              team => team.teamName === teamData.name && team.teamColor === (teamData.color || '') // Assuming color comparison is enough to identify uniqueness
            );
            if (!teamExists) {
              // Create a new team object
              const newTeam = { teamName: teamData.name, teamColor: teamData.color || '', members: teamMembers };
              // Append the new team to the existing list of displayed teams and members
              setDisplayedTeamsAndMembers(prevTeams => [...prevTeams, newTeam]);
              console.log("Displayed Team Names:", displayedTeamsAndMembers.map(team => team.teamName));
            }
          }
        }
      }
    };
  
    fetchTeamData();
  }, [teamId, displayedTeamsAndMembers]);

  // Update selectedTeamIds when teamId changes
  useEffect(() => {
    if (teamId && !selectedTeamIds.includes(teamId)) {
      setSelectedTeamIds(prevIds => [...prevIds, teamId]);
    }
  }, [teamId, selectedTeamIds]);

  const { setTeamNames } = useTeamsContext();

  useEffect(() => {
    const logTeamNames = (teams: DisplayedTeamAndMembers[]) => {
      const teamNames = teams.map((team) => team.teamName);
      console.log("Displayed Team Names:", teamNames);
      setTeamNames(teamNames); // Set team names in the context
    };

    logTeamNames(displayedTeamsAndMembers);
  }, [displayedTeamsAndMembers, setTeamNames]);
  
  


  const handleMemberClick = (name: string, dateCreated: string | Date) => {
    setShowEditForm(false);
    setshowDetailsForm(true);
    setFormData({ name, dateCreated });
  };
  

  const handleCloseForm = () => {
    setshowDetailsForm(false);
  };

  const handleDeleteClick = async (userId: string) => {
    try {
      const memberToDelete = teamMembers.find((member) => member.userId === userId) ?? null;
      setConfirmDeleteFormData(memberToDelete);
      setShowConfirmDeleteForm(true);
    } catch (error) {
      console.error('Error preparing delete confirmation:', error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      if (ConfirmDeleteformData) {
        const userId = ConfirmDeleteformData.userId;

        const updatedTeamMembers = teamMembers.filter((member) => member.userId !== userId);
        setTeamMembers(updatedTeamMembers);

        const firestore = getFirestore();
        const teamCollectionRef = collection(firestore, 'Teams');
        const teamDocRef = doc(teamCollectionRef, teamId ?? undefined);

        await updateDoc(teamDocRef, {
          members: arrayRemove(doc(firestore, 'users', userId)),
        });

        setShowConfirmDeleteForm(false);
      }
    } catch (error) {
      console.error('Error deleting member:', error);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDeleteForm(false);
  };

  const [editedMember, setEditedMember] = useState<MemberData | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const openEditModal = (member: MemberData) => {
    setEditedMember(member);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditedMember(null);
    setIsEditModalOpen(false);
  };

  const handleEditClick = (userId: string) => {
    const memberToEdit = teamMembers.find((member) => member.userId === userId);
    if (memberToEdit) {
      openEditModal(memberToEdit);
    }
  };

  const handleEditFormSubmit = async (updatedValues: Partial<MemberData>) => {
    try {
      const firestore = getFirestore();
      const memberDocRef = doc(firestore, 'users', editedMember?.userId || '');
      await updateDoc(memberDocRef, updatedValues);

      const updatedTeamMembers = teamMembers.map((member) =>
        member.userId === editedMember?.userId ? { ...member, ...updatedValues } : member
      );
      setTeamMembers(updatedTeamMembers as MemberData[]);

      closeEditModal();
    } catch (error) {
      console.error('Error updating member:', error);
    }
  };

  // Function to handle opening the edit modal
  const handleEditModalOpen = (member: MemberData) => {
    setEditedMember(member);
    setIsEditModalOpen(true);
  };

  return (
    <div className="fixed top-8 -ml-32 font-lato">
       <DisplayedTeamAndMember
        teamsAndMembers={displayedTeamsAndMembers}
        formatDate={formatDate}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
        onMemberClick={handleMemberClick}
        onEditModalOpen={handleEditModalOpen}
      />
    

      {editedMember && (
        <EditMemberModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditFormSubmit}
          member={editedMember}
          closeEditModal={closeEditModal}
        />
      )}
      
      {showConfirmDeleteForm && (
        <div className=" fixed inset-0 bg-gray-900 text-black bg-opacity-50 flex justify-center items-center z-36 text-sm">
          <div className=" bg-gray-200 text-black w-96 text-center rounded-lg shadow-md p-6  text-sm">
            <h2 className="text-lg font-semibold mb-2">Are you sure you want to delete {ConfirmDeleteformData?.name} </h2>
            <button
              onClick={handleConfirmDelete}
              className="w-20  bg-white text-black  font-bold rounded-md h-10  mt-6 mr-10 hover:bg-gray-300"
            >
              Yes
            </button>
            <button
              onClick={handleCancelDelete}
              className="w-20  bg-white text-black  font-bold rounded-md h-10  mt-6 mr-10 hover:bg-gray-300"
            >
              No
            </button>
          </div>
        </div>
      )}

      {showDetailsForm && formData && (
        <div className="fixed top-40 left-[540px] transform -translate-x-1/2 -translate-y-1/2 bg-white z-auto text-black p-4 rounded shadow-md w-80">
          <button type="button" className="ml-64" onClick={handleCloseForm}>
            X
          </button>
          <h2 className="text-lg font-semibold mb-2">Member Details</h2>
          <p>Name: {formData.name}</p>
          <p>Date Created: {formatDate(formData.dateCreated)}</p>
          <textarea
            className="w-full h-24 border border-gray-300 rounded-md p-2 mt-2"
            placeholder="Enter additional details..."
          />
        </div>
      )}
    </div>
  );
};

export default TeamMembers;