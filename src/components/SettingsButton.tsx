import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faBell } from '@fortawesome/free-solid-svg-icons';

const SettingsButton: React.FC = () => {
  return (
    <div className="text-2xl space-x-6 ml-44">
      <FontAwesomeIcon icon={faCog} className="text-gray-500  "  />
      <FontAwesomeIcon icon={faBell} className="text-gray-500  "  />
    </div>
  );
};

export default SettingsButton;
