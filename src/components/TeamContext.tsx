// TeamContext.tsx
import React, { createContext, useContext, ReactNode, useState, Dispatch, SetStateAction } from 'react';
import { TeamItemModel } from './TeamItem';
import { TeamMemberModel } from './TeamMemberItem';

interface TeamContextProps {
  isNarrowed1: boolean;
  toggleIsNarrowed1: () => void;
  selectedTeamItem: TeamItemModel | null;
  setSelectedTeamItem: Dispatch<SetStateAction<TeamItemModel | null>>;
  members: TeamMemberModel[]; // Use the correct type here
  setMembers: Dispatch<SetStateAction<TeamMemberModel[]>>;
}

const TeamContext = createContext<TeamContextProps | undefined>(undefined);

export const TeamProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isNarrowed1, setIsNarrowed1] = useState(false);
  const [selectedTeamItem, setSelectedTeamItem] = useState<TeamItemModel | null>(null);
  const [members, setMembers] = useState<TeamMemberModel[]>([]); // Use the correct type here

  const toggleIsNarrowed1 = () => {
    setIsNarrowed1((prevIsNarrowed) => !prevIsNarrowed);
  };

  return (
    <TeamContext.Provider value={{ isNarrowed1, toggleIsNarrowed1, selectedTeamItem, setSelectedTeamItem, members, setMembers }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeamContext = () => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error('useTeamContext must be used within a TeamProvider');
  }
  return context;
};
