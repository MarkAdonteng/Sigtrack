import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../services/firebase'; // Assuming you have initialized Firebase

export interface MemberData {
  name: string;
  dateCreated: string | Date;
  userId: string;
  callSign: string;
  status: string;
  user_type: string;
  latitude: number;
  longitude: number;
  password: string;
}

interface TeamMembersContextProps {
  teamMembers: MemberData[];
  setTeamMembers: React.Dispatch<React.SetStateAction<MemberData[]>>;
  selectedTeamId: string | null;
  setSelectedTeamId: React.Dispatch<React.SetStateAction<string | null>>;
}

const TeamMembersContext = createContext<TeamMembersContextProps | undefined>(undefined);

export const TeamMembersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [teamMembers, setTeamMembers] = useState<MemberData[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'TeamMembers'), (snapshot) => {
      const updatedTeamMembers: MemberData[] = [];
      snapshot.forEach((doc) => {
        updatedTeamMembers.push(doc.data() as MemberData);
      });
      setTeamMembers(updatedTeamMembers);
    });

    return () => unsubscribe();
  }, []); // Dependency array is empty to run effect only once when component mounts

  return (
    <TeamMembersContext.Provider value={{ teamMembers, setTeamMembers, selectedTeamId, setSelectedTeamId }}>
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
