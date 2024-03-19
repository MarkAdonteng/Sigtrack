
// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import { enableMapSet } from "immer";
// import "maplibre-gl/dist/maplibre-gl.css";


// enableMapSet();

// ReactDOM.render(
//   <React.StrictMode>
   
//    <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

import './index.css';
import { enableMapSet } from "immer";
import "maplibre-gl/dist/maplibre-gl.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from './App';

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

enableMapSet();

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
