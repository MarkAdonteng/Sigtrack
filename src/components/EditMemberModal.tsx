import React, { useState, useEffect } from 'react';
import ModalForm from './ModalForm';
import { MemberFeatures } from './TeamData';
import { useLoading } from '../Context/LoadingContext';

const EditMemberModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (updatedTeam: Partial<MemberFeatures>) => void;
  member: MemberFeatures | null;
}> = ({ isOpen, onClose, onSubmit, member }) => {
  const [editedName, setEditedName] = useState('');
  const [editedCallSign, setEditedCallSign] = useState('');
  const [editedLatitude, setEditedLatitude] = useState(0);
  const [editedLongitude, setEditedLongitude] = useState(0);
  const [editedStatus, setEditedStatus] = useState('');
  const [editedUser_Type, setEditedUser_Type] = useState('');
  const [editedPassword, setEditedPassword] = useState('');
  const { isLoading, setLoading } = useLoading();

  useEffect(() => {
    if (member) {
      setEditedName(member.name);
      setEditedCallSign(member.callSign);
      setEditedLatitude(member.latitude);
      setEditedLongitude(member.longitude);
      setEditedStatus(member.status);
      setEditedUser_Type(member.user_type);
      setEditedPassword(member.password);
    }
  }, [member]);

  const handleSubmit = () => {
    setLoading(true);
    const capitalizedEditedName =
      editedName.charAt(0).toUpperCase() + editedName.slice(1);

    const updatedValues: Partial<MemberFeatures> = {
      name: capitalizedEditedName,
      callSign: editedCallSign,
      latitude: editedLatitude,
      longitude: editedLongitude,
      status: editedStatus as 'active' | 'suspended' | undefined,
      user_type: editedUser_Type as 'admin' | 'user' | undefined,
      password: editedPassword,
    };

    onSubmit(updatedValues);
    onClose();
    setLoading(false);
  };

  return (
    <div>
      <ModalForm isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} title="Edit Member Details">
        <div className="field flex flex-col space-y-1 mb-4">
          <label className="label">Name:</label>
          <input
            className="input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 transition ease-in-out duration-150"
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
          />
        </div>

        <div className="field flex flex-col space-y-1 mb-4">
          <label className="label">Call Sign:</label>
          <input
            className="input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 transition ease-in-out duration-150"
            type="text"
            value={editedCallSign}
            onChange={(e) => setEditedCallSign(e.target.value)}
          />
        </div>

        <div className="field flex flex-col space-y-1 mb-4">
          <label className="label">Longitude:</label>
          <input
            className="input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 transition ease-in-out duration-150"
            type="text"
            value={editedLongitude}
            onChange={(e) => setEditedLongitude(parseFloat(e.target.value.replace(',', '.')))}
          />
        </div>

        <div className="field flex flex-col space-y-1 mb-4">
          <label className="label">Latitude:</label>
          <input
            className="input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 transition ease-in-out duration-150"
            type="text"
            value={editedLatitude}
            onChange={(e) => setEditedLatitude(parseFloat(e.target.value.replace(',', '.')))}
          />
        </div>

        <div className="field flex flex-col space-y-1 mb-4">
          <label className='label'>Status:</label>
          <select
            value={editedStatus}
            className='input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200  transition ease-in-out duration-150'
            onChange={(e) => setEditedStatus(e.target.value)}
          >
            <option value="Select Status">Select Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        <div className="field flex flex-col space-y-1 mb-4">
          <label className='label'> User Type:</label>
          <select
            value={editedUser_Type}
            className='input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200  transition ease-in-out duration-150'
            onChange={(e) => setEditedUser_Type(e.target.value)}
          >
            <option value="select">Select</option>
            <option value="admin">admin</option>
            <option value="user">user</option>
          </select>
        </div>

        <div className="field flex flex-col space-y-1 mb-4">
          <label className="label">Password:</label>
          <input
            className="input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 transition ease-in-out duration-150"
            type="text"
            value={editedPassword}
            onChange={(e) => setEditedPassword(e.target.value)}
          />
        </div>
      </ModalForm>
    </div>
  );
};

export default EditMemberModal;
