import { collection, getDocs, doc, getDoc, DocumentReference } from 'firebase/firestore';
import db from '../../services/Firestore';
import { FIREBASE } from '../../constants/firebase';

interface OrganizationData {
  userId: string;
  organizationName: string;
}

const getOrganizations = async (): Promise<OrganizationData[]> => {
  try {
    const usersCollection = collection(db, FIREBASE.USERS);
    const querySnapshot = await getDocs(usersCollection);

    const organizationsData: OrganizationData[] = [];

    for (const userDoc of querySnapshot.docs) {
      let organizationName = 'Organization not specified';

      const organizationField = userDoc.data().organization;

      if (typeof organizationField === 'string') {
        organizationName = organizationField;
      } else if (organizationField instanceof DocumentReference) {
        const organizationDoc = await getDoc(organizationField);

        if (organizationDoc.exists()) {
          organizationName = organizationDoc.data().name;
        } else {
          organizationName = 'Organization not found';
        }
      }

      organizationsData.push({ userId: userDoc.id, organizationName });
    }

    return organizationsData;
  } catch (error) {
    console.error('Error fetching organizations:', error);
    throw error;
  }
};

export { getOrganizations };
