import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { useMarkerContext } from '../Context/SelectedCustomMarkeContext';
import { useMembersContext, MemberData } from '../Context/membersContext';
import CustomMarkerModal from './CustomMarkerModal';
import { db } from '../services/firebase';
import { collection, addDoc, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

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
  id: string;
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
  const [selectedMarkerInfo, setSelectedMarkerInfo] = useState<DroppedMarker | null>(null);
  const { members } = useMembersContext();
  const mapRef = useRef<google.maps.Map | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    latitude: '',
    longitude: '',
    desc: '',
  });

  const center = currentLocation || {
    lat: 5.5871,
    lng: -0.2774,
  };

  useEffect(() => {
    const markersCollection = collection(db, 'Symbols');
    const unsubscribe = onSnapshot(markersCollection, (snapshot) => {
      const markers = snapshot.docs.map((doc) => {
        const data = doc.data();
        console.log("Data from Firestore: ", data);
        return {
          id: doc.id,
          position: {
            lat: data.latlng.latitude,
            lng: data.latlng.longitude,
          },
          markerUrl: data.symbolPath,
          name: data.title,
          description: data.desc,
        };
      }) as DroppedMarker[];
      console.log("Updated Markers: ", markers);
      setDroppedMarkers(markers);
    });

    return () => unsubscribe();
  }, []);

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
        title: `Marker ${droppedMarkers.length + 1}`,
        latitude: lat.toFixed(6),
        longitude: lng.toFixed(6),
      }));
      setModalOpen(true);
    }
  };

  const handleModalSubmit = async () => {
    if (markerPosition && selectedMarker) {
      let relativePath = selectedMarker.replace('http://127.0.0.1:5000/images', '');
      
      // Remove leading slash if present
      if (relativePath.startsWith('/')) {
        relativePath = relativePath.substring(1);
      }
  
      const newMarker: DroppedMarker = {
        id: uuidv4(),
        position: markerPosition,
        markerUrl: relativePath,
        name: formData.title,
        description: formData.desc,
      };
  
      try {
        // Save the new marker to Firestore
        await addDoc(collection(db, 'Symbols'), {
          id: newMarker.id,
          title: newMarker.name,
          latlng: {
            latitude: newMarker.position.lat,
            longitude: newMarker.position.lng,
          },
          desc: newMarker.description,
          symbolPath: relativePath, // Symbol path without leading slash
          radioId: null,
          symbolImage: null,
          createdBy: null,
        });
  
        console.log('Marker added to Firestore with ID:', newMarker.id);
      } catch (error) {
        console.error('Error adding document:', error);
      }
    }
  
    setMarkerPosition(null);
    setModalOpen(false);
  };

  const handleDeleteMarker = async (markerId: string) => {
    try {
      await deleteDoc(doc(db, 'Symbols', markerId));
      console.log('Marker deleted with ID:', markerId);
      setSelectedMarkerInfo(null);
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const handleDroppedMarkerClick = (marker: DroppedMarker) => {
    setSelectedMarkerInfo(marker);
  };

  const handleMarkerClick = (member: MemberData) => {
    setSelectedMember(member);
  };

  const handleMarkerDrag = (marker: DroppedMarker, newPosition: google.maps.LatLngLiteral) => {
    setDroppedMarkers(prevMarkers =>
      prevMarkers.map(m =>
        m.id === marker.id ? { ...m, position: newPosition } : m
      )
    );
    setSelectedMarkerInfo(prev =>
      prev && prev.id === marker.id ? { ...prev, position: newPosition } : prev
    );
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
                url: `http://127.0.0.1:5000/images/${marker.markerUrl}`,
                scaledSize: new window.google.maps.Size(40, 40),
              }}
              onClick={() => handleDroppedMarkerClick(marker)}
              draggable={true}
              onDrag={(e) => handleMarkerDrag(marker, e.latLng.toJSON())}
              onDragEnd={(e) => handleMarkerDrag(marker, e.latLng.toJSON())}
            >
              {marker.id === selectedMarkerInfo?.id && (
                <InfoWindow position={marker.position}>
                  <div>
                    <h3>{marker.name}</h3>
                    <p>Latitude: {marker.position.lat.toFixed(6)}</p>
                    <p>Longitude: {marker.position.lng.toFixed(6)}</p>
                    <button onClick={() => handleDeleteMarker(marker.id)}>Delete</button>
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

                 
