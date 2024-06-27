import React, { useState } from 'react';
import { RiPencilFill, RiDeleteBin6Line } from 'react-icons/ri';
import EditMemberModal from './EditMemberModal';
import { useLoading } from '../Context/LoadingContext';
import { deleteUser } from '../repo/userRepo/deleteUser';
import { db } from '../services/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { FIREBASE } from '../constants/firebase';
import { MemberData } from './TeamList';
import { useUserNames } from '../Context/UserNameContext';

interface MemberFeatures extends MemberData {}

interface TeamDataProps {
  teamName: string;
  teamColor: string;
  teamId: string;
  members: MemberFeatures[];
}

const TeamDataDisplay: React.FC<{
  teamData: TeamDataProps;
  setTeamDataArray: React.Dispatch<React.SetStateAction<TeamDataProps[]>>;
}> = ({ teamData, setTeamDataArray }) => {
  const [showConfirmDeleteForm, setShowConfirmDeleteForm] = useState(false);
  const [confirmDeleteFormData, setConfirmDeleteFormData] = useState<MemberData | null>(null);
  const [editedMember, setEditedMember] = useState<MemberData | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { isLoading, setLoading } = useLoading();
  const { getUserName } = useUserNames();

  const onUserClick = (userId: string) => {
    console.log('Edit clicked for user ID:', userId);
    const name = getUserName(userId);
    console.log('User name:', name);
  };

  const handleDeleteClick = (userId: string) => {
    const member = teamData.members.find((m) => m.userId === userId);
    if (member) {
      setConfirmDeleteFormData(member);
      setShowConfirmDeleteForm(true);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      if (confirmDeleteFormData) {
        const userId = confirmDeleteFormData.userId;
        const teamId = teamData.teamId;
        console.log('Deleting member with userId:', userId);

        await deleteUser(teamId, userId);

        setTeamDataArray(prevTeamDataArray => {
          const updatedArray = prevTeamDataArray.map(team => {
            if (team.teamId === teamId) {
              const updatedMembers = team.members.filter(member => member.userId !== userId);
              return { ...team, members: updatedMembers };
            }
            return team;
          });
          return updatedArray;
        });

        setShowConfirmDeleteForm(false);
        setConfirmDeleteFormData(null);
      }
    } catch (error) {
      console.error('Error deleting member:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDeleteForm(false);
    setConfirmDeleteFormData(null);
  };

  const onEditModalOpen = (userId: string) => {
    const member = teamData.members.find((m) => m.userId === userId);
    if (member) {
      setEditedMember(member);
      setIsEditModalOpen(true);
    }
  };

  const closeEditModal = () => {
    setEditedMember(null);
    setIsEditModalOpen(false);
  };

  const handleEditFormSubmit = async (updatedValues: Partial<MemberData>) => {
    try {
      setLoading(true);
      if (editedMember) {
        const userId = editedMember.userId;
        const memberDoc = doc(db, `${FIREBASE.TEAMS}/${teamData.teamId}/${FIREBASE.MEMBERS}/${userId}`);
        await updateDoc(memberDoc, updatedValues);

        setTeamDataArray(prevTeamDataArray =>
          prevTeamDataArray.map(team => {
            if (team.teamId === teamData.teamId) {
              const updatedMembers = team.members.map(member =>
                member.userId === userId ? { ...member, ...updatedValues } : member
              );
              return { ...team, members: updatedMembers };
            }
            return team;
          })
        );

        closeEditModal();
      }
    } catch (error) {
      console.error('Error updating member:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMemberDetails = (member: MemberFeatures) => {
    const memberName = getUserName(member.userId);
    let dateAdded;
    try {
      if (member.dateAdded instanceof Date) {
        dateAdded = member.dateAdded.toLocaleDateString();
    } else if (member.dateAdded && member.dateAdded.toDate) {
        dateAdded = member.dateAdded.toDate().toLocaleDateString();
    } else {
        dateAdded = new Date(member.dateAdded).toLocaleDateString();
    }
    } catch (error) {
      console.error('Error parsing date:', error);
      dateAdded = 'Invalid date';
    }
    return (
      <div className="cursor-pointer w-36 overflow-hidden whitespace-nowrap items-center" title={`${memberName} (${member.callSign})`} onClick={() => onUserClick(member.userId)}>
        <div>{memberName}</div>
        <div className='text-xs'>CallSign: {member.callSign}</div>
        <div className="text-xs text-gray-500">{dateAdded}</div>
      </div>
    );
  };
  

  const renderTeamName = () => {
    const { teamName, teamColor } = teamData;
    const truncatedName = teamName.length > 20 ? `${teamName.slice(0, 20)}...` : teamName;

    return (
      <div className="overflow-hidden whitespace-nowrap text-lg font-bold text-alternate-text team-name" style={{ maxWidth: '120px' }} title={teamName}>
        {truncatedName}
      </div>
    );
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        {renderTeamName()}
      </div>
      <ul>
        {teamData.members.map((member) => (
          <li key={member.userId} className="flex items-center font-lato mb-2">
            <div
              style={{ backgroundColor: teamData.teamColor }}
              className="text-white rounded-md p-2 w-10 h-10 mr-2 flex items-center justify-center font-lato cursor-pointer"
              onClick={() => onUserClick(member.userId)}
            >
              {getUserName(member.userId).charAt(0)} {/* Display first character of memberName */}
            </div>
            {renderMemberDetails(member)}
            <div className="flex items-center relative space-x-2 ml-6 mt-1">
              <RiPencilFill
                className="text-primary cursor-pointer text-gray-500"
                onClick={() => onEditModalOpen(member.userId)}
              />
              <RiDeleteBin6Line
                className="text-red-500 cursor-pointer"
                onClick={() => handleDeleteClick(member.userId)}
              />
            </div>
          </li>
        ))}
      </ul>

      {editedMember && (
        <EditMemberModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          onSubmit={handleEditFormSubmit}
          member={editedMember}
        />
      )}

      {showConfirmDeleteForm && (
        <div className="fixed inset-0 bg-gray-900 text-black bg-opacity-50 flex justify-center items-center z-20 text-sm">
          <div className="bg-gray-200 text-black w-96 text-center rounded-lg shadow-md p-6 text-sm">
            <h2 className="text-lg font-semibold mb-2">
              Are you sure you want to delete {confirmDeleteFormData?.callSign}?
            </h2>
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
    </div>
  );
};

export default TeamDataDisplay;
