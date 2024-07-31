import React, { useState, useEffect } from 'react';
import { Team } from '../constants/types';
import ModalForm from './ModalForm';

const EditTeamModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (updatedTeam: Partial<Team>) => void;
  team: Team | null;
  closeEditModal: () => void;
}> = ({ isOpen, onClose, onSubmit, team, closeEditModal }) => {
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedColor, setEditedColor] = useState('');
  const [editedStatus, setEditedStatus] = useState('');

  useEffect(() => {
    if (team) {
      setEditedName(team.name || '');
      setEditedDescription(team.description || '');
      setEditedColor(team.color || '');
      setEditedStatus(team.status || '');
    }
  }, [team]);

  const handleSubmit = () => {
    const capitalizedEditedName = editedName.charAt(0).toUpperCase() + editedName.slice(1);

    const updatedValues: Partial<Team> = {
      name: capitalizedEditedName,
      description: editedDescription,
      color: editedColor,
      status: editedStatus as 'active' | 'suspended' | undefined,
    };

    onSubmit(updatedValues);
  };

  return (
    <div>
      <ModalForm
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleSubmit}
        title="Edit Team Details"
      >
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
          <label className="label">Status:</label>
          <select
            value={editedStatus}
            className="input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 transition ease-in-out duration-150"
            onChange={(e) => setEditedStatus(e.target.value)}
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
      </ModalForm>
    </div>
  );
};

export default EditTeamModal;
