import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SigApp from './SigApp';

import { Layout } from 'lucide-react';
import MeshtasticApp from './pages/Mesh/MeshtasticsApp';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/mesh" element={<MeshtasticApp/>} />
        <Route path="/layout" element={<Layout />} />
        <Route path="/" element={<SigApp />} />
      </Routes>
    </Router>
  );
};

export default App;
