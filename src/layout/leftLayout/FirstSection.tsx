import React, { ReactNode } from 'react';

interface FirstSectionProps {
  children: ReactNode;
}

const FirstSection: React.FC<FirstSectionProps> = ({ children }) => {
  return (
    <div className=" bg-gray-600 w-16 h-screen top-0 bottom-0 z-10 -ml-0 absolute">
     
      
      
        {children}
      
      
    </div>
  )
}

export default FirstSection
