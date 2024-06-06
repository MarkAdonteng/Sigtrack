import React, { useEffect, useState } from 'react';
import { useTeamId } from '../Context/TeamIdContext';
import { db } from '../services/firebase'; // Adjust the import path as necessary
import { doc, getDoc, onSnapshot, DocumentReference } from 'firebase/firestore';
import TeamDataDisplay from './TeamManager'; // Import the new component
import AddMembersButton from './AddMembersButton';
import { useTeamsContext } from '../Context/TeamsContext';
import { MemberData } from '../components/TeamList';
import { FIREBASE } from '../constants/firebase';
import { useMembersContext } from '../Context/membersContext';

const formatDate = (date: any): string => {
    if (date instanceof Date) {
        return date.toLocaleDateString();
    } else if (typeof date === 'string') {
        const parsedDate = new Date(date);
        if (!isNaN(parsedDate.getTime())) {
            return parsedDate.toLocaleDateString();
        }
    } else if (date && date.seconds) {
        const timestampDate = new Date(date.seconds * 1000);
        return timestampDate.toLocaleDateString();
    }
    return '';
};

export interface MemberFeatures {
    userId: string,
    name: string,
    dateCreated: string | Date;
    callSign: string;
    status: string;
    user_type: string;
    longitude: number;
    latitude: number;
    password: string;
}

const TeamData = () => {
    const { teamId } = useTeamId();
    const [teamDataArray, setTeamDataArray] = useState<{ teamName: string, members: MemberFeatures[], teamColor: string }[]>([]);
    const { setTeamNames } = useTeamsContext();
    const { setMembers } = useMembersContext(); 

    useEffect(() => {
        const storedTeamData = localStorage.getItem('teamDataArray');
        if (storedTeamData) {
            const parsedTeamData = JSON.parse(storedTeamData) || [];
            setTeamDataArray(parsedTeamData.filter((team: { removed?: boolean }) => !team.removed));// Filter out removed teams
        }
    }, []);

    useEffect(() => {
        if (teamDataArray.length > 0) {
            localStorage.setItem('teamDataArray', JSON.stringify(teamDataArray));
        }
    }, [teamDataArray]);

    useEffect(() => {
        if (!teamId) return;

        const teamDocRef = doc(db, FIREBASE.TEAMS, teamId);

        const unsubscribe = onSnapshot(teamDocRef, async (teamDoc) => {
            if (teamDoc.exists()) {
                const teamData = teamDoc.data();
                console.log('Team Data:', teamData); // Log the team data
                const newTeamData = {
                    teamName: teamData.name || 'Unnamed Team',
                    members: [],
                    teamColor: teamData.color || 'No Color'
                };

                // Fetch members data
                const membersPromises = teamData.members.map(async (memberRef: DocumentReference) => {
                    console.log('Fetching member data for ID:', memberRef.id); // Log the member ID
                    const memberDoc = await getDoc(memberRef);
                    if (memberDoc.exists()) {
                        const memberData = memberDoc.data();
                        console.log('Member Data:', memberData); // Log the member data
                        const userDocRef = doc(db, 'users', memberRef.id); // Adjust the path as necessary
                        const userDoc = await getDoc(userDocRef);
                        if (userDoc.exists()) {
                            const userData = userDoc.data();
                            console.log('User Data:', userData); // Log the user data
                            const dateCreated = formatDate(userData.dateCreated);
                           
                            return {
                                userId: memberRef.id,
                                name: memberData.name || 'Unnamed Member',
                                dateCreated,
                                callSign: memberData.callSign || '',
                                status: memberData.status || '',
                                user_type: memberData.user_type || '',
                                longitude: memberData.longitude || 0,
                                latitude: memberData.latitude || 0,
                                password: memberData.password || ''
                            };
                        } else {
                            console.warn('User document does not exist for member ID:', memberRef.id);
                            return null;
                        }
                    } else {
                        console.warn('Member document does not exist for ID:', memberRef.id);
                        return null;
                    }
                });

                const membersData: MemberData[] = await Promise.all(membersPromises);
                newTeamData.members = membersData.filter((member): member is MemberData => member !== null);

                // Update state with new team data, removing the old one if it exists
                setTeamDataArray(prevTeamDataArray => {
                    const existingIndex = prevTeamDataArray.findIndex(team => team.teamName === newTeamData.teamName);

                    if (existingIndex !== -1) {
                        if (existingIndex === prevTeamDataArray.length - 1) {
                            // Existing team data is the last item, do not remove it
                            return prevTeamDataArray;
                        } else {
                            // Remove the existing team data and do not add the new one
                            const filteredTeamDataArray = prevTeamDataArray.filter(team => team.teamName !== newTeamData.teamName);
                            console.log('Filtered Team Data Array (removing existing):', filteredTeamDataArray); // Log filtered team data array
                            return filteredTeamDataArray;
                        }
                    } else {
                        // Add the new team data to the array
                        const newArray = [...prevTeamDataArray, newTeamData];
                        console.log('New Team Data Array (adding new):', newArray); // Log new team data array
                        return newArray;
                    }
                });
            } else {
                console.log('No such document!');
            }
        });

        return () => unsubscribe();
    }, [teamId, setTeamNames]);

    useEffect(() => {
        const names = teamDataArray.map(team => team.teamName);
        setTeamNames(names);
    }, [teamDataArray, setTeamNames]);

    useEffect(() => {
        teamDataArray.forEach(team => {
            console.log(`Members of ${team.teamName}:`, team.members);
        });
        const allMembersWithTeamColor = teamDataArray.flatMap(team => 
            team.members.map(member => ({ ...member, teamId: team.teamName, teamColor: team.teamColor }))
        );
        setMembers(allMembersWithTeamColor); // Update the members context with all members and their teamColor
    }, [teamDataArray, setMembers]);
    



    const handleAddMembers = async () => {
        // Add any necessary logic here if needed
    };

    return (
        <div className='fixed top-4 -ml-32 h-full overflow-hidden'>
            <div className='overflow-y-auto overflow-x-hidden' style={{ maxHeight: 'calc(91vh - 0rem)', width: '110%' }}>
                <div className='space-y-4'>
                    {teamDataArray.map((teamData, index) => (
                        <TeamDataDisplay
                            key={teamData.teamName}
                            teamData={teamData}
                            setTeamDataArray={setTeamDataArray} // Pass setTeamDataArray as a prop
                        />
                    ))}
                </div>

                <div className="bottom-5 absolute -ml-4">
                    <AddMembersButton onAddMembers={handleAddMembers} teamId={teamId || ''} teamDataArray={teamDataArray} setTeamDataArray={setTeamDataArray} />
                </div>
            </div>
        </div>
    );
};

export default TeamData;
