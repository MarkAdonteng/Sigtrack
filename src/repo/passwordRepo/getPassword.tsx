import { collection, getDocs, QueryDocumentSnapshot } from 'firebase/firestore';
import db from '../../services/Firestore'; // Adjust the import path as needed
import { FIREBASE } from '../../constants/firebase';

interface PasswordData {
  userId: string;
  password: string; // Update the type based on your actual data structure
}

const getPasswords = async (): Promise<PasswordData[]> => {
  try {
    const usersCollection = collection(db,FIREBASE.USERS);
    const querySnapshot = await getDocs(usersCollection);

    const passwordsData: PasswordData[] = [];

    querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
      const password = doc.data().password;
      passwordsData.push({ userId: doc.id, password });
    });

    return passwordsData;
  } catch (error) {
    console.error('Error fetching passwords:', error);
    throw error;
  }
};

export { getPasswords };
