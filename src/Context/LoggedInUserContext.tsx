// UserContext.tsx
import { createContext, useContext, ReactNode, Dispatch, SetStateAction, useState } from 'react';

interface UserContextProps {
  userId?: string;
  setUserId: Dispatch<SetStateAction<string | undefined>>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

interface UserContextProviderProps {
  children: ReactNode;
}

export const useUserContext = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }
  return context;
};

const UserContextProvider: React.FC<UserContextProviderProps> = ({ children }) => {
  const [userId, setUserId] = useState<string | undefined>(undefined);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContextProvider };
