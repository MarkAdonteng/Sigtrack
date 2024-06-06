import React, { useState } from 'react';
import { RiPencilFill, RiDeleteBin6Line } from 'react-icons/ri';
import EditMemberModal from './EditMemberModal';
import { db } from '../services/firebase';
import { collection, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { useLoading } from '../Context/LoadingContext';

interface MemberData {
  name: string;
  dateCreated: string | Date;
  userId: string;
  callSign: string;
  status: string;
  user_type: string;
  latitude: number;
  longitude: number;
  password: string;
}

interface MemberFeatures extends MemberData {}

interface TeamDataProps {
  teamName: string;
  teamColor: string;
  members: MemberFeatures[];
}

const TeamDataDisplay: React.FC<{ teamData: TeamDataProps, setTeamDataArray: React.Dispatch<React.SetStateAction<{ teamName: string, members: MemberFeatures[], teamColor: string }[]>> }> = ({ teamData, setTeamDataArray }) => {
  const [showConfirmDeleteForm, setShowConfirmDeleteForm] = useState(false);
  const [confirmDeleteFormData, setConfirmDeleteFormData] = useState<MemberData | null>(null);
  const [editedMember, setEditedMember] = useState<MemberData | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { isLoading, setLoading } = useLoading();

  const onUserClick = (userId: string) => {
    console.log('Edit clicked for user ID:', userId);
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
        console.log('Deleting member with userId:', userId);
        await deleteDoc(doc(collection(db, 'users'), userId));
        
        setTeamDataArray(prevTeamDataArray =>
          prevTeamDataArray.map(teamData => {
            if (teamData.members.some(member => member.userId === userId)) {
              const updatedMembers = teamData.members.filter(member => member.userId !== userId);
              return { ...teamData, members: updatedMembers };
            }
            return teamData;
          })
        );
  
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
    if (updatedValues.dateCreated && typeof updatedValues.dateCreated === 'string') {
      updatedValues.dateCreated = new Date(updatedValues.dateCreated);
    }
    try {
      setLoading(true);
      if (editedMember) {
        const userId = editedMember.userId;
        const memberDoc = doc(collection(db, 'users'), userId);
        await updateDoc(memberDoc, updatedValues);
        
        setTeamDataArray(prevTeamDataArray =>
          prevTeamDataArray.map(teamData => {
            if (teamData.members.some(member => member.userId === userId)) {
              const updatedMembers = teamData.members.map(member =>
                member.userId === userId ? { ...member, ...updatedValues } : member
              );
              return { ...teamData, members: updatedMembers };
            }
            return teamData;
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

  const renderTeamName = () => {
    if (teamData.teamName.length > 20) {
      return (
        <div
          className="overflow-hidden whitespace-nowrap text-sm font-bold text-alternate-text team-name"
          style={{ maxWidth: '120px' }}
          title={teamData.teamName}
        >
          {teamData.teamName.slice(0, 20)}...
        </div>
      );
    } else {
      return (
        <div
          className="overflow-hidden whitespace-nowrap text-lg font-bold text-alternate-text team-name"
        >
          {teamData.teamName}
        </div>
      );
    }
  };

  const renderMemberName = (name: string) => {
    if (name.length > 15) {
      return `${name.slice(0, 15)}...`;
    } else {
      return name;
    }
  };

  return (
    <div>

       <h1>{renderTeamName()}</h1>
       <ul>
        {teamData.members.map((member) => (
          <li key={member.userId} className="flex items-center font-lato">
            <div
              style={{ backgroundColor: teamData.teamColor }}
              className="text-white rounded-md p-2 w-8 h-8 mr-2 flex items-center justify-center font-lato cursor-pointer"
              onClick={() => onUserClick(member.userId)}
            >
              {member.name.charAt(0)}
            </div>
            <div className='cursor-pointer w-36 overflow-hidden whitespace-nowrap  items-center' title={member.name} onClick={() => onUserClick(member.userId)}>
            {renderMemberName(member.name)}
              <br />
              <div className="text-xs text-gray-500">{new Date(member.dateCreated).toLocaleDateString()}</div>
            </div>
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
              Are you sure you want to delete {confirmDeleteFormData?.name}?
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
