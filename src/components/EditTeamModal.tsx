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
    const updatedValues: Partial<Team> = {
      name: editedName,
      description: editedDescription,
      color: editedColor,
      status: editedStatus as "active" | "suspended" | undefined,
    };

    onSubmit(updatedValues);
  };

  return (
    // Your modal UI
    <div className='fixed inset-0 bg-gray-900 text-black bg-opacity-50 flex justify-center items-center text-sm'>
    <div className={`modal ${isOpen ? 'open' : 'closed'}`}>
      <div className=" bg-gray-200 text-black w-76 rounded-lg shadow-md p-6 text-sm">
        <h2 className='text-center'>Edit Team</h2>

        {/* Editable fields */}
        <label>
          Team Name:
          <input
            type="text"
            value={editedName}
            className='input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150 '
            onChange={(e) => setEditedName(e.target.value)}
          />
        </label><br></br>

        <label>
          Color:
          <input type="color" 
          value={editedColor} 
          className='input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150'
          onChange={(e) => setEditedColor(e.target.value)} />
        </label><br></br>

        <label>
          Status:
          <select value={editedStatus} 
          className='input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150'
          onChange={(e) => setEditedStatus(e.target.value)}>
             <option value="select">Select</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </label><br></br>

        <label className='flex'>
           Description:
        
          <textarea
            value={editedDescription}
            className='input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150 '
            onChange={(e) => setEditedDescription(e.target.value)}
          />
        </label>
          
            <div className='text-center'>
          <button className="button is-success w-20  bg-black text-white  font-bold rounded-sm  mt-6 mr-10" onClick={handleSubmit}>
            Update
          </button>
          <button className="button button is-success w-20  bg-black text-white font-bold rounded-sm mt-6"
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
