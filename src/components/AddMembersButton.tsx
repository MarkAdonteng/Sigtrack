import React, { useState } from 'react';
import { db } from '../services/firebase';
import { collection, addDoc, doc, runTransaction,DocumentReference,getDoc} from 'firebase/firestore';
import { useOrganizationContext } from '../Context/organizationContext';
import { useTeamId } from '../Context/TeamIdContext';
import { arrayUnion } from 'firebase/firestore';
import { useTeamMembersContext } from '../Context/TeamMembersContext';



export interface AddMembersProps {
  onAddMembersClick: () => void;
  teamId: string; 
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


const AddMembersButton: React.FC<AddMembersProps> = () => {
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
    <div className="flex space-x-4 absolute top-72 mr-32 -left-28 w-96 text-black  text-sm">
      <button className="bg-white text-black px-4 py-2 rounded absolute" onClick={handleAddMemberClick}>
        Add Members
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-200 p-4 rounded w-96"> {/* Adjusted width */}
            <h2 className="text-center">Member Details</h2>
<div>
            <div className="field flex flex-col">
  <label className="label">Name:</label>
  <input
    className="input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 transition ease-in-out duration-150"
    type="text"
    value={formData.name}
    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
  />
</div>

            <div className="field flex flex-col">
  <label className="label">call Sign:</label>
  <input
    className="input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 transition ease-in-out duration-150"
    type="text"
    value={formData.callSign}
    onChange={(e) => setFormData({ ...formData, callSign: e.target.value })}
  />
</div>

            <div className="field flex flex-col">
            <label className='label'>Status:</label>
            <select value={formData.status}  
              className='input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200  transition ease-in-out duration-150'
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Select Status">Select Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

            <div className="field flex flex-col">
            <label className='label'> User Type:</label>
            <select value={formData.user_type} 
              className='input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200  transition ease-in-out duration-150'
              onChange={(e) => setFormData({ ...formData, user_type: e.target.value })}>
              <option value="select">Select</option>
            <option value="admin">admin</option>
            <option value="user">user</option>
          </select>
          </div>

            <div className="field flex flex-col">
  <label className="label">Latitude:</label>
  <input
    className="input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 transition ease-in-out duration-150"
    type="text"
    value={formData.latitude}
    onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
  />
</div>

            <div className="field flex flex-col">
  <label className="label">Longitude</label>
  <input
    className="input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 transition ease-in-out duration-150"
    type="text"
    value={formData.longitude}
    onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
  />
</div>
            
        <div className="field flex flex-col">
  <label className="label">Password:</label>
  <input
    className="input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 transition ease-in-out duration-150"
    type="text"
    value={formData.password}
    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
  />
</div>

<div className='text-center'>
            <button
              onClick={handleFormSubmit}
              className="button is-success bg-black text-white  font-bold w-20 h-10 rounded-md mt-6 mr-10"
            >
              Submit
            </button>
            <button
              onClick={handleModalClose}
              className="button button is-success bg-black text-white font-bold w-20 h-10 rounded-md mt-6"
            >
              Cancel
            </button>
            </div>
          </div>
        </div>
        </div>
      )}
     
    </div>
  );
};

export default AddMembersButton;
