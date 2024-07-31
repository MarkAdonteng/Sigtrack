import { collection, getDocs } from 'firebase/firestore';
import db from '../../services/Firestore';
import { FIREBASE } from '../../constants/firebase';
import { Users } from '../../constants/types';

const getAllUsers = async (): Promise<Users[]> => {
  try {
    const usersCollection = collection(db, FIREBASE.USERS);
    const querySnapshot = await getDocs(usersCollection);

    const users: Users[] = [];

    querySnapshot.forEach(doc => {
      const data = doc.data();
      users.push({
        callSign: data.callSign,
        dateCreated: data.dateCreated,
        lat: data.lat,
        lon: data.lon,
        name: data.name,
        organization: data.organization,
        password: data.password, // Consider security implications of storing and fetching passwords
        status: data.status,
        teamId: data.teamId,
        userId: doc.id,
        userType: data.userType,
      });
    });

    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export { getAllUsers };
