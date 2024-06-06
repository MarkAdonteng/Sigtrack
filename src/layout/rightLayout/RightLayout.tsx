// RightLayout.tsx
import React, { useState, ReactNode } from 'react';
import { createContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import TeamList from '../../components/TeamList';

export const IsRightLayoutNarrowedContext = createContext(false);

interface RightLayoutProps {
  children: ReactNode;
  className?: string;
}

const RightLayout: React.FC<RightLayoutProps> = ({ children }) => {
  const [rotation, setRotation] = useState(0);
  const [isNarrowed, setIsNarrowed] = useState(false);

  const handleButtonClick = () => {
    const newRotation = isNarrowed ? 0 : 180; // Changed logic here
    setRotation(newRotation);
    setIsNarrowed(!isNarrowed);
  };

  return (
    <div
      className={`third-section bg-gray-300 w-${isNarrowed ? '16' : '80'} ml-8 bottom-0 min-h-full z-1 right-0 absolute transition-width flex justify-center items-center max-h-[96vh] text-alternate-text duration-100 ease-in-out ${isNarrowed ? 'w-10' : 'auto'} ${isNarrowed ? 'h-auto' : 'h-full'} flex flex-col`}
      style={{ maxHeight: '96vh' }} // Set max height here
    >
      <div>
        <button
          className={`arrow-button3 ${rotation === 180 ? 'rotate' : ''} text-xl text-gray-500 text-center transform transition-transform duration-100 ease-in-out absolute border-none shadow-none bg-transparent ${isNarrowed ? 'top-4 right-6' : 'top-4 left-3.5'}`}
          onClick={handleButtonClick}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
      </div>

      {isNarrowed && (
        <IsRightLayoutNarrowedContext.Provider value={isNarrowed}>
          <div className="mr-10 top-0">
            <TeamList displayIconsOnly={true} />
          </div>
        </IsRightLayoutNarrowedContext.Provider>
      )}

      {!isNarrowed && (
        <div className='absolute top-0 pt-3 '>
          <IsRightLayoutNarrowedContext.Provider value={isNarrowed}>
            {children}
          </IsRightLayoutNarrowedContext.Provider>
        </div> 
      )} 
    </div>
  );
};

export default RightLayout;
