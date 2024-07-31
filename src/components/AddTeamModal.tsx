import React, { useState } from 'react';
import ModalForm from './ModalForm';
import { AddTeamModalProps } from '../constants/types';

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

  const handleTeamNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const capitalizedTeamName = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
    setNewTeamName(capitalizedTeamName);
  };

  return (
    <div>
      <ModalForm
       isOpen={isOpen}
       onClose={onClose}
       onSubmit={handleSubmit}
       title="Enter Team Details">

<div className="field flex flex-col space-y-1 mb-4">
            <label className="label">Team Name:</label>
            <input
              className="input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 transition ease-in-out duration-150"
              type="text"
              value={newTeamName}
              onChange={handleTeamNameChange}
            />
          </div>

          <div className="field flex flex-col space-y-1 mb-4">
            <label className='label'>Status:</label>
            <select 
              value={userEnteredStatus} 
              className='input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200  transition ease-in-out duration-150'
              onChange={(e) => setUserEnteredStatus(e.target.value)}
            >
              <option value="Select Status">Select Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div className="field space-y-1 mb-4">
            <label className="label">Color:</label>
            <input
              className="input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200  transition ease-in-out duration-150"
              type="color"
              value={userEnteredColor}
              onChange={(e) => setUserEnteredColor(e.target.value)}
            />
          </div>

          <div className="field flex flex-col space-y-1 mb-4">
            <label className="label">Description:</label>
            <textarea
              className="input bg-gray-100 text-gray-800 border-0  rounded-md p-2 mb-4 focus:bg-gray-200 transition ease-in-out duration-150" 
              value={userEnteredDescription}
              onChange={(e) => setUserEnteredDescription(e.target.value)}
            />
          </div>
      </ModalForm>

    </div>
  );
};

export default AddTeamModal;
