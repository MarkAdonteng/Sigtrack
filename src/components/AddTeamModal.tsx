// AddTeamModal.tsx

import React, { useState } from 'react';

interface AddTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: {
    newTeamName: string;
    userEnteredStatus: string;
    userEnteredColor: string;
    userEnteredDescription: string;
  }) => void;
}

const AddTeamModal: React.FC<AddTeamModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [newTeamName, setNewTeamName] = useState('');
  const [userEnteredStatus, setUserEnteredStatus] = useState('');
  const [userEnteredColor, setUserEnteredColor] = useState('');
  const [userEnteredDescription, setUserEnteredDescription] = useState('');

  const handleSubmit = () => {
    onSubmit({
      newTeamName,
      userEnteredStatus,
      userEnteredColor,
      userEnteredDescription,
    });
    onClose();
  };

  return (
    <div className='fixed  bg-gray-200 text-black w-76 rounded-lg shadow-md p-6 text-sm '>
    <div className={`modal ${isOpen ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title text-center" >Enter Team Details</p>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>
        <section className="modal-card-body">
          <div className="field">
            <label className="label">Team Name:</label>
            <input
              className="input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150 "
              type="text"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
            />
          </div>

          <label className='flex'>
          Status:
          <select value={userEnteredStatus} 
          className='input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150'
          onChange={(e) => setUserEnteredStatus(e.target.value)}>
            <option value="Select Status">Select Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </label>

          <div className="field">
            <label className="label">Color:</label>
            <input
              className="input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
              type="color"
              value={userEnteredColor}
              onChange={(e) => setUserEnteredColor(e.target.value)}
            />
          </div>
          <div className="field flex">
            <label className="label top-20 ">Description:</label>
            <textarea
              className="input bg-gray-100 text-gray-800 border-0 ml-3 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" 
              
              value={userEnteredDescription}
              onChange={(e) => setUserEnteredDescription(e.target.value)}
            />
          </div>
        </section>
        <footer className="modal-card-foot text-center">
          <button className="button is-success w-20  bg-black text-white font-bold rounded-sm  mt-6 mr-10" onClick={handleSubmit}>
            Save
          </button>
          <button className="button button is-success w-24  bg-black text-white  font-bold rounded-sm mt-6" onClick={onClose}>
            Cancel
          </button>
        </footer>
      </div>
    </div>
    </div>
  );
};

export default AddTeamModal;




