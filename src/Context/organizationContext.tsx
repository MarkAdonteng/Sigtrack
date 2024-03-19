// OrganizationContext.tsx
import React, { createContext, useContext, ReactNode, useState } from 'react';

interface OrganizationContextProps {
  children: ReactNode;
}

interface OrganizationContextType {
  enteredOrganization: string;
  setEnteredOrganization: React.Dispatch<React.SetStateAction<string>>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const OrganizationProvider: React.FC<OrganizationContextProps> = ({ children }) => {
  const [enteredOrganization, setEnteredOrganization] = useState('');

  return (
    <OrganizationContext.Provider value={{ enteredOrganization, setEnteredOrganization }}>
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganizationContext = (): OrganizationContextType => {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error('useOrganizationContext must be used within an OrganizationProvider');
  }
  return context;
};
