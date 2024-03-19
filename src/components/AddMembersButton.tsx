import React, { useState } from 'react';
import { FaPen } from 'react-icons/fa';
import { db } from '../services/firebase';
import { collection, addDoc, doc, runTransaction,DocumentReference, updateDoc ,getDoc} from 'firebase/firestore';
import { useOrganizationContext } from '../Context/organizationContext';
import { Team } from './TeamList';
import { useTeamId } from '../Context/TeamIdContext';
import { arrayUnion } from 'firebase/firestore';
import { useTeamMembersContext } from '../Context/TeamMembersContext';



export interface AddMembersProps {
  onAddMembersClick: () => void;
  teamId: string; // Add teamId as a prop
}

export interface Member {
  userId: string;
  callSign: string;
  name: string;
  dateCreated: {
    seconds: number;
    nanoseconds: number;
  };
  latitude: number;
  longitude: number;
  password: string;
  status: string;
  user_type: string;
  organization?: string;
}


const AddMembersButton: React.FC<AddMembersProps> = ({ onAddMembersClick }) => {
  const { enteredOrganization } = useOrganizationContext();
  const { teamId } = useTeamId();
  const { setTeamMembers } = useTeamMembersContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Member>({
    
    userId: '',
    callSign: '',
    name: '',
    dateCreated: { seconds: 0, nanoseconds: 0 },
    latitude: 0,
    longitude: 0,
    password: '',
    status: '',
    user_type: '',
    organization: enteredOrganization || '',
  });

  const handleAddMemberClick = () => {
    // Set the current timestamp for the dateCreated field
    const currentTimestamp = Date.now();
    setIsModalOpen(true);
    
    // Update the formData with the current timestamp
    setFormData({
      ...formData,
      dateCreated: {
        seconds: Math.floor(currentTimestamp / 1000),
        nanoseconds: (currentTimestamp % 1000) * 1000000,
      },
    });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleFormSubmit = async () => {
    try {
      // Add validation logic here if needed

      // Add the new member to the local state
      const newMember = {
        ...formData,
        dateCreated: new Date(formData.dateCreated.seconds * 1000),
        userId: teamId, // Use teamId as the userId for simplicity, you can modify this as needed
      };

      // Update the UI by setting the new member to the TeamMembers context state
      setTeamMembers((prevMembers) => [...prevMembers, newMember]);

      // Add the new member to Firestore
      const userDocRef = await addDoc(collection(db, 'users'), formData);
      const userReference: DocumentReference = doc(db, 'users', userDocRef.id);

      // Update the corresponding team's document in the Teams collection
      const teamIdToUpdate = teamId || '';
      console.log('Updating team with ID:', teamIdToUpdate);

      if (teamIdToUpdate) {
        const teamDocRef = doc(db, 'Teams', teamIdToUpdate);
        const teamDoc = await getDoc(teamDocRef);

        if (teamDoc.exists()) {
          const teamData = teamDoc.data();
          const membersArray = teamData?.members || [];

          await runTransaction(db, async (transaction) => {
            // Add the new member reference to the members array
            transaction.update(teamDocRef, {
              members: arrayUnion(userReference),
            });

            console.log('New member added with ID:', userDocRef.id);
            setIsModalOpen(false);
          });
        } else {
          console.error('Team document not found for teamId:', teamIdToUpdate);
        }
      } else {
        console.error('Invalid teamId. Cannot update team document.');
      }
    } catch (error) {
      console.error('Error adding new member:', error);
    }
  };


  return (
    <div className="flex space-x-4 absolute top-72 mr-32 -left-28 w-96 text-black text-sm">
      <button className="bg-white text-black px-4 py-2 rounded absolute" onClick={handleAddMemberClick}>
        Add Members
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-200 p-4 rounded">
          <h2 className='text-center'>Member Details</h2>
            <div>
              <label>Name:</label>
              <input
                type="text"
                value={formData.name}
                className="input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label>Call Sign:</label>
              <input
                type="text"
                value={formData.callSign}
                className="input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                onChange={(e) => setFormData({ ...formData, callSign: e.target.value })}
              />
            </div>
            <div>
              <label>Status (active/suspended):</label>
              <select
                value={formData.status}
                className="input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="select">Select</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div>
              <label>User Type (admin/user):</label>
              <select
                value={formData.user_type}
                className="input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                onChange={(e) => setFormData({ ...formData, user_type: e.target.value })}
              >
                <option value="select">Select</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            <div>
              <label>Latitude:</label>
              <input
                type="number"
                value={formData.latitude}
                className="input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label>Longitude:</label>
              <input
                type="number"
                value={formData.longitude}
                className="input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                className="input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button
              onClick={handleFormSubmit}
              className="button is-success w-20 bg-black text-white  font-bold rounded-sm mt-6 mr-10"
            >
              Submit
            </button>
            <button
              onClick={handleModalClose}
              className="button button is-success w-24 bg-black text-white font-bold rounded-sm mt-6"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMembersButton;
