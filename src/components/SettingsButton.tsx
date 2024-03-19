import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faBell } from '@fortawesome/free-solid-svg-icons';

const YourComponent: React.FC = () => {
  return (
    <div className="flex ml-44 text-2xl">
      <FontAwesomeIcon icon={faCog} className="text-settingsAndbell-bg fixed top-2 -ml-10" size="sm" />
      <FontAwesomeIcon icon={faBell} className="text-settingsAndbell-bg ml-0 fixed top-2" size="sm" />
    </div>
  );
};

export default YourComponent;
