import { collection, getDocs } from 'firebase/firestore';
import db from '../../services/Firestore';
import { FIREBASE } from '../../constants/firebase';

interface Organization {
  id: string;
  name: string;
  // Add other fields if necessary
}


export const getAllOrganizations = async (): Promise<Organization[]> => {
  try {
    const organizationsSnapshot = await getDocs(collection(db, FIREBASE.ORGANIZATIONS));
    const organizations: Organization[] = organizationsSnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name, // Verify the field name matches your Firestore structure
      // Map other fields as needed
    }));
    return organizations;
  } catch (error) {
    console.error('Error fetching organizations:', error);
    throw error; // Optionally rethrow the error to handle it elsewhere
  }
};

