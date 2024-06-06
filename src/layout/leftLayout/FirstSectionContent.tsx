import React, { useEffect } from 'react';
import { useLogoutContext } from '../../Context/LogoutContext';
import { useNavigate } from 'react-router-dom';
import { useCustomMarkerContext } from '../../Context/CustomMarkerContext';
import { useNarrowContext } from '../../Context/NarrowedContext';

interface FirstSectionContentProps {
  onLogout: () => void;
}

const FirstSectionContent: React.FC<FirstSectionContentProps> = ({ onLogout }) => {
  const { handleLogout } = useLogoutContext();
  const navigate = useNavigate();
  const { displayCustomMarker, setDisplayCustomMarker } = useCustomMarkerContext();
  const { isNarrowed1, toggleIsNarrowed1 } = useNarrowContext();

  const navigateToMesh = () => {
    window.open('/mesh', '_blank');
  };

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // Check if the user is navigating back from the mesh page
      if (event.state && event.state.fromMesh) {
        // Navigate back to the previous page
        navigate('/layout');
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  const handleDisplayCustomMarker = () => {   
    setDisplayCustomMarker((prevDisplay) => !prevDisplay);
    if (!isNarrowed1) {
      toggleIsNarrowed1();
    }
  };

  return (
    <div className='text-center ml-2'>
      <div>
        <div>
          <img
            src="/src/assets/images/SIGTRACK.png"
            alt="Sigtrack Logo"
            className="mb-6 absolute w-12"
          />
        </div>

        <div>
          <img
            src="/src/assets/images/goggles.svg"
            alt="Sigtrack Logo"
            className="mb-6 absolute w-10 mt-16 ml-1"
          />
        </div>

        <div>
          <img
            src="/src/assets/images/mesh.svg"
            alt="Sigtrack Logo"
            className="mb-6 absolute w-28 bottom-20 -ml-3 cursor-pointer"
            onClick={navigateToMesh}
          />
        </div>

        <img
          src="/src/assets/images/light.svg"
          alt="Sigtrack Logo"
          className="mb-6 absolute w-10 bottom-10 cursor-pointer"
        />
      </div>

      <div>
        <img
          src="/src/assets/images/vector.svg"
          alt="Sigtrack Logo"
          className="mb-6 absolute w-10 bottom-0 cursor-pointer"
          onClick={handleLogout}
        />
      </div>

      <div>
        <img
          src="/src/assets/images/marker.png"
          alt="Sigtrack Logo"
          className="mb-36 absolute w-8 bottom-0 cursor-pointer ml-1"
          onClick={handleDisplayCustomMarker}
        />
      </div>
    </div>
  );
};

export default FirstSectionContent;
