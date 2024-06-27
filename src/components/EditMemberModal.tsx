import React, { useState, useEffect } from 'react';
import ModalForm from './ModalForm';
import { MemberFeatures } from './TeamData';
import { useLoading } from '../Context/LoadingContext';
import { MemberData } from './TeamList';

const EditMemberModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (updatedTeam: Partial<MemberData>) => void;
  member: MemberData | null;
}> = ({ isOpen, onClose, onSubmit, member }) => {
  const [editedCallSign, setEditedCallSign] = useState('');
  const [editedStatus, setEditedStatus] = useState('');
  const { isLoading, setLoading } = useLoading();

  useEffect(() => {
    if (member) {
      setEditedCallSign(member.callSign);
      setEditedStatus(member.status);
    }
  }, [member]);

  const handleSubmit = () => {
    setLoading(true);
    const capitalizedEditedName =
      editedCallSign.charAt(0).toUpperCase() + editedCallSign.slice(1)
      ;

    const updatedValues: Partial<MemberFeatures> = {
      name: capitalizedEditedName,
      callSign: editedCallSign,
      status: editedStatus as 'active' | 'suspended' | undefined,
  
    };

    onSubmit(updatedValues);
    onClose();
    setLoading(false);
  };

  return (
    <div>
      <ModalForm isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} title="Edit Member Details">
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

      </ModalForm>
    </div>
  );
};

export default EditMemberModal;
