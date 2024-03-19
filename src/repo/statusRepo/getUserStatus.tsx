import { collection, getDocs, QueryDocumentSnapshot } from 'firebase/firestore';
import db from '../../services/Firestore'; // Adjust the import path as needed
import { FIREBASE } from '../../constants/firebase';

interface Status {
  userId: string;
  status: string; // Update the type based on your actual data structure
}

const getUserStatus = async (): Promise<Status[]> => {
  try {
    const usersCollection = collection(db, FIREBASE .USERS);
    const querySnapshot = await getDocs(usersCollection);

    const statusData: Status[] = [];

    querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
      const status = doc.data().status;
        statusData.push({ userId: doc.id, status });
    });

    return statusData;
  } catch (error) {
    console.error('Error fetching:', error);
    throw error;
  }
};

export { getUserStatus };










// import React, { useEffect } from 'react';
// import { collection, getDocs, QueryDocumentSnapshot } from 'firebase/firestore';
// import db from '../Firestore'; // Adjust the import path as needed

// interface Status {
//   userId: string;
//   status: string; // Update the type based on your actual data structure
// }

// const StatusDisplay: React.FC = () => {
//   useEffect(() => {
//     const fetchUserStatus = async () => {
//       try {
//         const usersCollection = collection(db, 'users');
//         const querySnapshot = await getDocs(usersCollection);

//         const statusData: Status[] = [];

//         querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
//           const status = doc.data().status;
//           statusData.push({ userId: doc.id, status });
//         });

//         // Display status in the console
//         console.log('User Status:', statusData);
//       } catch (error) {
//         console.error('Error fetching:', error);
//       }
//     };

//     fetchUserStatus();
//   }, []); // Empty dependency array ensures the effect runs only once on mount

//   return null; // Component doesn't render anything
// };

// export default StatusDisplay;
