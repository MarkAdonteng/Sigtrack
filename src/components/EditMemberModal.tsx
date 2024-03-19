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

    <div className='fixed inset-0 bg-gray-900 text-black bg-opacity-50 flex justify-center items-center text-sm'>
    <div className={`modal ${isOpen ? 'open' : 'closed'}`}>
      <div className="modal-content bg-gray-200 text-black w-76 rounded-lg shadow-md p-6 text-sm">
        <h2 className='text-center'>Edit Member Details</h2>

        {/* Editable fields */}
        <label>
          Name:
          <input
            type="text"
            value={editedName}
            className='input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150 '
            onChange={(e) => setEditedName(e.target.value)}
          />
        </label><br></br>

        <label>
          Call Sign:
          <input type="text" 
          value={editedCallSign} 
          className='input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150'
          onChange={(e) => setEditedCallSign(e.target.value)} />
        </label><br></br>

        <label>
            Longitude:
            <input
              type="number"
              value={editedLongitude}
              onChange={(e) => setEditedLongitude(parseFloat(e.target.value))}
              className='input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150'
            />
          </label><br></br>


          <label>
            Latitude:
            <input
              type="number"
              value={editedLatitude}
              onChange={(e) => setEditedLatitude(parseFloat(e.target.value))}
              className='input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150'
            />
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

        <label>
          User Type:
          <select value={editedUser_Type} 
          className='input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150'
          onChange={(e) => setEditedUser_Type(e.target.value)}>
              <option value="select">Select</option>
            <option value="admin">admin</option>
            <option value="user">user</option>
          </select>
        </label><br></br>

        <label>
          Password:
          <input type="text" 
          value={editedPassword} 
          className='input bg-gray-100 text-gray-800 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150'
          onChange={(e) => setEditedPassword(e.target.value)} />
        </label><br></br>

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

export default EditMemberModal;
