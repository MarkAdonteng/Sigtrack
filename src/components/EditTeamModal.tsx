import React, { useState } from 'react';
import { Team } from './TeamList'; 



const EditTeamModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (updatedTeam: Partial<Team>) => void;
  team: Team | null;
  closeEditModal: () => void; // Add this prop declaration
}> = ({ isOpen, onClose, onSubmit, team, closeEditModal }) => {
  const [editedName, setEditedName] = useState(team?.name || '');
  const [editedDescription, setEditedDescription] = useState(team?.description || '');
  const [editedColor, setEditedColor] = useState(team?.color || '');
  const [editedStatus, setEditedStatus] = useState(team?.status || '');

  const handleSubmit = () => {
    // Capitalize the first letter of the editedName
    const capitalizedEditedName = editedName.charAt(0).toUpperCase() + editedName.slice(1);
  
    const updatedValues: Partial<Team> = {
      name: capitalizedEditedName,
      description: editedDescription,
      color: editedColor,
      status: editedStatus as "active" | "suspended" | undefined,
    };
  
    onSubmit(updatedValues);
  };
  

  return (

    
    // Your modal UI
    <div className='fixed inset-0 z-50 bg-gray-900 text-black bg-opacity-50 flex justify-center items-center text-sm'>
    <div className={`modal ${isOpen ? 'open' : 'closed'}`}>
      <div className=" bg-gray-200 text-black w-96 rounded-lg shadow-md p-6 text-sm">
        <h2 className='text-center'>Edit Team Details</h2>

     
      
        <div className="field flex flex-col space-y-1 mb-4">
  <label className="label">Team Name:</label>
  <input
    className="input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 transition ease-in-out duration-150"
    type="text"
    value={editedName}
    onChange={(e) => setEditedName(e.target.value)}
  />
</div>


        <div className="field space-y-1 mb-4">
            <label className="label">Color:</label>
            <input
              className="input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200  transition ease-in-out duration-150"
              type="color"
              value={editedColor}
              onChange={(e) => setEditedColor(e.target.value)}
            />
          </div>



        <div className="field flex flex-col space-y-1 mb-4">
            <label className='label'>Status:</label>
            <select value={editedStatus}  
              className='input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200  transition ease-in-out duration-150'
              onChange={(e) =>  setEditedStatus(e.target.value)}
            >
              <option value="Select Status">Select Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>


        <div className="field flex flex-col space-y-1 mb-4">
            <label className="label">Description:</label>
            <textarea
              className="input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 transition ease-in-out duration-150" 
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
            />
          </div>
          
            <div className='text-center'>
          <button className="button is-success bg-white text-black  font-bold  w-20 h-10 rounded-md  mt-6 mr-10 hover:bg-gray-300" onClick={handleSubmit}>
            Update
          </button>
          <button className="button button is-success bg-white text-black font-bold  mt-6  w-20 h-10 rounded-md hover:bg-gray-300"
          onClick={() => {
    onClose(); // Close the modal when the "Cancel" button is clicked
    closeEditModal(); // Optionally, you can also call closeEditModal to reset state in the parent component
  }}>
            Cancel
          </button>
          </div>
      </div>
    </div>
    </div>
  );
};

export default EditTeamModal;
