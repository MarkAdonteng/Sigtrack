import { useEffect } from 'react';
import { db } from '../services/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { MemberData } from '../Context/TeamMembersContext';


const useTeamRealtimeUpdates = (teamId: string, setTeamMembers: (members: MemberData[]) => void) => {
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'Teams', teamId), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const teamData = docSnapshot.data();
        if (teamData && teamData.members) {
          setTeamMembers(teamData.members); // Update team members in local state
        }
      }
    });

    return () => unsubscribe(); // Cleanup function to unsubscribe from the listener when component unmounts or teamId changes
  }, [teamId, setTeamMembers]);
};

export default useTeamRealtimeUpdates;
