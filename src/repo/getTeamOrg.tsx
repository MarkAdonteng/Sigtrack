// // TeamNamesComponent.tsx

// import React, { useEffect, useState } from 'react';
// import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
// import db from '../services/Firestore';

// interface TeamNameData {
//   userId: string;
//   name: string;
//   organization: string;
// }

// interface TeamNamesComponentProps {
//   organization: string;
// }

// const TeamNamesComponent: React.FC<TeamNamesComponentProps> = ({ organization }) => {
//   const [teamNames, setTeamNames] = useState<TeamNameData[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const teamsCollection = collection(db, 'Teams');
//         const querySnapshot = await getDocs(teamsCollection);

//         const namesData: TeamNameData[] = [];

//         for (const doc of querySnapshot.docs) {
//           const data = doc.data() as { name: string; organization: string };
//           const organizationDoc = await getDoc(data.organization);

//           if (organizationDoc.exists()) {
//             const organizationName = organizationDoc.data().name;
//             if (organizationName === organization) {
//               namesData.push({ userId: doc.id, name: data.name, organization: organizationName });
//             }
//           }
//         }

//         setTeamNames(namesData);
//       } catch (error) {
//         console.error('Error fetching team names:', error);
//       }
//     };

//     fetchData();
//   }, [organization]);

//   useEffect(() => {
//     console.log('Team Names:', teamNames);
//   }, [teamNames]);

//   return (
//     <div>
//       {/* You can add any additional UI elements or components here */}
//     </div>
//   );
// };

// export default TeamNamesComponent;






// TeamNamesComponent.tsx

import React, { Component } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import db from '../services/Firestore';

interface TeamNameData {
  userId: string;
  name: string;
  organization: string;
}

interface TeamNamesComponentProps {
  organization: string;
}

interface TeamNamesComponentState {
  teamNames: TeamNameData[];
}

class TeamNamesComponent extends Component<TeamNamesComponentProps, TeamNamesComponentState> {
  constructor(props: TeamNamesComponentProps) {
    super(props);
    this.state = {
      teamNames: [],
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  async fetchData() {
    try {
      const teamsCollection = collection(db, 'Teams');
      const querySnapshot = await getDocs(teamsCollection);

      const namesData: TeamNameData[] = [];

      for (const doc of querySnapshot.docs) {
        const data = doc.data() as { name: string; organization: string };
        const organizationDoc = await getDoc(data.organization);

        if (organizationDoc.exists()) {
          const organizationName = organizationDoc.data().name;
          if (organizationName === this.props.organization) {
            namesData.push({ userId: doc.id, name: data.name, organization: organizationName });
          }
        }
      }

      this.setState({ teamNames: namesData });
    } catch (error) {
      console.error('Error fetching team names:', error);
    }
  }

  componentDidUpdate(prevProps: TeamNamesComponentProps) {
    if (prevProps.organization !== this.props.organization) {
      this.fetchData();
    }
  }

  render() {
    console.log('Team Names:', this.state.teamNames);

    return (
      <div>
        {/* You can add any additional UI elements or components here */}
      </div>
    );
  }
}

export default TeamNamesComponent;
