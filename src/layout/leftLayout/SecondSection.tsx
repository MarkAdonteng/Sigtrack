import React, { useState, ReactNode, useEffect } from 'react';
import { useNarrowContext } from '../../Context/NarrowedContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

interface SecondSectionProps {
  children: ReactNode;
}

const SecondSection: React.FC<SecondSectionProps> = ({ children }) => {
  const { isNarrowed1, toggleIsNarrowed1 } = useNarrowContext();
  const [rotation, setRotation] = useState(0);
  const [scrollable, setScrollable] = useState(false);

  useEffect(() => {
    const newRotation = isNarrowed1 ? 180 : 0;
    setRotation(newRotation);
  }, [isNarrowed1]);

  useEffect(() => {
    const contentHeight = document.getElementById('content')?.clientHeight || 0;
    const containerHeight = document.getElementById('container')?.clientHeight || 0;
    setScrollable(contentHeight > containerHeight);
  }, [children]);

  const handleButtonClick = () => {
    toggleIsNarrowed1();
  };

  return (
    <div
      id="container"
      className={`second-section ${isNarrowed1 ? 'w-18' : 'w-[40px]'} ${
        isNarrowed1 ? 'h-[192vh]' : 'h-[75px]'
      } z-10 ml-16  absolute flex justify-center items-center w-80 mr-auto bg-gray-300 text-alternate-text transition-all duration-100 ease-in-out rounded-lg`}
    >
      <div className="content-wrapper" id="content">
        <button
          className={`arrow-button1 ml-48 text-xl mt-3 text-gray-500 transform transition-transform duration-100 ease-in-out absolute border-none
            shadow-none bg-transparent right-3.5 top-${isNarrowed1 ? '4' : '4'} ${
            rotation === 180 ? 'rotate-180' : ''
          } transition-transform duration-500 ease-in-out`}
          onClick={handleButtonClick}
        >
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
      </div>

      {isNarrowed1 ? (
        <div className={`${scrollable ? 'overflow-y-auto' : ''}`}>
          {children}
        </div>
      ) : (
        <div className="ml-36 space-y-4">{/* Content when narrowed */}</div>
      )}
    </div>
  );
};

export default SecondSection;
