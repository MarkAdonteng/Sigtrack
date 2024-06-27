import React, { createContext, useContext, useState } from 'react';

interface MarkerContextType {
  selectedMarker: string | null;
  setSelectedMarker: React.Dispatch<React.SetStateAction<string | null>>;
  clickedMarkerPath: string | null; // New property to store clicked marker path
  setClickedMarkerPath: React.Dispatch<React.SetStateAction<string | null>>; // Setter for clicked marker path
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
  const [clickedMarkerPath, setClickedMarkerPath] = useState<string | null>(null); // State to store clicked marker path

  return (
    <MarkerContext.Provider value={{ 
      selectedMarker, 
      setSelectedMarker,
      clickedMarkerPath, // Provide clicked marker path in the context value
      setClickedMarkerPath, // Provide setter for clicked marker path in the context value
    }}>
      {children}
    </MarkerContext.Provider>
  );
};
