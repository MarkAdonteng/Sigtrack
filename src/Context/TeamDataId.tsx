// TeamDataIdContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface TeamDataIdContextProps {
    teamDataIds: string[];
    setTeamDataIds: React.Dispatch<React.SetStateAction<string[]>>;
  
}

const TeamDataIdContext = createContext<TeamDataIdContextProps | undefined>(undefined);

export const useTeamDataIdContext = (): TeamDataIdContextProps => {
    const context = useContext(TeamDataIdContext);
    if (!context) {
        throw new Error('useTeamDataIdContext must be used within a TeamDataIdProvider');
    }
    return context;
};

export const TeamDataIdProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [teamDataIds, setTeamDataIds] = useState<string[]>([]);

    return (
        <TeamDataIdContext.Provider value={{ teamDataIds, setTeamDataIds }}>
            {children}
        </TeamDataIdContext.Provider>
    );
};
