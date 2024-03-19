import React, { createContext, useContext, ReactNode, useState } from 'react';

interface TeamIdContextProps {
  teamId: string | null;
  setTeamId: React.Dispatch<React.SetStateAction<string | null>>; // Updated line
}

const TeamIdContext = createContext<TeamIdContextProps | undefined>(undefined);

export const TeamIdProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [teamId, setTeamId] = useState<string | null>(null);

  return (
    <TeamIdContext.Provider value={{ teamId, setTeamId }}>
      {children}
    </TeamIdContext.Provider>
  );
};

export const useTeamId = () => {
  const context = useContext(TeamIdContext);
  if (!context) {
    throw new Error('useTeamId must be used within a TeamIdProvider');
  }
  return context;
};
