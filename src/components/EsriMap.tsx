// src/ArcGISMap.tsx
import React, { useEffect, useRef } from 'react';
import { loadModules } from 'esri-loader';

const EsriMap: React.FC = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Load the ArcGIS API for JavaScript modules
    loadModules(['esri/Map', 'esri/views/MapView', 'esri/Graphic'], { css: true })
      .then(([Map, MapView, Graphic]) => {
        // Create a map and view
        const map = new Map({
          basemap: 'streets-vector' // Use streets-vector as a replacement
        });
        
        const view = new MapView({
          container: mapRef.current,
          map: map,
          center: [-118, 34],
          zoom: 8
        });
        

        // Add a simple graphics layer with a point
        const point = {
          type: 'point',
          longitude: -118,
          latitude: 34
        };

        const simpleMarkerSymbol = {
          type: 'simple-marker',
          color: [226, 119, 40],
          outline: {
            color: [255, 255, 255],
            width: 2
          }
        };

        const pointGraphic = new Graphic({
          geometry: point,
          symbol: simpleMarkerSymbol
        });

        view.graphics.add(pointGraphic);
      })
      .catch(error => console.error('Error loading modules:', error));
  }, []);

  return <div className="map-container" ref={mapRef}></div>;
};

export default EsriMap;
