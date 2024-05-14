import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TeamsContextType {
  teamNames: string[];
  setTeamNames: React.Dispatch<React.SetStateAction<string[]>>;
}

const TeamsContext = createContext<TeamsContextType | undefined>(undefined);

export const useTeamsContext = () => {
  const context = useContext(TeamsContext);
  if (!context) {
    throw new Error('useTeamsContext must be used within a TeamsProvider');
  }
  return context;
};

interface TeamsProviderProps {
  children: ReactNode;
}

export const TeamContextProvider: React.FC<TeamsProviderProps> = ({ children }) => {
  const [teamNames, setTeamNames] = useState<string[]>([]);

  return (
    <TeamsContext.Provider value={{ teamNames, setTeamNames }}>
      {children}
    </TeamsContext.Provider>
  );
};
