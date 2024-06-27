import React, { useState, useEffect, useReducer } from 'react';
import { collection, onSnapshot, getDoc, updateDoc, deleteDoc, DocumentReference, doc, addDoc, Timestamp, CollectionReference } from 'firebase/firestore';
import db from '../services/Firestore';
import { useNarrowContext } from '../Context/NarrowedContext';
import AddTeamModal from './AddTeamModal';
import EditTeamModal from './EditTeamModal';
import { useTeamId } from '../Context/TeamIdContext';
import { useTeamMembersContext } from '../Context/TeamMembersContext';
import { useOrganizationContext } from '../Context/organizationContext';
import TeamItem from './TeamItem';
import { useLoading } from '../Context/LoadingContext';
import { useTeamsContext } from '../Context/TeamsContext';
import { FIREBASE } from '../constants/firebase';
import { getAllTeams } from '../repo/teamsRepo/getAllTeams';
import { getAllOrganizations } from '../repo/organizationRepo/getAllOrganizations';
import { EditTeam } from '../repo/teamsRepo/editTeam';
import { addTeam } from '../repo/teamsRepo/addTeam';
import { getTeamUsers } from '../repo/userRepo/getTeamUsers';


export interface Team {
  id: string;
  name: string;
  date_established: Timestamp;
  color?: string;
  status: 'active' | 'suspended';
  description: string;
  members: CollectionReference[];
  timestamp: number; // Add timestamp for caching
  organization?: string;
}

interface OrganizationDocument {
  name: string;
  // Add other fields if necessary
}

interface TeamListProps {
  displayIconsOnly?: boolean; // Boolean prop to control the display of icons only
}

export interface MemberData {
  dateAdded: Timestamp;
  userId: string;
  callSign: string;
  status: string;

}


// Define action types
type ActionType =
  | { type: 'SET_ACTIVE_TEAMS'; payload: Team[] }
  | { type: 'SET_SUSPENDED_TEAMS'; payload: Team[] };

// Define reducer function
const teamsReducer = (
  state: { activeTeams: Team[]; suspendedTeams: Team[] },
  action: ActionType
): { activeTeams: Team[]; suspendedTeams: Team[] } => {
  switch (action.type) {
    case 'SET_ACTIVE_TEAMS':
      return { ...state, activeTeams: action.payload };
    case 'SET_SUSPENDED_TEAMS':
      return { ...state, suspendedTeams: action.payload };
    default:
      return state;
  }
};

const TeamList: React.FC<TeamListProps> = ({ displayIconsOnly = false }) => {
  const { enteredOrganization } = useOrganizationContext();
  const { isNarrowed1, toggleIsNarrowed1 } = useNarrowContext();
  const [showConfirmDeleteForm, setShowConfirmDeleteForm] = useState(false);
  const [ConfirmDeleteformData, setConfirmDeleteFormData] = useState<{ name: string; teamId: string } | null>(null);
  const { isLoading, setLoading } = useLoading();
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);
  const [showInternetConnectionForm, setShowInternetConnectionForm] = useState(false);
  const { teamNames } = useTeamsContext();

  const [{ activeTeams, suspendedTeams }, teamsDispatch] = useReducer(teamsReducer, {
    activeTeams: [],
    suspendedTeams: [],
  });

  const toggleTeamSelection = (teamId: string) => {
    setSelectedTeamIds((prevSelectedTeamIds) =>
      prevSelectedTeamIds.includes(teamId)
        ? prevSelectedTeamIds.filter((id) => id !== teamId) // Deselect if already selected
        : [...prevSelectedTeamIds, teamId] // Select if not already selected
    );
  };

  const fetchData = async () => {
    try {
      const teams = await getAllTeams();
      const activeTeamsData: Team[] = [];
      const suspendedTeamsData: Team[] = [];

      teams.forEach((team) => {
        if (team.organization === enteredOrganization) {
          if (team.status === 'active') {
            activeTeamsData.push(team);
          } else if (team.status === 'suspended') {
            suspendedTeamsData.push(team);
          }
        }
      });

      teamsDispatch({ type: 'SET_ACTIVE_TEAMS', payload: activeTeamsData });
      teamsDispatch({ type: 'SET_SUSPENDED_TEAMS', payload: suspendedTeamsData });

      localStorage.setItem('activeTeams', JSON.stringify(activeTeamsData));
      localStorage.setItem('suspendedTeams', JSON.stringify(suspendedTeamsData));
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [enteredOrganization]);

  const { setTeamId } = useTeamId();
  const { setTeamMembers } = useTeamMembersContext();

  const handleTeamNameClick = async (teamId: string) => {
    try {
      setLoading(true);
      console.log('Clicked Team ID:', teamId);
  
      if (!isNarrowed1) {
        toggleIsNarrowed1();
      }
  
      let timeoutFlag = false;
  
      // Start a timer to check loading state after 10 seconds
      const timeout = setTimeout(() => {
        timeoutFlag = true;
        setLoading(false); // Set loading to false if the timeout is reached
        setShowInternetConnectionForm(true);
      }, 10000);
  
      const teamMembers: MemberData[] = await getTeamUsers(teamId);
      setTeamMembers(teamMembers);
      console.log('GET', teamMembers)
  
      clearTimeout(timeout);
  
      setLoading(false);
      setTeamId(teamId);
    } catch (error) {
      console.error('Error fetching team members:', error);
      setLoading(false);
    }
  };
  
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAddButtonClick = () => {
    openModal();
  };

  const handleSubmitForm = async ({
    newTeamName,
    userEnteredStatus,
    userEnteredColor,
    userEnteredDescription,
  }: {
    newTeamName: string;
    userEnteredStatus: string;
    userEnteredColor: string;
    userEnteredDescription: string;
  }) => {
    const newTeamData = {
      name: newTeamName,
      date_established: Timestamp.now(),
      status: userEnteredStatus as 'active' | 'suspended',
      members: [],
      organization: enteredOrganization,
      color: userEnteredColor || 'brown',
      description: userEnteredDescription || '',
      timestamp: Date.now(),
    };
  
    await addTeam(newTeamData, setLoading, closeModal, fetchData);
  };
  
  
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const handleDeleteButtonClick = async (teamId: string) => {
    // Set the selected team ID and team data for confirmation message
    setSelectedTeamId(teamId);

    // Find the team data for the selected team ID
    const selectedTeam = activeTeams.find((team) => team.id === teamId) || suspendedTeams.find((team) => team.id === teamId);

    // Set ConfirmDeleteformData with the selected team's name
    setConfirmDeleteFormData({
      name: selectedTeam?.name || '',
      teamId: teamId,
    });


    setShowConfirmDeleteForm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, FIREBASE.TEAMS, selectedTeamId || ''));

      // Update UI by filtering out the deleted team
      const updatedActiveTeams = activeTeams.filter((team) => team.id !== selectedTeamId);
      const updatedSuspendedTeams = suspendedTeams.filter((team) => team.id !== selectedTeamId);

      teamsDispatch({ type: 'SET_ACTIVE_TEAMS', payload: updatedActiveTeams });
      teamsDispatch({ type: 'SET_SUSPENDED_TEAMS', payload: updatedSuspendedTeams });

      // You may want to update localStorage as well
      localStorage.setItem('activeTeams', JSON.stringify(updatedActiveTeams));
      localStorage.setItem('suspendedTeams', JSON.stringify(updatedSuspendedTeams));

      // Reset selected team ID and close the confirmation form
      setSelectedTeamId(null);
      setShowConfirmDeleteForm(false);
      setLoading(false);

      console.log('Team deleted successfully:', selectedTeamId);
    } catch (error) {
      console.error('Error deleting team:', error);
    }
  };

  const handleCancelDelete = () => {
    // Reset selected team ID and close the confirmation form
    setSelectedTeamId(null);
    setShowConfirmDeleteForm(false);
  };

  const [editedTeam, setEditedTeam] = useState<Team | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const openEditModal = (team: Team) => {
    setEditedTeam(team);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditedTeam(null);
    setIsEditModalOpen(false);
  };

  const handleEditButtonClick = (teamId: string) => {
    console.log('Edit button clicked for team ID:', teamId);
    const teamToEdit = activeTeams.find((team) => team.id === teamId) || suspendedTeams.find((team) => team.id === teamId);
    console.log('Team to edit:', teamToEdit);
    if (teamToEdit) {
      setEditedTeam(teamToEdit);
      setIsEditModalOpen(true);
    }
  };

  const handleEditFormSubmit = async (updatedValues: Partial<Team>) => {
    if (editedTeam) {
      await EditTeam(editedTeam.id, updatedValues, setLoading);
      closeEditModal();
      fetchData(); // Refresh the team list after editing
    }
  };
  

  return (
    <div className='font-latto overflow-hidden'>
      <div className='overflow-y-auto' style={{ maxHeight: 'calc(700px - 1rem)', width: '120%' }}>
        {showInternetConnectionForm && (
          <div className="fixed inset-0 z-50 bg-gray-900 text-black bg-opacity-50 flex justify-center items-center text-sm">
            <div className='bg-gray-200 text-black w-96 text-center rounded-lg shadow-md p-6  text-sm'>
              <h2 className="text-lg font-semibold mb-2">You internet connection</h2>
              <button onClick={() => setShowInternetConnectionForm(false)} className='w-20 bg-white text-black font-bold rounded-md h-10 mt-6 mr-10 hover:bg-gray-300'>Close</button>
            </div>
          </div>
        )}
        <div className='-ml-8 '>
          {isModalOpen && (
            <div className='fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex justify-center items-center '>
              <AddTeamModal isOpen={isModalOpen} onClose={closeModal} onSubmit={handleSubmitForm} />
            </div>
          )}

          {editedTeam && (
            <EditTeamModal
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              onSubmit={handleEditFormSubmit}
              team={editedTeam}
              closeEditModal={closeEditModal} // Pass closeEditModal as a prop
            />
          )}
        </div>
        <div className='space-y-2'>
          {!displayIconsOnly && <h2 className="font-bold font-lato text-black  ">Active Teams</h2>}
          <ul>
            {activeTeams.map((team) => (
              <TeamItem
                key={team.id}
                team={team}
                onEdit={handleEditButtonClick}
                onDelete={handleDeleteButtonClick}
                onTeamClick={handleTeamNameClick}
                displayIconsOnly={displayIconsOnly}
      
              />
            ))}
          </ul>

          <hr className='w-[250px] space-y-8  '></hr>

          <div className='space-y-2'>
            {!displayIconsOnly && <h2 className="font-bold  font-lato text-black ">Suspended Teams</h2>}
            <ul>
              {suspendedTeams.map((team) => (
                <TeamItem
                  key={team.id}
                  team={team}
                  onEdit={handleEditButtonClick}
                  onDelete={handleDeleteButtonClick}
                  onTeamClick={handleTeamNameClick}
                  displayIconsOnly={displayIconsOnly}
                 
                />
              ))}
            </ul>
          </div>
        </div>

        {/* Display form when showForm is true */}
        {showConfirmDeleteForm && (
          <div className="fixed inset-0 z-50 bg-gray-900 text-black bg-opacity-50 flex justify-center items-center text-sm">
            <div className=' bg-gray-200 text-black w-96 text-center rounded-lg shadow-md p-6  text-sm'>
              <h2 className="text-lg font-semibold mb-2">Are you sure you want to delete {ConfirmDeleteformData?.name} </h2>
              <button onClick={handleConfirmDelete}
                className='w-20  bg-white text-black  font-bold rounded-md h-10  mt-6 mr-10 hover:bg-gray-300'>Yes</button>
              <button onClick={handleCancelDelete}
                className='w-20  bg-white text-black  font-bold rounded-md h-10 mt-6 mr-10 hover:bg-gray-300'>No</button>
            </div>
          </div>
        )}
      </div>

      {!displayIconsOnly && (
        <div className="flex fixed bottom-1 right-3.5 font-lato font-bold">
          <button className="bg-white text-black px-4 py-2 rounded text-sm w-72 "
            onClick={handleAddButtonClick} >
            Add Team
          </button>
        </div>
      )}
    </div>
  );
};

export default TeamList;
