import React, { useState, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { useMarkerContext } from '../Context/SelectedCustomMarkeContext';
import { useMembersContext, MemberData } from '../Context/membersContext';
import ModalForm from './ModalForm'; // Import the ModalForm component
import CustomMarkerModal from './CustomMarkerModal';

const containerStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: '5vw',
  width: 'calc(120.5vw - 400px)',
  height: '100vh',
};

enum MapType {
  ROADMAP = 'roadmap',
  SATELLITE = 'satellite',
  HYBRID = 'hybrid',
  TERRAIN = 'terrain',
}

interface DroppedMarker {
  id: number;
  position: { lat: number; lng: number };
  markerUrl: string;
  name?: string;
  description?: string;
}

const GoogleMapComponent: React.FC = () => {
  const [mapType, setMapType] = useState<MapType>(MapType.ROADMAP);
  const [selectedMember, setSelectedMember] = useState<MemberData | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { selectedMarker } = useMarkerContext();
  const [droppedMarkers, setDroppedMarkers] = useState<DroppedMarker[]>([]);
  const [SelectedMarker, setSelectedMarker] = useState<DroppedMarker | null>(null);
  const { members } = useMembersContext();
  const mapRef = useRef<google.maps.Map | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    latitude: '',
    longitude: '',
    description: '',
  });

  const center = currentLocation || {
    lat: 5.5871,
    lng: -0.2774,
  };

  const handleGoToCurrentLocation = () => {
    if (currentLocation && mapRef.current) {
      mapRef.current.panTo(currentLocation);
    }
  };

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (selectedMarker && event.latLng) {
      const { lat, lng } = event.latLng.toJSON();
      setMarkerPosition({ lat, lng });
      setFormData(prevData => ({
        ...prevData,
        name: `Marker ${droppedMarkers.length + 1}`, // Auto-fill name with "Marker {number}"
        latitude: lat.toFixed(6), // Autofill latitude
        longitude: lng.toFixed(6), // Autofill longitude
      }));
      setModalOpen(true);
    }
  };

  const handleModalSubmit = () => {
    if (markerPosition && selectedMarker) {
      const newMarker: DroppedMarker = {
        id: droppedMarkers.length + 1,
        position: markerPosition,
        markerUrl: selectedMarker,
        name: formData.name,
        description: formData.description,
      };
      setDroppedMarkers(prevMarkers => [...prevMarkers, newMarker]);
    }
    setMarkerPosition(null);
  };

  const handleDroppedMarkerClick = (marker: DroppedMarker) => {
    setSelectedMarker(marker);
  }

  const handleMarkerClick = (member: MemberData) => {
    setSelectedMember(member);
  };

  const handleMarkerDrag = (marker: DroppedMarker, newPosition: google.maps.LatLngLiteral) => {
    setMarkerPosition(newPosition);
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyDkw3a_XLgmpbUFB1yuuNj3o5cFlhP7HCo">
      <div>
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '250px',
            zIndex: 0,
          }}
        >
          <select id="mapType" onChange={(e) => setMapType(e.target.value as MapType)} value={mapType}>
            <option value={MapType.ROADMAP}>Roadmap</option>
            <option value={MapType.SATELLITE}>Satellite</option>
            <option value={MapType.HYBRID}>Hybrid</option>
            <option value={MapType.TERRAIN}>Terrain</option>
          </select>
        </div>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
          mapTypeId={mapType}
          onLoad={(map) => {
            mapRef.current = map;
          }}
          onClick={handleMapClick}
        >
          {droppedMarkers.map((marker) => (
            <Marker
              key={marker.id}
              position={marker.position}
              icon={{
                url: marker.markerUrl,
                scaledSize: new window.google.maps.Size(40, 40),
              }}
              onClick={() => handleDroppedMarkerClick(marker)}
              draggable={true}
              onDrag={(e) => handleMarkerDrag(marker, e.latLng.toJSON())}
            >
              {marker === SelectedMarker && (
                <InfoWindow position={markerPosition}>
                  <div>
                    <h3>{marker.name}</h3>
                    <p>Latitude: {markerPosition?.lat.toFixed(6)}</p>
                    <p>Longitude: {markerPosition?.lng.toFixed(6)}</p>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          ))}
          {currentLocation && (
            <Marker
              position={currentLocation}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: 'green',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2,
              }}
            />
          )}
          {members.map((member) => (
            <Marker
              key={member.userId}
              position={{ lat: member.latitude, lng: member.longitude }}
              onClick={() => handleMarkerClick(member)}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: member.teamColor,
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2,
              }}
            />
          ))}
          {selectedMember && (
            <InfoWindow
              position={{
                lat: selectedMember.latitude || center.lat,
                lng: selectedMember.longitude || center.lng,
              }}
              onCloseClick={() => setSelectedMember(null)}
            >
              <div>
                <h3>
                  <strong>Name: </strong>
                  {selectedMember.name}
                </h3>
                <p>
                  <strong>User ID: </strong>
                  {selectedMember.userId}
                </p>
                <div>
                  <strong>Status:</strong> {selectedMember.status}
                </div>
                <div>
                <strong>User Type:</strong> {selectedMember.user_type}
                </div>
              </div>
            </InfoWindow>
          )}
          <div className="bg-white">
            <div
              onClick={handleGoToCurrentLocation}
              className="fixed p-1 text-green left-96 ml-[1032px] mt-96 top-28 bg-white w-10 text-center pointer"
            >
              <FontAwesomeIcon icon={faMapMarkerAlt} size="2x" />
            </div>
          </div>
        </GoogleMap>
      </div>
      <CustomMarkerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        title="Add Marker"
        formData={formData}
        setFormData={setFormData}
      />
    </LoadScript>
  );
};

export default GoogleMapComponent;

