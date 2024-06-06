// In CustomMarkerContext.tsx
import React, { createContext, useContext, ReactNode, useState } from 'react';

interface CustomMarkerContextType {
  displayCustomMarker: boolean;
  selectedImages: string[]; // Add selectedImages array
  setDisplayCustomMarker: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedImages: React.Dispatch<React.SetStateAction<string[]>>; // Add setSelectedImages function
}

const CustomMarkerContext = createContext<CustomMarkerContextType | undefined>(undefined);

export const useCustomMarkerContext = () => {
  const context = useContext(CustomMarkerContext);
  if (!context) {
    throw new Error('useCustomMarkerContext must be used within a CustomMarkerProvider');
  }
  return context;
};

interface CustomMarkerProviderProps {
  children: ReactNode;
}

export const CustomMarkerProvider: React.FC<CustomMarkerProviderProps> = ({ children }) => {
  const [displayCustomMarker, setDisplayCustomMarker] = useState<boolean>(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]); // Initialize selectedImages array

  const contextValue: CustomMarkerContextType = {
    displayCustomMarker,
    selectedImages,
    setDisplayCustomMarker,
    setSelectedImages,
  };

  return (
    <CustomMarkerContext.Provider value={contextValue}>
      {children}
    </CustomMarkerContext.Provider>
  );
};
