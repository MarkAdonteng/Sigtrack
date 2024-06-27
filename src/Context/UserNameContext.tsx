import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserNames, UserNameData } from '../repo/userRepo/getUserName';

interface UserNameContextType {
  userNames: UserNameData[];
  getUserName: (userId: string) => string;
}

const UserNameContext = createContext<UserNameContextType | undefined>(undefined);

export const UserNameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userNames, setUserNames] = useState<UserNameData[]>([]);

  useEffect(() => {
    const fetchUserNames = async () => {
      try {
        const fetchedUserNames = await getUserNames();
        setUserNames(fetchedUserNames);
      } catch (error) {
        console.error('Error fetching user names:', error);
      }
    };

    fetchUserNames();
  }, []);

  const getUserName = (userId: string): string => {
    const userNameObject = userNames.find(user => user.userId === userId);
    return userNameObject ? userNameObject.name : 'Unknown';
  };

  return (
    <UserNameContext.Provider value={{ userNames, getUserName }}>
      {children}
    </UserNameContext.Provider>
  );
};

export const useUserNames = () => {
  const context = useContext(UserNameContext);
  if (!context) {
    throw new Error('useUserNames must be used within a UserNameProvider');
  }
  return context;
};
