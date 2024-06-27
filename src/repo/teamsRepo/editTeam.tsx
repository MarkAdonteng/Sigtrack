import { Team } from "../../components/TeamList";
import {doc,updateDoc} from 'firebase/firestore'
import { FIREBASE } from "../../constants/firebase";
import {db} from '../../services/firebase'

export const EditTeam = async (teamId: string, updatedValues: Partial<Team>, setLoading: (isLoading: boolean) => void) => {
    console.log('Form submitted with updated values:', updatedValues);
    try {
      setLoading(true);
      // Update the team document in Firestore
      const teamRef = doc(db, FIREBASE.TEAMS, teamId);
      await updateDoc(teamRef, updatedValues);
      console.log('Team updated successfully:', teamId);
      setLoading(false);
    } catch (error) {
      console.error('Error updating team:', error);
    }
  };
  