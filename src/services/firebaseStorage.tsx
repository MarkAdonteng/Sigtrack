import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "./firebase"; // Import the Firebase app instance from firebase.ts

const storage = getStorage(app);

// Function to save map tile in Firebase Storage
export const saveMapTile = async (tileURL: string, tileBlob: Blob, zoomLevel: number) => {
  const tileRef = ref(storage, `mapTiles/${zoomLevel}/${tileURL}`);
  await uploadBytes(tileRef, tileBlob);
};

// Function to fetch map tile URL from Firebase Storage
export const fetchMapTileURL = async (tileURL: string, zoomLevel: number) => {
  const tileRef = ref(storage, `mapTiles/${zoomLevel}/${tileURL}`);
  const downloadURL = await getDownloadURL(tileRef);
  return downloadURL;
};


