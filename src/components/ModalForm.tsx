import React, { useState } from 'react';

const ModalForm: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, onSubmit, title, children }) => {
  const handleClose = () => {
    onClose(); // Close the modal when clicking outside the modal
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex justify-center items-center ${
        isOpen ? 'flex' : 'hidden'
      }`}
      onClick={handleClose}
    >
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="modal-content bg-gray-200 text-black w-96 rounded-lg shadow-md p-6 text-sm">
          <h2 className="text-center">{title}</h2>
          {children}
          <div className="text-center">
            <button
              className="button is-success bg-white text-black font-bold w-20 h-10 rounded-md mt-6 mr-10 hover:bg-gray-300"
              onClick={onSubmit}
            >
              Submit
            </button>
            <button
              className="button button is-success  bg-white text-black font-bold w-20 h-10 rounded-md mt-6 hover:bg-gray-300"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalForm;
