// MainSectionContent.js

import React from 'react';
import GoogleMapComponent from '../../components/GoogleMap';
import EsriMap from '../../components/EsriMap';


function MainSectionContent() {

  return (
    <div>
      <GoogleMapComponent/>
      {/* <EsriMap/> */}
    </div>
  );
}

export default MainSectionContent;
