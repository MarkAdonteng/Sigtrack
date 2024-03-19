
import React from 'react';
import Searchbar from '../../components/Searchbar';
import AddandEditButton from '../../components/AddandEditButton';
import SettingsButton from '../../components/SettingsButton';
import TeamList from '../../components/TeamList';


const RightLayoutContent = () => {
  return (
    <div className=' font-semibold text-primary-text mb-4'>
      <SettingsButton/>
       
      <Searchbar />

     {/* <TeamListDisplay
     teamSectionTitles={{ team: 'Team', suspendedTeam: 'Suspended Team' }}/> */}
     <TeamList/>
  
     

     {/* <AddandEditButton/> */}
      
    
      </div>
  
  );
};

export default RightLayoutContent;


