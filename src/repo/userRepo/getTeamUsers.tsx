import {getDocs,collection } from 'firebase/firestore';
import {db} from '../../services/firebase';
import { FIREBASE } from '../../constants/firebase';
import { MemberData } from '../../components/TeamList';

export const getTeamUsers = async (teamId: string): Promise<MemberData[]> => {
    try {
      const membersCollectionRef = collection(db, `${FIREBASE.TEAMS}/${teamId}/members`);
      const membersSnapshot = await getDocs(membersCollectionRef);
  
      const members = membersSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          dateAdded:data.dateAdded,
          userId: doc.id,
          callSign: data.callSign,
          status: data.status,
         
        } as MemberData;
      });
  
      return members;
    } catch (error) {
      console.error('Error fetching team members:', error);
      return [];
    }
  };
  
  
  