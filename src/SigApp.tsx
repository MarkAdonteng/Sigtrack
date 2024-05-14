// App.tsx
import React, { useState } from 'react';
import './App.css';
import { SelectedMembersProvider } from './Context/membersContext';
import { NarrowProvider } from './Context/NarrowedContext';
import LoginPage from './pages/LoginPage/Login';
import GoogleAuth from './components/GoogleAuth';
import { OrganizationProvider } from './Context/organizationContext';
import { TeamIdProvider } from './Context/TeamIdContext';
import { LogoutProvider } from './Context/LogoutContext';
import { TeamMembersProvider } from './Context/TeamMembersContext';
import { MemberProvider } from './Context/MemberIdContext';
import { UserContextProvider } from './Context/LoggedInUserContext';
import Layout from './layout/Layout';
import { TeamContextProvider } from './Context/TeamsContext';

const SigApp: React.FC = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [googleAuthenticated, setGoogleAuthenticated] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleLogin = () => {
    if (!googleAuthenticated) {
      console.log('User has not authenticated with Google');
      return;
    }

    setLoggedIn(true);
  };

  const handleGoogleLogin = () => {
    console.log('Attempting Google login....');
    setGoogleAuthenticated(true);
  };

  const handleLogout = () => {
    // Show the confirmation form
    setShowConfirmation(true);
  };

  const confirmLogout = (shouldLogout: boolean) => {
    if (shouldLogout) {
      window.location.reload();
      setLoggedIn(false);
      setGoogleAuthenticated(false);
      console.log('Logout successful!');
    }
    
    // Close the confirmation form
    setShowConfirmation(false);
  };


  return (
    // Providers
    <LogoutProvider handleLogout={handleLogout}>
      <TeamContextProvider>
      <SelectedMembersProvider>
        <TeamMembersProvider>
          <OrganizationProvider>
            <NarrowProvider>
              <TeamIdProvider>
                <MemberProvider>
                  <UserContextProvider>
                    <div>
                      {/* Conditional rendering */}
                      {isLoggedIn ? (
                        // Render Layout component when logged in
                        <div className='flex flex-col h-screen font-lato'>
                          <Layout />

                          {/* Modal component */}
                          {showConfirmation && (
                            <div className="modal  fixed inset-0 bg-gray-900 text-black bg-opacity-70 flex justify-center items-center z-96 text-sm">
                              <div className="modal-content  bg-gray-200 text-black w-96 text-center rounded-lg shadow-md p-6  text-sm">
                                <p className='text-lg font-semibold mb-2'>Are you sure you want to logout?</p>
                                <div>
                                  <button onClick={() => confirmLogout(true)}
                                    className='  bg-black text-white  font-bold rounded-lg w-20 h-10 mt-6 mr-10'>Yes</button>
                                  <button onClick={() => confirmLogout(false)}
                                    className='w-20 h-10  bg-black text-white  font-bold rounded-lg  mt-6 mr-10'>No</button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        // Render login page or Google authentication component
                        googleAuthenticated ? (
                          <LoginPage onLogin={handleLogin} />
                        ) : (
                          <GoogleAuth onGoogleLogin={handleGoogleLogin} />
                        )
                      )}
                    </div>
                  </UserContextProvider>
                </MemberProvider>
              </TeamIdProvider>
            </NarrowProvider>
          </OrganizationProvider>
        </TeamMembersProvider>
      </SelectedMembersProvider>
      </TeamContextProvider>
    </LogoutProvider>
  );
};


export default SigApp;
