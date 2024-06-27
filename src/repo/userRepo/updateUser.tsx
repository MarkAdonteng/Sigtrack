// import { db } from '../../services/firebase'; // Adjust the import path as needed
// import { doc, updateDoc } from 'firebase/firestore';
// import { MemberData } from '../../components/TeamManager'; // Adjust the import path as needed

// export const updateUser = async (userId: string, updatedValues: Partial<MemberData>) => {
//   try {
//     const userDocRef = doc(db, 'users', userId); // 'users' should be the collection name
//     await updateDoc(userDocRef, updatedValues);
//     console.log(`User with ID ${userId} updated successfully.`);
//   } catch (error) {
//     console.error(`Error updating user with ID ${userId}:`, error);
//     throw new Error('Unable to update user. Please try again later.');
//   }
// };
// userRepo/deleteUser.ts
import { db } from '../../services/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { FIREBASE } from '../../constants/firebase';

export const deleteUser = async (teamId: string, userId: string): Promise<void> => {
  const userDoc = doc(db, `${FIREBASE.TEAMS}/${teamId}/${FIREBASE.MEMBERS}/${userId}`);
  await deleteDoc(userDoc);
};
