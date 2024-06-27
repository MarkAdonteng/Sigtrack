import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { Timestamp, arrayUnion, doc, runTransaction } from 'firebase/firestore';
import { useOrganizationContext } from '../Context/organizationContext';
import { useTeamMembersContext } from '../Context/TeamMembersContext';
import { useTeamsContext } from '../Context/TeamsContext';
import ModalForm from './ModalForm';
import { useLoading } from '../Context/LoadingContext';
import { FIREBASE } from '../constants/firebase';
import { getUserNames, UserNameData } from '../repo/userRepo/getUserName'; // Adjust the import path as needed
import { addUser } from '../repo/teamsRepo/addUserToTeam'; // Adjust the import path as needed
import { getAllTeams } from '../repo/teamsRepo/getAllTeams'; // Import the getAllTeams function
import { MemberData } from './TeamList';

export interface AddMembersProps {
  onAddMembers: () => Promise<void>;
  teamId: string;
  teamDataArray: { teamId: string, teamName: string, members: MemberData[], teamColor: string }[];
  setTeamDataArray: React.Dispatch<React.SetStateAction<{ teamId: string, teamName: string, members: MemberData[], teamColor: string }[]>>;
}

export interface Member {
  userId: string;
  callSign: string;
  name: string;
  dateAdded: Timestamp; // Change this to Firestore Timestamp
  status: string;
  organization?: string;
  teamId: string;
}

const AddMembersButton: React.FC<AddMembersProps> = ({ onAddMembers, teamId, teamDataArray, setTeamDataArray }) => {
  const { enteredOrganization } = useOrganizationContext();
  const { setTeamMembers } = useTeamMembersContext();
  const { teamNames, setTeamNames } = useTeamsContext();
  const { isLoading, setLoading } = useLoading();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Member>({
    userId: '',
    callSign: '',
    name: '',
    dateAdded: Timestamp.now(), // Initialize with current timestamp
    status: '',
    organization: enteredOrganization || '',
    teamId: ''
  });
  const [userNames, setUserNames] = useState<UserNameData[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserNotExistModalOpen, setIsUserNotExistModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserNames = async () => {
      try {
        const names = await getUserNames();
        setUserNames(names);
      } catch (error) {
        console.error('Error fetching user names:', error);
      }
    };

    fetchUserNames();
  }, []);

  const resetForm = () => {
    setFormData({
      userId: '',
      callSign: '',
      name: '',
      dateAdded: Timestamp.now(),
      status: '',
      organization: enteredOrganization || '',
      teamId: ''
    });
  };

  // useEffect(() => {
  //   const fetchTeamNames = async () => {
  //     try {
  //       const teams = await getAllTeams();
  //       setTeamNames(teams.map((team) => team.name));
  //     } catch (error) {
  //       console.error('Error fetching team names:', error);
  //     }
  //   };

  //   fetchTeamNames();
  // }, []);

  const handleAddMemberClick = () => {
    setIsModalOpen(true);
    setFormData({
      ...formData,
      dateAdded: Timestamp.now(), // Update timestamp to current time
    });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    resetForm()
  };

  const handleNameFieldClick = () => {
    setIsDropdownOpen(true);
  };

  const handleNameSelect = (name: string) => {
    setFormData({ ...formData, name });
    setIsDropdownOpen(false);
  };

  const handleFormSubmit = async () => {
    try {
      // Check if the entered name exists in the userNames array
      const selectedUser = userNames.find((user) => user.name.toLowerCase() === formData.name.toLowerCase());

      if (!selectedUser) {
        // If the name does not exist, show the "USER DOES NOT EXIST" modal
        setIsUserNotExistModalOpen(true);
        return;
      }

      setLoading(true);

      const newMemberData = {
        callSign: formData.callSign,
        status: formData.status,
        dateAdded: Timestamp.now() // Set to Firestore timestamp
      };

      // Fetch all teams to check if the selected team exists
      const allTeams = await getAllTeams();
      const selectedTeam = allTeams.find((team) => team.id === formData.teamId);

      if (!selectedTeam) {
        throw new Error('Selected team does not exist!');
      }

      // Add the user to the Firestore using the selected teamId
      await addUser(selectedTeam.id, selectedUser.userId, newMemberData);

      // Update the team with the new member reference
      const teamRef = doc(db, FIREBASE.TEAMS, selectedTeam.id);
      const userRef = doc(db, FIREBASE.USERS, selectedUser.userId);

      await runTransaction(db, async (transaction) => {
        const teamDoc = await transaction.get(teamRef);
        if (!teamDoc.exists()) {
          throw new Error("Team does not exist!");
        }

        transaction.update(teamRef, {
          members: arrayUnion(userRef),
        });
      });

      setTeamDataArray(prevTeamDataArray => {
        return prevTeamDataArray.map(team => {
          if (team.teamId === formData.teamId) {
            return {
              ...team,
              members: [...team.members, {
                ...formData,
                userId: selectedUser.userId,
                dateAdded: newMemberData.dateAdded.toDate().toLocaleDateString() // Format the dateAdded field
              }]
            };
          }
          return team;
        });
      });

      setFormData({
        userId: '',
        callSign: '',
        name: '',
        dateAdded: Timestamp.now(),
        status: '',
        organization: enteredOrganization || '',
        teamId: ''
      });

      setIsModalOpen(false);
      setLoading(false);
    } catch (error) {
      console.error('Error adding new member:', error);
      setLoading(false);
    }
  };


  return (
    <div>
      <div className='relative'>
        <button className="bg-white text-black px-4 py-2 rounded w-72 -mr-[6.7rem]" onClick={handleAddMemberClick}>
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
              {teamNames.map((team, index) => (
                <option key={index} value={team.teamId}>{team.teamName}</option>
              ))}
            </select>
          </div>

          <div className="field flex flex-col space-y-1 mb-4 relative">
            <label className="label">Name:</label>
            <input
              className="input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 transition ease-in-out duration-150"
              type="text"
              value={formData.name}
              onClick={handleNameFieldClick}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {isDropdownOpen && (
              <div className="absolute z-50 bg-white border border-gray-300 mt-1 rounded-md shadow-lg w-full max-h-60 overflow-auto">
                {userNames
                  .filter((user) => user.name.toLowerCase().includes(formData.name.toLowerCase()))
                  .map((user) => (
                    <div
                      key={user.userId}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                      onClick={() => handleNameSelect(user.name)}
                    >
                      {user.name}
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div className="field flex flex-col space-y-1 mb-4">
            <label className='label'>Call Sign:</label>
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
        </ModalForm>
      </div>

      {/* Modal for USER DOES NOT EXIST */}
      {isUserNotExistModalOpen && (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-200 p-6 rounded shadow-lg text-center">
            <h2 className="text-xl mb-4">USER DOES NOT EXIST</h2>
            <button
              className="button button is-success bg-white text-black font-bold w-20 h-10 rounded-md mt-6 hover:bg-gray-300"
              onClick={() => setIsUserNotExistModalOpen(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMembersButton;
