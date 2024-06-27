import { collection, getDocs, QueryDocumentSnapshot } from 'firebase/firestore';
import db from '../../services/Firestore'; // Adjust the import path as needed
import { FIREBASE } from '../../constants/firebase';

export interface UserNameData {
  userId: string;
  name: string;
}

const getUserNames = async (): Promise<UserNameData[]> => {
  try {
    const usersCollection = collection(db,FIREBASE.USERS);
    const querySnapshot = await getDocs(usersCollection);

    const userNameData: UserNameData[] = [];

    querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
      const name = doc.data().name;
      userNameData.push({ userId: doc.id, name });
    });

    return userNameData;
  } catch (error) {
    console.error('Error fetching name:', error);
    throw error;
  }
};

export { getUserNames };
