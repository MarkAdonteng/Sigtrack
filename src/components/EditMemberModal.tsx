import React, { useState } from 'react';
import { MemberData} from '../Context/TeamMembersContext'; 



const EditMemberModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (updatedTeam: Partial<MemberData>) => void;
  member: MemberData | null;
  closeEditModal: () => void; // Add this prop declaration
}> = ({ isOpen, onClose, onSubmit, member, closeEditModal }) => {
  const [editedName, setEditedName] = useState(member?.name || '');
  const [editedCallSign, setEditedCallSign] = useState(member?.callSign || '');
  const [editedLatitude, setEditedLatitude] = useState(member?.latitude || 0);
  const [editedLongitude, setEditedLongitude] = useState(member?.longitude || 0);
  const [editedStatus, setEditedStatus] = useState(member?.status || '');
  const [editedUser_Type, setEditedUser_Type] = useState(member?.user_type || '');
  const [editedPassword, setEditedPassword] = useState(member?.password || '');

  const handleSubmit = () => {
    const updatedValues: Partial<MemberData> = {
      name: editedName,
      callSign: editedCallSign,
      latitude: editedLatitude,
      longitude:editedLongitude,
      status: editedStatus as "active" | "suspended" | undefined,
      user_type: editedUser_Type as "admin" | "user" | undefined,
      password:editedPassword,
    };

    onSubmit(updatedValues);
  };

  return (
    // Your modal UI

    <div className='fixed inset-0 bg-gray-900 text-black bg-opacity-50 flex justify-center items-center text-sm font-lato'>
    <div className={`modal ${isOpen ? 'open' : 'closed'}`}>
      <div className="modal-content bg-gray-200 text-black w-96 rounded-lg shadow-md p-6 text-sm">
        <h2 className='text-center'>Edit Member Details</h2>

   

        <div className="field flex flex-col">
  <label className="label">Name:</label>
  <input
    className="input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 transition ease-in-out duration-150"
    type="text"
    value={editedName}
    onChange={(e) => setEditedName(e.target.value)}
  />
</div>



        <div className="field flex flex-col">
  <label className="label">Team Name:</label>
  <input
    className="input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 transition ease-in-out duration-150"
    type="text"
    value={editedCallSign} 
    onChange={(e) => setEditedCallSign(e.target.value)} />
  
</div>

          <div className="field flex flex-col">
  <label className="label">Team Name:</label>
  <input
    className="input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 transition ease-in-out duration-150"
    type="text"
    value={editedLongitude}
    onChange={(e) => setEditedLongitude(parseFloat(e.target.value))}
  />
</div>

          <div className="field flex flex-col">
  <label className="label">Team Name:</label>
  <input
    className="input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 transition ease-in-out duration-150"
    type="text"
    value={editedLatitude}
    onChange={(e) => setEditedLatitude(parseFloat(e.target.value))}
  />
</div>

        <div className="field flex flex-col">
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

        <div className="field flex flex-col">
            <label className='label'> User Type:</label>
            <select value={editedUser_Type} 
              className='input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200  transition ease-in-out duration-150'
              onChange={(e) => setEditedUser_Type(e.target.value)}>
              <option value="select">Select</option>
            <option value="admin">admin</option>
            <option value="user">user</option>
          </select>
          </div>

        <div className="field flex flex-col">
  <label className="label">Password:</label>
  <input
    className="input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 transition ease-in-out duration-150"
    type="text"
    value={editedPassword}
    onChange={(e) => setEditedPassword(e.target.value)}
  />
</div>

            <div className='text-center'>
          <button className="button is-success bg-white text-black  font-bold w-20 h-10 rounded-md mt-6 mr-10 hover:bg-gray-300" onClick={handleSubmit}>
            Update
          </button>
          <button className="button button is-success  bg-white text-black font-bold w-20 h-10 rounded-md mt-6 hover:bg-gray-300"  
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

export default EditMemberModal;
