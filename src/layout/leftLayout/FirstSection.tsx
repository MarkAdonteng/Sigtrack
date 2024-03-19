import React, { ReactNode } from 'react';

interface FirstSectionProps {
  children: ReactNode;
}

const FirstSection: React.FC<FirstSectionProps> = ({ children }) => {
  return (
    <div className=" bg-secondary-bg w-16 h-screen top-0 bottom-0 z-30 -ml-0 absolute">
     
      
      
        {children}
      
      
    </div>
  )
}

export default FirstSection
