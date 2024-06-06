import React, { createContext, useContext, useState } from 'react';

interface MarkerContextType {
  selectedMarker: string | null;
  setSelectedMarker: React.Dispatch<React.SetStateAction<string | null>>;
}

const MarkerContext = createContext<MarkerContextType | undefined>(undefined);

export const useMarkerContext = () => {
  const context = useContext(MarkerContext);
  if (!context) {
    throw new Error('useMarkerContext must be used within a MarkerContextProvider');
  }
  return context;
};

export const MarkerContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedMarker, setSelectedMarker] = useState<string | null>(null);

  return (
    <MarkerContext.Provider value={{ selectedMarker, setSelectedMarker }}>
      {children}
    </MarkerContext.Provider>
  );
};
