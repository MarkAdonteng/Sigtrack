// RightLayout.tsx
import React, { useState, ReactNode } from 'react';
import { createContext } from 'react';import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import TeamList from '../../components/TeamList';
import TeamDisplay from '../../components/TeamDisplay';


export const IsRightLayoutNarrowedContext = createContext(false);

interface RightLayoutProps {
  children: ReactNode;
  className?: string;
}

const RightLayout: React.FC<RightLayoutProps> = ({ children }) => {
  const [rotation, setRotation] = useState(0);
  const [isNarrowed, setIsNarrowed] = useState(false);
  

  const handleButtonClick = () => {
    const newRotation = rotation === 0 ? 180 : 0;
    setRotation(newRotation);
    setIsNarrowed(!isNarrowed);
  };



  return (
    <div
    className={`third-section ${
      isNarrowed ? 'bg-secondary-bg' : 'bg-primary-bg'
    } w-${isNarrowed ? '10' : '80'} ml-8 bottom-0 min-h-full z-20 right-0 absolute mt-[-0.5rem]
      transition-width flex justify-center items-center max-h-[96vh] text-primary-text
      transition-width duration-100 ease-in-out overflow-${
        isNarrowed ? 'hidden' : 'visible'
      } ${isNarrowed ? 'w-10' : 'w-[300px]'} ${isNarrowed ? 'h-auto' : 'h-full'}`}
  >
      <div>
        <button
          className={`arrow-button3 ${rotation === 180 ? 'rotate' : ''} text-2xl text-secondary-text text-center
            transform transition-transform duration-100 ease-in-out absolute border-none 
            shadow-none bg-transparent ${isNarrowed ? 'top-0 right-3.5' : 'top-0 left-0.5'}`}
          onClick={handleButtonClick}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
      </div>

      {isNarrowed && (
        <IsRightLayoutNarrowedContext.Provider value={isNarrowed}>
          <div className="ml-8 absolute space-y-96">
          <TeamList
          displayIconsOnly ={true}/>
         
          </div>
     
        </IsRightLayoutNarrowedContext.Provider>
      )}

      {!isNarrowed && (
        <div style={{ position: 'absolute' }}>
          <IsRightLayoutNarrowedContext.Provider value={isNarrowed}>
            {children}
          </IsRightLayoutNarrowedContext.Provider>
        </div>
      )}
    </div>
  );
};

export default RightLayout;
