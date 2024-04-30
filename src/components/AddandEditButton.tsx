import React from 'react';

interface AddandEditButtonProps {
    onAddClick: () => void;
 
  }

const AddandEditButton: React.FC<AddandEditButtonProps> = ({ onAddClick }) => {
    return (
        <div className="flex space-x-4 absolute top-96 mt-[241px] ml-10 ">
        
            
            <button className="bg-white text-black px-4 py-2 rounded text-sm"
            onClick={onAddClick}>
                Add Team
            </button>
            
            
        </div>
    );
}

export default AddandEditButton;
