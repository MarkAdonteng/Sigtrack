import { collection, doc, setDoc } from 'firebase/firestore';
import db from '../../services/Firestore'; // Adjust the import path as needed
import { FIREBASE } from '../../constants/firebase';
import { getUserNames } from '../userRepo/getUserName'; // Adjust the import path as needed

interface MemberData {
  callSign: string;
  status: string;
  dateAdded: number; // using Unix timestamp (milliseconds since epoch)
}

const addUser = async (teamId: string, userId: string, memberData: MemberData): Promise<void> => {
  try {
    const userNames = await getUserNames();
    const user = userNames.find(user => user.userId === userId);

    if (!user) {
      throw new Error('User not found');
    }

    const membersCollection = collection(db, FIREBASE.TEAMS, teamId, FIREBASE.MEMBERS);
    const userDoc = doc(membersCollection, userId);

    await setDoc(userDoc, {
      callSign: memberData.callSign,
      status: memberData.status,
      dateAdded: memberData.dateAdded
    });

    console.log(`User ${user.name} added to team ${teamId}`);
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

export { addUser };
