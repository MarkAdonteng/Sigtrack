// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import ExternalModule from './externalModule';

ReactDOM.render(
  <React.StrictMode>
    <ExternalModule />
  </React.StrictMode>,
  document.getElementById('root')
);
