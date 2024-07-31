import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SigApp from '../../SigApp';
import HomePage from '../../pages/HomePage/HomePage';
import { Layout } from 'lucide-react';
import MeshtasticApp from '../../pages/Mesh/MeshtasticsApp';
import LoginPage from '../../pages/LoginPage/Login';

const MainProject= () => {
  const [googleAuthenticated, setGoogleAuthenticated] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  
  const handleLogin = () => {
    if (!googleAuthenticated) {
      console.log('User has not authenticated with Google');
      return;
    }

    setLoggedIn(true);
  };

  return (
    <Router>
      <Routes>
        <Route path="/mesh" element={<MeshtasticApp/>} />
        <Route path="/layout" element={<Layout />} />
        <Route path="/sigApp" element={<SigApp />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin}/>} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default MainProject;
