import React, { useState } from 'react';
import { auth, db } from '../../services/firebase';
import { getPasswords } from '../../repo/passwordRepo/getPassword';
import { getOrganizations } from '../../repo/organizationRepo/getOrganization';
import { getUserStatus } from '../../repo/statusRepo/getUserStatus';
import { useOrganizationContext } from '../../Context/organizationContext';
import TeamNamesComponent from '../../repo/getTeamOrg';
import FirstSectionContent from '../../layout/leftLayout/FirstSectionContent';
import { getUserName } from '../../repo/userRepo/getUserName'; // Adjust the import path as needed
import { useUserContext } from '../../Context/LoggedInUserContext';


interface LoginPageProps {
  onLogin: () => void;
}

interface OrganizationData {
  userId: string;
  organizationName: string;
}

interface PasswordData {
  userId: string;
  password: string;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [organization, setOrganization] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Added loading state
  const [showLoginForm, setShowLoginForm] = useState(true);
  const { setUserId } = useUserContext();
  const { setEnteredOrganization } = useOrganizationContext();

  const handleLogin = async () => {
    try {
      setLoading(true);
      setEnteredOrganization(organization);
  
      const organizationsData = await getOrganizations();
      const passwordsData = await getPasswords();
      const statusData = await getUserStatus();
  
      const usersWithEnteredOrg = organizationsData.filter(
        (org: OrganizationData) => org.organizationName === organization
      );
  
      for (const user of usersWithEnteredOrg) {
        const userId = user.userId;
  
        const passwordMatch = passwordsData.some(
          (pass: PasswordData) => pass.password === password && pass.userId === userId
        );
  
        if (passwordMatch) {
          const userStatus = statusData.find((status) => status.userId === userId);
  
          if (userStatus) {
            if (userStatus.status === 'active') {
              onLogin();
  
              setUserId(userId);
              // Call getUserName to fetch user data
              const userNameData = await getUserName();
  
              // Find the user data based on the logged-in user ID
              const loggedInUserData = userNameData.find(user => user.userId === userId);
  
              if (loggedInUserData) {
                // Display the user's name
                alert(`Welcome, ${loggedInUserData.name}!`);
              } else {
                console.log('User not found.');
              }
  
              setLoading(false);
              return;
            } else if (userStatus.status === 'suspended') {
              // Show the suspended message
              setShowLoginForm(false);
              return;
            }
          }
        }
      }
  
      alert('Invalid password for all users with the entered organization');
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error fetching data. Please try again.');
      setLoading(false);
    }
  };
  

  const handleLogout = () => {
    // Implement logout logic here
    // For example, you can clear user authentication state, redirect to the login page, etc.
    alert('Logout successful!');
  };

  
  return (
    <div className="flex items-center justify-center h-screen">
      {showLoginForm ?
      
       
         <div
    className="text-center justify-center w-96 h-[450px] bg-[rgb(217,_217,_217)] rounded-[60px]"
    >
          <img
          src="/src/assets/images/SIGTRACK.png"  // Replace with the path to your image
          alt="Sigtrack Logo"
          className="mb-6 mt-6 ml-12 absolute"      // Use mx-auto to center the image horizontally
          style={{ maxWidth: '80px' }}  // Set a maximum width for the image
        />
        <h1 className='font-bold text-4xl mt-28 ml-10 absolute'> Sigtrack Login</h1>
        <div >
            <input type='text' placeholder='enter organization' onChange={(e) => setOrganization(e.target.value)}
            className='w-80 h-[50px] bg-white font-bold text-gray-400 p-4 rounded-[15px] mt-44' />

            <input type='password' placeholder='enter password' onChange={(e) => setPassword(e.target.value)}
             className='w-80 h-[50px] bg-white font-bold text-gray-400 p-4 rounded-[15px] mt-4' />
        </div>

        <div>
        <button
            onClick={handleLogin}
            className={`w-32 h-[50px] bg-black text-white text-2xl font-bold rounded-[15px] mt-6 ml-44 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? (
             <div className="flex-col gap-4 w-full flex items-center justify-center">
             <div className="w-10 h-10 border-8 text-blue-400 text-4xl animate-spin border-gray-300 flex items-center justify-center border-t-blue-400 rounded-full">
            
              
             </div>
           </div>
            ) : (
              'Sign In'
            )}
          </button>
        </div>
        <hr className='text-white mt-2'></hr>
       
        <hr className='text-white mt-2'></hr>
       
        <div>
          <p className='font-bold text-sm mr-20'>Not registered, click here to register</p>
        </div>
      </div>
      
     : (
      <div className='text-center mb-2'>
        <div className='text-2xl font-semibold'>You Are Suspended</div>
        <p className='text-sm'> Please contact your Admin to rectify your user status</p>
        </div>
      
    )}
  </div>
     
  );
};

export default LoginPage; 