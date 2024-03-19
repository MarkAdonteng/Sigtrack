// RightLayoutContext.tsx
import React, { createContext, useContext, ReactNode, useState } from 'react';

interface RightLayoutContextProps {
  isNarrowed: boolean;
  toggleNarrowed: () => void;
}

const RightLayoutContext = createContext<RightLayoutContextProps | undefined>(undefined);

export const RightLayoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isNarrowed, setIsNarrowed] = useState(false);

  const toggleNarrowed = () => {
    setIsNarrowed(!isNarrowed);
  };

  return (
    <RightLayoutContext.Provider value={{ isNarrowed, toggleNarrowed }}>
      {children}
    </RightLayoutContext.Provider>
  );
};

export const useRightLayout = () => {
  const context = useContext(RightLayoutContext);
  if (!context) {
    throw new Error('useRightLayout must be used within a RightLayoutProvider');
  }
  return context;
};