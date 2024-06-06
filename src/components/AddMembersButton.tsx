import React, { useState } from 'react';
import { db } from '../services/firebase';
import { collection, addDoc, doc, runTransaction, DocumentReference, getDocs, query, where } from 'firebase/firestore';
import { useOrganizationContext } from '../Context/organizationContext';
import { useTeamId } from '../Context/TeamIdContext';
import { arrayUnion } from 'firebase/firestore';
import { useTeamMembersContext } from '../Context/TeamMembersContext';
import { useTeamsContext } from '../Context/TeamsContext';
import ModalForm from './ModalForm';
import { MemberFeatures } from './TeamData';
import { useLoading } from '../Context/LoadingContext';

export interface AddMembersProps {
  onAddMembers: () => Promise<void>;
  teamId: string;
  teamDataArray: { teamName: string, members: MemberFeatures[], teamColor: string }[];
  setTeamDataArray: React.Dispatch<React.SetStateAction<{ teamName: string, members: MemberFeatures[], teamColor: string }[]>>;
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
  teamId:string;
}

const AddMembersButton: React.FC<AddMembersProps> = ({ onAddMembers, teamId, teamDataArray, setTeamDataArray }) => {
  const { enteredOrganization } = useOrganizationContext();
  const { setTeamMembers } = useTeamMembersContext();
  const { teamNames } = useTeamsContext();
  const { isLoading, setLoading } = useLoading();

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
    teamId:''
  });

  const handleAddMemberClick = () => {
    const currentTimestamp = Date.now();
    setIsModalOpen(true);

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
      setLoading(true);
      const capitalizedName = formData.name.charAt(0).toUpperCase() + formData.name.slice(1);
      const newMember = {
        ...formData,
        name: capitalizedName,
        dateCreated: new Date(formData.dateCreated.seconds * 1000), // Convert dateCreated to Date object
        userId: teamId || '',
      };
  
      // Update the state array with the new member
      setTeamMembers((prevMembers) => [...prevMembers, newMember]);
  
      const teamNameToSearch = formData.teamId;
      const teamQuery = query(collection(db, 'Teams'), where('name', '==', teamNameToSearch));
      const teamQuerySnapshot = await getDocs(teamQuery);
  
      if (!teamQuerySnapshot.empty) {
        const teamDoc = teamQuerySnapshot.docs[0];
        const teamDocRef = doc(db, 'Teams', teamDoc.id);
  
        const userDocRef = await addDoc(collection(db, 'users'), formData);
        const userReference: DocumentReference = doc(db, 'users', userDocRef.id);
  
        await runTransaction(db, async (transaction) => {
          transaction.update(teamDocRef, {
            members: arrayUnion(userReference),
          });
  
          console.log('New member added with ID:', userDocRef.id);
          setIsModalOpen(false);
          setLoading(false);

          setTeamDataArray(prevTeamDataArray => {
            return prevTeamDataArray.map(team => {
              if (team.teamName === teamNameToSearch) {
                return {
                  ...team,
                  members: [...team.members, newMember]
                };
              }
              return team;
            });
          });
          setFormData({
            ...formData,
            userId: userDocRef.id, // Set userId to userDocRef.id
          });
         
        });

        setFormData({
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
          teamId: ''
      });
      } else {
        console.error('Team not found with name:', teamNameToSearch);
      }
    } catch (error) {
      console.error('Error adding new member:', error);
    }
  };
  
  return (
    <div>
      <div className='relative '>
        <button className="bg-white text-black px-4 py-2 rounded  w-72 -mr-[6.7rem]" onClick={handleAddMemberClick}>
          Add Members
        </button>
      </div>
      <div className="flex absolute top-72 mr-20 w-96 text-black text-sm font-lato">
        <ModalForm
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSubmit={handleFormSubmit}
          title="Add Member ">

          <div className="field flex flex-col space-y-1 mb-4">
            <label className='label'>Teams:</label>
            <select
              value={formData.teamId}
              className='input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 transition ease-in-out duration-150'
              onChange={(e) => setFormData({ ...formData, teamId: e.target.value })}
            >
              <option value="">Select Team</option>
              {teamNames.map((teamName, index) => (
                <option key={index} value={teamName}>{teamName}</option>
              ))}
            </select>
          </div>

          <div className="field flex flex-col space-y-1 mb-4">
            <label className="label">Name:</label>
            <input
              className="input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 transition ease-in-out duration-150"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="field flex flex-col space-y-1 mb-4">
            <label className="label">Call Sign:</label>
            <input
              className="input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 transition ease-in-out duration-150"
              type="text"
              value={formData.callSign}
              onChange={(e) => setFormData({ ...formData, callSign: e.target.value })}
            />
          </div>

          <div className="field flex flex-col space-y-1 mb-4">
            <label className='label'>Status:</label>
            <select value={formData.status}
              className='input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 transition ease-in-out duration-150'
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Select Status">Select Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div className="field flex flex-col space-y-1 mb-4">
            <label className='label'> User Type:</label>
            <select value={formData.user_type}
              className='input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 transition ease-in-out duration-150'
              onChange={(e) => setFormData({ ...formData, user_type: e.target.value })}>
              <option value="select">Select</option>
              <option value="admin">admin</option>
              <option value="user">user</option>
            </select>
          </div>

          <div className="field flex flex-col space-y-1 mb-4">
            <label className="label">Latitude:</label>
            <input
              className="input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 transition ease-in-out duration-150"
              type="text"
              value={formData.latitude}
              onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
            />
          </div>

          <div className="field flex flex-col space-y-1 mb-4">
            <label className="label">Longitude</label>
            <input
              className="input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 transition ease-in-out duration-150"
              type="text"
              value={formData.longitude}
              onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
            />
          </div>

          <div className="field flex flex-col space-y-1 mb-4">
            <label className="label">Password:</label>
            <input
              className="input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 transition ease-in-out duration-150"
              type="text"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
        </ModalForm>
      </div>
    </div>
  );
};

export default AddMembersButton;
