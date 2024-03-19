import React, { useEffect } from 'react';
import { useLogoutContext } from '../../Context/LogoutContext';
import { useNavigate} from 'react-router-dom';

interface FirstSectionContentProps {
  onLogout: () => void;
}


const FirstSectionContent: React.FC<FirstSectionContentProps> = ({ onLogout }) => {
  const { handleLogout } = useLogoutContext();
  const navigate = useNavigate();

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
  
  
  return (
    <div className='text-center ml-2'>
    <div>

      <div>
      <img
          src="/src/assets/images/SIGTRACK.png"  // Replace with the path to your image
          alt="Sigtrack Logo"
          className="mb-6   absolute w-12"      // Use mx-auto to center the image horizontally
          // Set a maximum width for the image
        />
      </div>
     

      <div>
      <img
          src="/src/assets/images/goggles.svg"  // Replace with the path to your image
          alt="Sigtrack Logo"
          className="mb-6   absolute w-10 mt-16 ml-1"      // Use mx-auto to center the image horizontally
          // Set a maximum width for the image
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
          src="/src/assets/images/vector.svg"  // Replace with the path to your image
          alt="Sigtrack Logo"
          className="mb-6   absolute w-10 bottom-0 cursor-pointer"      // Use mx-auto to center the image horizontally
          onClick={handleLogout}
          // Set a maximum width for the image
        />

          </div>
        
    </div>
    
  )
}

export default FirstSectionContent
