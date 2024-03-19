// import { collection, getDocs, QueryDocumentSnapshot } from 'firebase/firestore';
// import db from '../Firestore'; // Adjust the import path as needed

// interface userTypeData {
//   userId: string;
//   user_type: string; // Update the type based on your actual data structure
// }

// const getUserType = async (): Promise<userTypeData[]> => {
//   try {
//     const usersCollection = collection(db, 'users');
//     const querySnapshot = await getDocs(usersCollection);

//     const UserTypeData: userTypeData[] = [];

//     querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
//       const user_type = doc.data().user_type;
//       UserTypeData.push({ userId: doc.id, user_type });
//     });

//     return  UserTypeData;
//   } catch (error) {
//     console.error('Error fetching passwords:', error);
//     throw error;
//   }
// };

// export { getUserType };




import React, { useEffect } from 'react';
import { collection, getDocs, QueryDocumentSnapshot } from 'firebase/firestore';
import db from '../../services/Firestore'; // Adjust the import path as needed
import { FIREBASE } from '../../constants/firebase';

interface UserTypeData {
  userId: string;
  user_type: string;
}

const UserTypesComponent: React.FC = () => {
  useEffect(() => {
    const getUserType = async (): Promise<UserTypeData[]> => {
      try {
        const usersCollection = collection(db, FIREBASE.USERS);
        const querySnapshot = await getDocs(usersCollection);

        const userTypeData: UserTypeData[] = [];

        querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
          const user_type = doc.data().user_type;
          userTypeData.push({ userId: doc.id, user_type });
        });

        return userTypeData;
      } catch (error) {
        console.error('Error fetching user types:', error);
        throw error;
      }
    };

    const fetchData = async () => {
      try {
        const userTypeData = await getUserType();
        userTypeData.forEach((data) => {
          console.log(`User ID: ${data.userId}, User Type: ${data.user_type}`);
        });
      } catch (error) {
        console.error('Error fetching and displaying user types:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures that the effect runs once when the component mounts

  return (
    <div>

    </div>
  );
};

export default UserTypesComponent;

