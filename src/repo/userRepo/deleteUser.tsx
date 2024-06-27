// deleteUser.ts
import { db } from '../../services/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { FIREBASE } from '../../constants/firebase';

export const deleteUser = async (teamId: string, userId: string) => {
  try {
    const memberRef = doc(db, `${FIREBASE.TEAMS}/${teamId}/${FIREBASE.MEMBERS}/${userId}`);
    await deleteDoc(memberRef);
    console.log(`Member with userId: ${userId} successfully deleted from team: ${teamId}`);
  } catch (error) {
    console.error('Error removing member from team:', error);
    throw error;
  }
};
