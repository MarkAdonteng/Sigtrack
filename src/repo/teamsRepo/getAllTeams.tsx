import { collection, CollectionReference, getDocs, Timestamp } from 'firebase/firestore';
import db from '../../services/Firestore';
import { FIREBASE } from '../../constants/firebase';
import { Team } from '../../constants/types';

const getAllTeams = async (): Promise<Team[]> => {
  try {
    const teamsCollection = collection(db, FIREBASE.TEAMS);
    const querySnapshot = await getDocs(teamsCollection);

    const teams: Team[] = [];

    querySnapshot.forEach(doc => {
      const data = doc.data();
      teams.push({
        id: doc.id,
        name: data.name,
        date_established: data.date_established,
        color: data.color,
        status: data.status,
        description: data.description,
        members: data.members,
        timestamp: data.timestamp,
        organization: data.organization,
      });
    });

    return teams;
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw error;
  }
};

export { getAllTeams };
