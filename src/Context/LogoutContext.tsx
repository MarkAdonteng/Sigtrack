import React, { createContext, ReactNode, useContext } from 'react';

interface LogoutContextProps {
  handleLogout: () => void;
  children: ReactNode; // Include children prop in the type
}

const LogoutContext = createContext<LogoutContextProps | undefined>(undefined);

export const LogoutProvider: React.FC<LogoutContextProps> = ({ children, handleLogout }) => {
  return <LogoutContext.Provider value={{ handleLogout, children }}>{children}</LogoutContext.Provider>;
};

export const useLogoutContext = () => {
  const context = useContext(LogoutContext);
  if (!context) {
    throw new Error('useLogoutContext must be used within a LogoutProvider');
  }
  return context;
};
