import React, { useState, useEffect, useRef } from 'react';
import { getFirestore, doc, updateDoc, arrayRemove, getDoc } from 'firebase/firestore';
import { useTeamMembersContext } from '../Context/TeamMembersContext';
import { useTeamId } from '../Context/TeamIdContext';
import { MemberData } from '../Context/TeamMembersContext';
import EditMemberModal from './EditMemberModal';
import DisplayedTeamAndMember from './TeamDisplay';
import { useTeamsContext } from '../Context/TeamsContext';
import { useDispatch, useSelector } from 'react-redux';
import { addDisplayedTeam, removeDisplayedTeam, updateDisplayedTeamMember, toggleDisplayedTeamVisibility } from '../redux/action';
import { RootState } from '../redux/store';
import AddMembersButton from './AddMembersButton';

interface TeamMembersProps {
  formatDate: (date: string | Date | undefined) => string;
}

export interface DisplayedTeamAndMembers {
  teamName: string;
  teamColor: string;
  members: MemberData[];
  isVisible?: boolean;
}

const TeamMembers: React.FC<TeamMembersProps> = ({ formatDate }) => {
  const { teamMembers, setTeamMembers } = useTeamMembersContext();
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [showConfirmDeleteForm, setShowConfirmDeleteForm] = useState(false);
  const [ConfirmDeleteformData, setConfirmDeleteFormData] = useState<MemberData | null>(null);
  const [formData, setFormData] = useState<{ name: string; dateCreated: string | Date } | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const { teamId } = useTeamId();
  const dispatch = useDispatch();
  const displayedTeamsAndMembers = useSelector((state: RootState) => state.team.displayedTeamsAndMembers as DisplayedTeamAndMembers[]);
  const { setTeamNames } = useTeamsContext();
  const prevTeamId = useRef<string | null>(null); // Ref to track previous teamId

 
  useEffect(() => {
    const fetchTeamData = async () => {
      if (teamId) {
        const firestore = getFirestore();
        const teamDocRef = doc(firestore, 'Teams', teamId);
        const teamDocSnapshot = await getDoc(teamDocRef);
        if (teamDocSnapshot.exists()) {
          const teamData = teamDocSnapshot.data();
          if (teamData) {
            const existingTeam = displayedTeamsAndMembers.find(team => team.teamName === teamData.name && team.teamColor === (teamData.color || ''));
            if (existingTeam) {
              dispatch(removeDisplayedTeam(teamData.name));
            } else {
              const newTeam: DisplayedTeamAndMembers = { teamName: teamData.name, teamColor: teamData.color || '', members: teamMembers, isVisible: true };
              
              dispatch(addDisplayedTeam(newTeam));
              
            }
        
  
            console.log("displayed teams and members=", displayedTeamsAndMembers)
            prevTeamId.current = teamId; // Update previous teamId
          }
        }
      }
    };
  
    fetchTeamData();
  }, [teamId, dispatch]);

  useEffect(() => {
    const logTeamNames = (teams: DisplayedTeamAndMembers[]) => {
      const teamNames = teams.map((team) => team.teamName);
      console.log("Displayed Team Names:", teamNames);
      setTeamNames(teamNames);
    };

    logTeamNames(displayedTeamsAndMembers);
  }, [displayedTeamsAndMembers, setTeamNames]);

  const handleMemberClick = (name: string, dateCreated: string | Date) => {
    setShowEditForm(false);
    setShowDetailsForm(true);
    setFormData({ name, dateCreated });
  };

  const handleCloseForm = () => {
    setShowDetailsForm(false);
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
        setShowConfirmDeleteForm(false);
        const firestore = getFirestore();
        const teamDocRef = doc(firestore, 'Teams', teamId ?? undefined);
        await updateDoc(teamDocRef, {
          members: arrayRemove(doc(firestore, 'users', userId)),
        });
        dispatch(updateDisplayedTeamMember(userId, {}));
      }
    } catch (error) {
      console.error('Error deleting member:', error);
    }
  };

  const handleCancelDelete = async () => {
    try {
      setShowConfirmDeleteForm(false);
    } catch (error) {
      console.error('Error canceling delete member:', error);
    }
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
      if (editedMember && editedMember.userId) {
        const firestore = getFirestore();
        const memberDocRef = doc(firestore, 'users', editedMember.userId);
        await updateDoc(memberDocRef, updatedValues);
        dispatch(updateDisplayedTeamMember(editedMember.userId, updatedValues));
      }

      closeEditModal();
    } catch (error) {
      console.error('Error updating member:', error);
    }
  };

  const handleEditModalOpen = (member: MemberData) => {
    setEditedMember(member);
    setIsEditModalOpen(true);
  };

  const handleAddMembers = async () => {
    // Add logic for adding members
  };

  return (
    <div className="fixed top-8 -ml-32 font-lato flex flex-col h-full w-48">
      <div className='overflow-y-auto overflow-x-hidden' style={{ maxHeight: 'calc(90vh - 1rem)', width: '125%' }}>
        <DisplayedTeamAndMember
          teamsAndMembers={displayedTeamsAndMembers.filter(team => team.isVisible)} // Only display visible teams
          formatDate={formatDate}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
          onMemberClick={handleMemberClick}
          onEditModalOpen={handleEditModalOpen}
        />

        {editedMember && (
          <EditMemberModal
            isOpen={isEditModalOpen}
            onClose={closeEditModal}
            onSubmit={handleEditFormSubmit}
            member={editedMember}
            closeEditModal={closeEditModal}
          />
        )}

        {showConfirmDeleteForm && (
          <div className="fixed inset-0 bg-gray-900 text-black bg-opacity-50 flex justify-center items-center z-36 text-sm">
            <div className="bg-gray-200 text-black w-96 text-center rounded-lg shadow-md p-6 text-sm">
              <h2 className="text-lg font-semibold mb-2">Are you sure you want to delete {ConfirmDeleteformData?.name}?</h2>
              <button
                onClick={handleConfirmDelete}
                className="w-20 bg-white text-black font-bold rounded-md h-10 mt-6 mr-10 hover:bg-gray-300"
              >
                Yes
              </button>
              <button
                onClick={handleCancelDelete}
                className="w-20 bg-white text-black font-bold rounded-md h-10 mt-6 mr-10 hover:bg-gray-300"
              >
                No
              </button>
            </div>
          </div>
        )}

        {showDetailsForm && formData && (
          <div className="fixed top-40 left-[540px] transform -translate-x-1/2 -translate-y-1/2 bg-gray-100 z-auto text-black p-4 rounded shadow-md w-80">
            <button type="button" className="ml-64" onClick={handleCloseForm}>
              X
            </button>
            <h2 className="text-lg font-semibold mb-2">Member Details</h2>
            <p className="text-sm">Name: {formData.name}</p>
            <p className="text-sm">Date Created: {formatDate(formData.dateCreated)}</p>
            <p className="text-sm">Additional Info:</p>
            <textarea
            className="input bg-white text-gray-800 border-0  rounded-md p-2 mb-4 focus:bg-gray-200 transition ease-in-out duration-150 w-full" >
              
            </textarea>
            <button className="mt-2 px-4 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300">
              Save
            </button>
          </div>
        )}
      </div>
      <div className="bottom-9 absolute -ml-4">
        <AddMembersButton onAddMembers={handleAddMembers} teamId={teamId || ''} />
      </div>
    </div>
  );
};

export default TeamMembers;
