import React, { useState } from 'react';
import {RiPencilFill,RiDeleteBin6Line } from 'react-icons/ri';
import EditMemberModal from './EditMemberModal';
import { useTeamMembersContext } from '../Context/TeamMembersContext';
import { getFirestore, doc, updateDoc, arrayRemove, collection } from 'firebase/firestore';
import { useTeamId } from '../Context/TeamIdContext';
import { Member } from './AddMembersButton';
import {MemberData} from '../Context/TeamMembersContext'

interface TeamMembersProps {
  formatDate: (date: string | Date) => string;
}

// interface MembersData {
//   userId: string;
//   callSign: string;
//   name: string;
//   dateCreated: string | Date;
//   latitude: number;
//   longitude: number;
//   password: string;
//   status: string;
//   user_type: string;
//   organization?: string;
// }

const TeamMembers: React.FC<TeamMembersProps> = ({ formatDate }) => {
  const { teamMembers, setTeamMembers } = useTeamMembersContext();
  const [showForm, setShowForm] = useState(false);
  const [showConfirmDeleteForm, setShowConfirmDeleteForm] = useState(false);
  const [ConfirmDeleteformData, setConfirmDeleteFormData] = useState<{ name: string;userId:string } | null>(null);
  const [formData, setFormData] = useState<{ name: string; dateCreated: string | Date } | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const { teamId } = useTeamId();


  const handleMemberClick = (name: string, dateCreated: string | Date, userId: string) => {
   
    setShowEditForm(true);
    setShowForm(true);
    setFormData({ name, dateCreated });
    console.log(`${name}': ${userId}`);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleDeleteClick = async (userId: string) => {
    try {
      const memberToDelete = teamMembers.find((member) => member.userId === userId);
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
        const teamDocRef = doc(teamCollectionRef, teamId);

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


  const [editedMember, setEditedMember] = useState<Member | null>(null);
const [isEditModalOpen, setIsEditModalOpen] = useState(false);

const openEditModal = (member: Member) => {
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

const handleEditFormSubmit = async (updatedValues: Partial<Member>) => {
  try {
    // Update the Firestore document
    const firestore = getFirestore();
    const memberDocRef = doc(firestore, 'users', editedMember?.userId || '');
    await updateDoc(memberDocRef, updatedValues);

    // Update the local state
    const updatedTeamMembers = teamMembers.map((member) =>
      member.userId === editedMember?.userId ? { ...member, ...updatedValues } : member
    );
    setTeamMembers(updatedTeamMembers as MemberData[]);

    // Close the modal
    closeEditModal();
  } catch (error) {
    console.error('Error updating member:', error);
  }
};



  return (
    <div className="fixed top-8 -ml-32">
      <h3 className="font-bold">Team Members</h3>
      <div>
      {editedMember && (
        <EditMemberModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditFormSubmit}
        member={editedMember}
        closeEditModal={closeEditModal}/>
      )}
      
      </div>
      <ul>
        {teamMembers.length === 0 ? (
          <li className="text-secondary-text">No members in this team</li>
        ) : (
          teamMembers.map((member, index) => (
            <li key={index} className="flex items-center mb-4">
              <div
                className="bg-red-500 text-white rounded-md p-2 w-8 h-8 mr-2 flex items-center justify-center outline outline-offset-0 outline-gray-200 cursor-pointer"
                onClick={() => handleMemberClick(member.name, member.dateCreated, member.userId)}
              >
                {member.name.charAt(0)}
              </div>
              <div className="flex flex-col">
                <div
                  className="text-sm font-bold cursor-pointer"
                  onClick={() => handleMemberClick(member.name, member.dateCreated, member.userId)}
                >
                  {member.name}
                </div>
                <div className="flex items-center absolute space-x-2 ml-36 mt-1">
                 <RiPencilFill
                    className="text-primary cursor-pointer"
                    onClick={() => handleEditClick(member.userId)}
                  />


                  <RiDeleteBin6Line
                    className="text-red-500 cursor-pointer"
                    onClick={() => handleDeleteClick(member.userId)}
                  />
                </div>
                <div className="text-xs text-secondary-text">
                  {formatDate(member.dateCreated)}
                </div>
              </div>
            </li>
          ))
        )}
      </ul>

      {/* Display form when showForm is true */}
          {showConfirmDeleteForm && (
        <div className=" fixed inset-0 bg-gray-900 text-black bg-opacity-50 flex justify-center items-center z-36 text-sm">
          <div className=' bg-gray-200 text-black w-96 text-center rounded-lg shadow-md p-6  text-sm'>
          <h2 className="text-lg font-semibold mb-2">Are you sure you want to delete {ConfirmDeleteformData?.name} </h2>
          <button onClick={handleConfirmDelete}
          className='w-20  bg-black text-white  font-bold rounded-sm  mt-6 mr-10'>Yes</button>
          <button onClick={handleCancelDelete}
          className='w-20  bg-black text-white  font-bold rounded-sm  mt-6 mr-10'>No</button>
        </div>
        </div>
      )}

      {showForm && (
        
        <div className="fixed top-40 left-[540px] transform -translate-x-1/2 -translate-y-1/2 bg-white z-auto text-black p-4 rounded shadow-md w-80">
         <button type='button' className='ml-64' onClick={handleCloseForm}>
            X
          </button>
          <h2 className="text-lg font-semibold mb-2">Member Details</h2>
          <p>Name: {formData?.name}</p>
          <p>Date Created: {formatDate(formData?.dateCreated)}</p>
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
