import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the context value
interface TeamNameWithId {
    teamName: string;
    teamId: string;
}

interface TeamsContextValue {
    teamNames: TeamNameWithId[];
    setTeamNames: React.Dispatch<React.SetStateAction<TeamNameWithId[]>>;
}

// Create the context with a default value
const TeamsContext = createContext<TeamsContextValue | undefined>(undefined);

// Custom hook for accessing the context
export const useTeamsContext = () => {
    const context = useContext(TeamsContext);
    if (!context) {
        throw new Error('useTeamsContext must be used within a TeamsProvider');
    }
    return context;
};

// Define props for the provider component
interface TeamsProviderProps {
    children: ReactNode;
}

export const TeamsProvider = ({ children }: TeamsProviderProps) => {
    const [teamNames, setTeamNames] = useState<TeamNameWithId[]>([]);

    return (
        <TeamsContext.Provider value={{ teamNames, setTeamNames }}>
            {children}
        </TeamsContext.Provider>
    );
};
