import React from 'react';
import Searchbar from '../../components/Searchbar';
import SettingsButton from '../../components/SettingsButton';
import TeamList from '../../components/TeamList';

const RightLayoutContent = () => {
  return (
   
      <div className="relative space-y-4">
        
     <SettingsButton/>
        <Searchbar />
       
      
      <TeamList />
    
    </div>
  );
};

export default RightLayoutContent;