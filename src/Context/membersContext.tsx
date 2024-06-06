import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the member data including the teamId and teamColor
export interface MemberData {
    userId: string;
    name: string;
    dateCreated: string | Date;
    callSign: string;
    status: string;
    user_type: string;
    longitude: number;
    latitude: number;
    password: string;
    teamId: string; // Add teamId to the MemberData interface
    teamColor: string; // Add teamColor to the MemberData interface
}

interface MembersContextValue {
    members: MemberData[];
    setMembers: React.Dispatch<React.SetStateAction<MemberData[]>>;
}

// Provide a default value
const MembersContext = createContext<MembersContextValue | undefined>(undefined);

interface MembersProviderProps {
    children: ReactNode;
}

export const MembersProvider: React.FC<MembersProviderProps> = ({ children }) => {
    const [members, setMembers] = useState<MemberData[]>([]);

    return (
        <MembersContext.Provider value={{ members, setMembers }}>
            {children}
        </MembersContext.Provider>
    );
};

export const useMembersContext = (): MembersContextValue => {
    const context = useContext(MembersContext);
    if (!context) {
        throw new Error('useMembersContext must be used within a MembersProvider');
    }
    return context;
};
