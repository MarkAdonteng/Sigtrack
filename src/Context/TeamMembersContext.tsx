// src/Context/TeamMembersContext.ts
import React, { createContext, useState, useContext, ReactNode, Dispatch, SetStateAction } from 'react';
import { MemberData } from '../components/TeamList'; // Adjust the import path as per your file structure

interface TeamMembersContextProps {
  teamMembers: MemberData[];
  setTeamMembers: Dispatch<SetStateAction<MemberData[]>>; // Adjust the type here as well
}

const TeamMembersContext = createContext<TeamMembersContextProps | undefined>(undefined);

export const TeamMembersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [teamMembers, setTeamMembers] = useState<MemberData[]>([]);

  return (
    <TeamMembersContext.Provider value={{ teamMembers, setTeamMembers }}>
      {children}
    </TeamMembersContext.Provider>
  );
};

export const useTeamMembersContext = () => {
  const context = useContext(TeamMembersContext);
  if (!context) {
    throw new Error('useTeamMembersContext must be used within a TeamMembersProvider');
  }
  return context;
};
