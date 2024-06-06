import React, { useState } from 'react';

interface ModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: { name: string; latitude: string; longitude: string; description: string }) => void;
  title: string;
  formData: {
    name: string;
    latitude: string;
    longitude: string;
    description: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    latitude: string;
    longitude: string;
    description: string;
  }>>;
}

const CustomMarkerModal: React.FC<ModalFormProps> = ({ isOpen, onClose, onSubmit, title, formData, setFormData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex justify-center items-center ${
        isOpen ? 'flex' : 'hidden'
      }`}
      onClick={onClose}
    >
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content bg-gray-200 text-black w-96 rounded-lg shadow-md p-6 text-sm">
          <h2 className="text-center">{title}</h2>
          <div className="mt-4">
            <label className="block">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mt-4">
            <label className="block">Latitude</label>
            <input
              type="text"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mt-4">
            <label className="block">Longitude</label>
            <input
              type="text"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mt-4">
            <label className="block">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            ></textarea>
          </div>
          <div className="text-center">
            <button
              className="button is-success bg-white text-black font-bold w-20 h-10 rounded-md mt-6 mr-10 hover:bg-gray-300"
              onClick={handleSubmit}
            >
              Submit
            </button>
            <button
              className="button button is-success bg-white text-black font-bold w-20 h-10 rounded-md mt-6 hover:bg-gray-300"
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

export default CustomMarkerModal;
