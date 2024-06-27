import { Timestamp } from 'firebase/firestore';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MemberData } from '../components/TeamList';


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
