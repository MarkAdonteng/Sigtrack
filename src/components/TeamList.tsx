import React, { useState, useEffect, useReducer } from 'react';
import { collection, onSnapshot, getDoc,updateDoc,deleteDoc, DocumentReference, doc,addDoc } from 'firebase/firestore';
import db from '../services/Firestore';
// import { useSelectedMembers } from '../Context/membersContext';
import { useNarrowContext } from '../Context/NarrowedContext';
import AddTeamModal from './AddTeamModal';
import { RiPencilFill, RiDeleteBin6Line } from 'react-icons/ri';
import EditTeamModal from './EditTeamModal';
import { useTeamId } from '../Context/TeamIdContext';
import { useTeamMembersContext } from '../Context/TeamMembersContext';
import { useOrganizationContext } from '../Context/organizationContext';
import TeamItem from './TeamItem';
import { useLoading } from '../Context/LoadingContext';
import { useTeamsContext } from '../Context/TeamsContext';



export interface Team {
  id: string; 
  name: string;
  date_established: {
    seconds: number;
    nanoseconds: number;
  };
  color?: string;
  status: 'active' | 'suspended';
  description:string;
  members: DocumentReference[];
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
  name: string;
  dateCreated: string | Date;
  userId: string;
  callSign: string;
  status: string;
  user_type: string;
  longitude: number;
  latitude: number;
  password: string;
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
  // const { selectedMembers, dispatch } = useSelectedMembers();
  const [showConfirmDeleteForm, setShowConfirmDeleteForm] = useState(false);
  const [ConfirmDeleteformData, setConfirmDeleteFormData] = useState<{ name: string;teamId:string } | null>(null);
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

 // ...
 useEffect(() => {
  const fetchData = async () => {
    const teamsRef = collection(db, 'Teams');
    const unsubscribe = onSnapshot(teamsRef, async (snapshot) => {
      const activeTeamsData: Team[] = [];
      const suspendedTeamsData: Team[] = [];

      snapshot.forEach((doc) => {
        const { name, date_established, color, status, members, description, organization } = doc.data();
        const teamData: Team = {
          id: doc.id,
          name,
          date_established,
          color,
          status,
          members,
          organization,
          description,
          timestamp: Date.now(),
        };

        if (organization === enteredOrganization) {
          if (status === 'active') {
            activeTeamsData.push(teamData);
          } else if (status === 'suspended') {
            suspendedTeamsData.push(teamData);
          }
        }
      });

      teamsDispatch({ type: 'SET_ACTIVE_TEAMS', payload: activeTeamsData });
      teamsDispatch({ type: 'SET_SUSPENDED_TEAMS', payload: suspendedTeamsData });

      // Save data to local storage
      localStorage.setItem('activeTeams', JSON.stringify(activeTeamsData));
      localStorage.setItem('suspendedTeams', JSON.stringify(suspendedTeamsData));
    });

    return unsubscribe;
  };

  fetchData();
}, [enteredOrganization, teamsDispatch]);




const { setTeamId } = useTeamId();



const { setTeamMembers } = useTeamMembersContext();

const handleTeamNameClick = async (members: DocumentReference[], teamId: string) => {
  try {
    setLoading(true);
    console.log('Clicked Team ID:', teamId);
    
    if (!isNarrowed1) {
      toggleIsNarrowed1();
    }
   
    // Set a flag to track whether the loading state persists after 10 seconds
    let timeoutFlag = false;
    
    // Start a timer to check loading state after 10 seconds
    const timeout = setTimeout(() => {
      // If loading state persists after 10 seconds, set the flag to true
      timeoutFlag = true;
    }, 10000);

    const teamMembersData: MemberData[] = [];
    let teamDateCreated: Date | undefined = new Date(Date.now());

    // Fetch members data for the clicked team
    for (const memberRef of members) {
      const userId = memberRef.id; 
     

      const userDoc = await getDoc(doc(db, 'users', userId));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const memberName = userData?.name || '';
        const memberCallSign = userData?.callSign || '';
        const memberStatus = userData?.status || '';
        const memberUserType = userData?.user_type || '';
        const memberLongitude = userData?.longitude || 0;
        const memberLatitude = userData?.latitude || 0;
        const memberPassword = userData?.password || '';

        let memberDateCreated: string | Date = new Date(Date.now());

        if ('dateCreated' in userData && userData.dateCreated !== undefined) {
          const timestamp = userData.dateCreated.seconds * 1000;
          memberDateCreated = new Date(timestamp);
        } else {
          memberDateCreated = userData?.dateCreated || '';
        }

        const memberUserId = userId;

        teamMembersData.push({
          name: memberName,
          dateCreated: memberDateCreated,
          userId: memberUserId,
          callSign: memberCallSign,
          status: memberStatus,
          user_type: memberUserType,
          longitude: memberLongitude,
          latitude: memberLatitude,
          password: memberPassword,
        });
      }
    }

    // Clear the timeout since the data fetching is successful
    clearTimeout(timeout);
  
    setTeamMembers(teamMembersData);
    sessionStorage.setItem('selectedMembers', JSON.stringify(teamMembersData));
    sessionStorage.setItem('teamDateCreated', JSON.stringify(teamDateCreated));

    setLoading(false);
    setTeamId(teamId);

    if (timeoutFlag) {
      setShowInternetConnectionForm(true);
    }
  } catch (error) {
    console.error('Error fetching user document:', error);
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
  try {
    const newTeamData = {
      name: newTeamName,
      date_established: {
        seconds: Date.now() / 1000,
        nanoseconds: 0,
      },
      status: userEnteredStatus as 'active' | 'suspended',
      members: [],
      organization: enteredOrganization, // Assuming enteredOrganization is defined elsewhere
      color: userEnteredColor || 'brown',
      description: userEnteredDescription || '',
      // Add other fields as needed
    };

    const docRef = await addDoc(collection(db, 'Teams'), newTeamData);

    // Update the document with the ID field
    await updateDoc(docRef, { id: docRef.id });

    console.log('New team added with ID:', docRef.id);
    closeModal(); // Close the modal after successful submission
  } catch (error) {
    console.error('Error adding new team:', error);
  }
};

// const handleEditButtonClick = async (teamId: string) => {
//   // Implement your logic for handling edit action
//   console.log('Edit button clicked for team ID:', teamId);
// };

const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

const handleDeleteButtonClick = async (teamId: string) => {
  // Set the selected team ID and team data for confirmation message
  setSelectedTeamId(teamId);

  // Find the team data for the selected team ID
  const selectedTeam = activeTeams.find(team => team.id === teamId) || suspendedTeams.find(team => team.id === teamId);

  // Set ConfirmDeleteformData with the selected team's name
  setConfirmDeleteFormData({
    name: selectedTeam?.name || '',
    teamId: teamId,
  });

  // Open the confirmation form
  setShowConfirmDeleteForm(true);
};


const handleConfirmDelete = async () => {
  try {
    setLoading(true);
    // Delete the team document from Firestore using the selected team ID
    await deleteDoc(doc(db, 'Teams', selectedTeamId || ''));
    
    // Update UI by filtering out the deleted team
    const updatedActiveTeams = activeTeams.filter(team => team.id !== selectedTeamId);
    const updatedSuspendedTeams = suspendedTeams.filter(team => team.id !== selectedTeamId);
    
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
  console.log('Form submitted with updated values:', updatedValues);
  try {
    setLoading(true);
    // Update the team document in Firestore
    const teamRef = doc(db, 'Teams', editedTeam?.id || '');
    await updateDoc(teamRef, updatedValues);
    console.log('Team updated successfully:', editedTeam?.id);
    // Close the modal
    closeEditModal();
    setLoading(false);
    // Update the UI by fetching the latest data if needed
    // fetchData();
  } catch (error) {
    console.error('Error updating team:', error);
  }
};


  return (
    <div className='font-latto overflow-hidden'>
      <div className='overflow-y-auto'style={{ maxHeight: 'calc(700px - 1rem)', width: '120%' }}>
      
      {showInternetConnectionForm && <div className="fixed inset-0 z-50 bg-gray-900 text-black bg-opacity-50 flex justify-center items-center text-sm">
    <div className='bg-gray-200 text-black w-96 text-center rounded-lg shadow-md p-6  text-sm'>
      <h2 className="text-lg font-semibold mb-2">You internet connection</h2>
      <button onClick={() => setShowInternetConnectionForm(false)} className='w-20 bg-white text-black font-bold rounded-md h-10 mt-6 mr-10 hover:bg-gray-300'>Close</button>
    </div>
  </div>}
      <div className='-ml-8 '>
      {isModalOpen && <div className='fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex justify-center items-center '><AddTeamModal isOpen={isModalOpen}  onClose={closeModal} onSubmit={handleSubmitForm} /></div>}
      
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
          style={{ backgroundColor: teamNames.includes(team.name) ? '#f3f4f6' : 'inherit' }}
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
          style={{ backgroundColor: teamNames.includes(team.name) ? '#f3f4f6' : 'inherit' }}
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

     
      {/* <AddandEditButton onAddClick={handleAddButtonClick}  /> */}
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