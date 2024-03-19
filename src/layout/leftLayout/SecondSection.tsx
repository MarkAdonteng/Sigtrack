// SecondSection.tsx
import React, { useState, ReactNode, useEffect } from 'react';
import { useNarrowContext } from '../../Context/NarrowedContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';

interface SecondSectionProps {
  children: ReactNode;
}

const SecondSection: React.FC<SecondSectionProps> = ({ children }) => {
  const { isNarrowed1, toggleIsNarrowed1 } = useNarrowContext();
  const [rotation, setRotation] = useState(0);
  const [isNarrowed, setIsNarrowed] = useState(true);

  useEffect(() => {
    const newRotation = isNarrowed1 ? 180 : 0;
    setRotation(newRotation);
  }, [isNarrowed1]);

  const handleButtonClick = () => {
    toggleIsNarrowed1();
    setIsNarrowed(!isNarrowed);
  };

  // const wrapperStyles = {
  //   width: isNarrowed1 ? '1rem' : '300px',
  //   height: isNarrowed1 ? '2rem' : '100%',
  //   bottom: isNarrowed1 ? 'auto' : '0', // Adjust bottom position when not narrowed
  //   transition: 'width 0.1s ease-in-out, height 0.1s ease-in-out, top 0.1s ease-in-out, bottom 0.1s ease-in-out', // Add top and bottom transition
  // };


  return (
    <div
      className={`second-section  ${isNarrowed ? 'w-18' : 'w-[15px]'}  ${isNarrowed ? 'h-[845px]' : 'h-[45px]'}  z-20 ml-16 mt-[-0.5rem] absolute flex justify-center  items-center w-80 mr-auto bg-primary-bg text-primary-text transition-all duration-100 ease-in-out `}
    >
      <div className="content-wrapper">
        <button
          className={`arrow-button1 ml-48 text-2xl mt-3 text-secondary-text transform transition-transform duration-100 ease-in-out absolute border-none
            shadow-none bg-transparent right-0.5  top-${isNarrowed1 ? '0' : '0'} ${rotation === 180 ? 'rotate-180' : ''} transition-transform duration-500 ease-in-out`}
          onClick={handleButtonClick}
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
      </div>

      {isNarrowed1 ? (
        <div className="ml-36 space-y-4">
          {/* Content when narrowed */}
        </div>
      ) : (
        <div style={{ position: 'absolute' }}>
          {children}
        </div>
      )}
    </div>
  );
};

export default SecondSection;
