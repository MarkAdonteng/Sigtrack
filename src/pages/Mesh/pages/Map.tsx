import { Subtle } from "../components/UI/Typography/Subtle.js";
import { cn } from "../core/utils/cn.js";
import { PageLayout } from "../components/PageLayout.js";
import { Sidebar } from "../components/Sidebar.js";
import { SidebarSection } from "../components/UI/Sidebar/SidebarSection.js";
import { SidebarButton } from "../components/UI/Sidebar/sidebarButton.js";
import { useAppStore } from "../core/stores/appStore.js";
import { useDevice } from "../core/stores/deviceStore.js";
import { Hashicon } from "@emeraldpay/hashicon-react";
import { bbox, lineString } from "@turf/turf";
import {
  BoxSelectIcon,
  MapPinIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Marker, useMap } from "react-map-gl";
import MapGl from "react-map-gl/maplibre";
import {db} from "../../../services/firebase.js"; // Import Firestore instance
import { addDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const MapPage = (): JSX.Element => {
  const { nodes, waypoints } = useDevice();
  const { rasterSources } = useAppStore();
  const { default: map } = useMap();

  const [zoom, setZoom] = useState(0);

  const allNodes = Array.from(nodes.values());

  const [showModal, setShowModal] = useState(false);
  const [cacheName, setCacheName] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [storedCaches, setStoredCaches] = useState<string[]>([]);

  // Function to toggle modal visibility
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const saveCacheToFirestore = () => {
    if (!map) return;
  
    const viewport = map.getMap().getBounds();
    const zoom = map.getMap().getZoom();
  
    const tileUrl = `https://a.tile.openstreetmap.org/{z}/{x}/{y}.png`;
  
    if (cacheName.trim() !== "") {
      addDoc(collection(db, 'mapTiles'), {
        name: cacheName,
        tileURL: tileUrl,
        zoomLevel: zoom,
        viewport: {
          latitude: viewport.getNorth(),
          longitude: viewport.getWest(),
          latitude2: viewport.getSouth(),
          longitude2: viewport.getEast(),
        },
      })
        .then(() => {
          console.log("Cache saved successfully");
          // Update storedCaches state to include the new cache
          setStoredCaches(prevCaches => [...prevCaches, cacheName]);
        })
        .catch((error) => {
          console.error("Error saving cache: ", error);
        });
    }
  };
  
  useEffect(() => {
    fetchStoredCaches();
  }, []);

  const fetchStoredCaches = async () => {
    const querySnapshot = await getDocs(collection(db, 'mapTiles'));
    const cacheNames: string[] = [];
    querySnapshot.forEach((doc) => {
      cacheNames.push(doc.data().name);
    });
    setStoredCaches(cacheNames);
  };

  const handleMapCacheClick = () => {
    saveCacheToFirestore();
    toggleModal(); // Show modal
  };

  const handleStoredMapCacheClick = () => {
    setShowDropdown(prevShowDropdown => !prevShowDropdown);
    // fetchStoredCaches();
  };

  const handleSelectCachedMap = async (selectedCache: string) => {
    try {
      const querySnapshot = await getDocs(collection(db, 'mapTiles'));
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.name === selectedCache) {
          // Update map viewport and zoom level based on cached data
          map?.easeTo({
            zoom: data.zoomLevel,
            latitude: (data.viewport.latitude + data.viewport.latitude2) / 2,
            longitude: (data.viewport.longitude + data.viewport.longitude2) / 2,
          } as maplibre.EaseToOptions); // Add type assertion here
        
        }
      });
      setShowDropdown(false);
    } catch (error) {
      console.error("Error selecting cached map:", error);
    }
  };
  
  

  const handleDeleteCachedMap = async (cacheNameToDelete: string) => {
    try {
      const querySnapshot = await getDocs(collection(db, 'mapTiles'));
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.name === cacheNameToDelete) {
          // Delete the document from Firestore
          deleteDoc(doc.ref)
            .then(() => {
              console.log("Document successfully deleted!");
              // Optionally, you can update the state to reflect the removal from the dropdown
              const updatedCaches = storedCaches.filter(cacheName => cacheName !== cacheNameToDelete);
              setStoredCaches(updatedCaches);
            })
            .catch((error) => {
              console.error("Error deleting document: ", error);
            });
        }
      });
    } catch (error) {
      console.error("Error deleting cached map:", error);
    }
  };
  
  

  useEffect(() => {
    map?.on('tileload', function(event) {
      const tileUrl = event.tile.url;
      saveCacheToFirestore();
    });
  }, [map, saveCacheToFirestore]);

  const getBBox = () => {
    if (!map) {
      return;
    }
    const nodesWithPosition = allNodes.filter(
      (node) => node.position?.latitudeI
    );
    if (!nodesWithPosition.length) {
      return;
    }
    if (nodesWithPosition.length === 1) {
      map.easeTo({
        zoom: 12,
        center: [
          (nodesWithPosition[0].position?.longitudeI ?? 0) / 1e7,
          (nodesWithPosition[0].position?.latitudeI ?? 0) / 1e7,
        ],
      });
      return;
    }
    const line = lineString(
      nodesWithPosition.map((n) => [
        (n.position?.latitudeI ?? 0) / 1e7,
        (n.position?.longitudeI ?? 0) / 1e7,
      ])
    );
    const bounds = bbox(line);
    const center = map.cameraForBounds(
      [
        [bounds[1], bounds[0]],
        [bounds[3], bounds[2]],
      ],
      { padding: { top: 10, bottom: 10, left: 10, right: 10 } }
    );
    if (center) {
      map.easeTo(center);
    }
  };

  useEffect(() => {
    map?.on("zoom", () => {
      setZoom(map?.getZoom() ?? 0);
    });
  }, [map]);

  useEffect(() => {
    map?.on("load", () => {
      getBBox();
    });
  }, [map, getBBox]);

  return (
    <>
      <Sidebar>
        <SidebarSection label="Sources">
          {rasterSources.map((source) => (
            <SidebarButton key={source.title} label={source.title} />
          ))}
        </SidebarSection>
      </Sidebar>

      <PageLayout
        label="Map"
        noPadding={true}
        actions={[
          {
            icon: ZoomInIcon,
            onClick() {
              map?.zoomIn();
            },
          },
          {
            icon: ZoomOutIcon,
            onClick() {
              map?.zoomOut();
            },
          },
          {
            icon: BoxSelectIcon,
            onClick() {
              getBBox();
            },
          },
        ]}
        onMapCacheClick={handleMapCacheClick}
        onStoredMapCacheClick={handleStoredMapCacheClick}
      >
        <div></div>
        {showModal && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
              <div className="relative bg-white p-8 rounded-lg shadow-xl">
                <div className="absolute top-0 right-0 -mr-4 -mt-4">
                  <button className="text-gray-500 hover:text-gray-400" onClick={toggleModal}>
                    <span className="sr-only">Close</span>
                  </button>
                </div>
                <h2 className="text-lg font-semibold mb-4">Enter Cache Name</h2>
                <input
                  type="text"
                  value={cacheName}
                  onChange={(e) => setCacheName(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
                  placeholder="Enter cache name"
                />
                <button
                  onClick={() => {
                    handleMapCacheClick();
                    toggleModal(); // Close modal after submission
                  }}
                  className="bg-black text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Submit
                </button>
                <button
                  onClick={() => {
                    toggleModal(); // Close modal on cancel
                  }}
                  className="bg-black text-white px-4 py-2 rounded hover:bg-blue-600 ml-10"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

{showDropdown && (
  <div className="absolute top-20 right-2 z-10 bg-white shadow-md p-2 max-w-sm">
    <ul className="list-none p-0 m-0">
      {storedCaches.map((cacheName, index) => (
        <li key={index} className="relative flex justify-between items-center">
          <div
            className="cursor-pointer py-1 px-2 hover:bg-gray-200 flex-grow"
            onClick={() => handleSelectCachedMap(cacheName)}
          >
            {cacheName}
          </div>
          <button
            className="text-red-500 px-2 py-1"
            onClick={() => handleDeleteCachedMap(cacheName)}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </li>
      ))}
    </ul>
  </div>
)}



        <MapGl
          mapStyle="https://raw.githubusercontent.com/hc-oss/maplibre-gl-styles/master/styles/osm-mapnik/v8/default.json"
          attributionControl={false}
          renderWorldCopies={false}
          maxPitch={0}
          dragRotate={false}
          touchZoomRotate={false}
          initialViewState={{
            zoom: 1.6,
            latitude: 35,
            longitude: 0,
          }}
        >
          {/* Map rendering components */}
          {waypoints.map((wp) => (
            <Marker key={wp.id} longitude={wp.longitudeI / 1e7} latitude={wp.latitudeI / 1e7} anchor="bottom">
              <div>
                <MapPinIcon size={16} />
              </div>
            </Marker>
          ))}
          {allNodes.map((node) => {
            if (node.position?.latitudeI) {
              return (
                <Marker
                  key={node.num}
                  longitude={node.position.longitudeI / 1e7}
                  latitude={node.position.latitudeI / 1e7}
                  anchor="bottom"
                >
                  <div
                    className="flex cursor-pointer gap-2 rounded-md border bg-backgroundPrimary p-1.5"
                    onClick={() => {
                      map?.easeTo({
                        zoom: 12,
                        center: [
                          (node.position?.longitudeI ?? 0) / 1e7,
                          (node.position?.latitudeI ?? 0) / 1e7,
                        ],
                      });
                    }}
                  >
                    <Hashicon value={node.num.toString()} size={22} />
                    <Subtle className={cn(zoom < 12 && "hidden")}>{node.user?.longName}</Subtle>
                  </div>
                </Marker>
              );
            }
          })}
        </MapGl>
      </PageLayout>
    </>
  );
};
