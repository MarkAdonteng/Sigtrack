import { Team } from "../../components/TeamList";
import { collection,addDoc,updateDoc } from 'firebase/firestore';
import { db } from "../../services/firebase";
import { FIREBASE } from "../../constants/firebase";

export const addTeam = async (
  newTeamData: Omit<Team, 'id'>,
  setLoading: (isLoading: boolean) => void,
  closeModal: () => void,
  fetchData: () => Promise<void>
) => {
  try {
    setLoading(true);
    const docRef = await addDoc(collection(db, FIREBASE.TEAMS), newTeamData);
    await updateDoc(docRef, { id: docRef.id });
    console.log('New team added with ID:', docRef.id);
    closeModal(); // Close the modal after successful submission
    await fetchData(); // Refresh the team list
    setLoading(false);
  } catch (error) {
    console.error('Error adding new team:', error);
    setLoading(false);
  }
};
