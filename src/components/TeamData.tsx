import React, { useEffect, useState } from 'react';
import { useTeamId } from '../Context/TeamIdContext';
import { db } from '../services/firebase'; // Adjust the import path as necessary
import { doc, onSnapshot } from 'firebase/firestore';
import TeamDataDisplay from './TeamManager'; // Import the new component
import AddMembersButton from './AddMembersButton';
import { useTeamsContext } from '../Context/TeamsContext';
import { MemberData } from '../constants/types';
import { FIREBASE } from '../constants/firebase';
import { useMembersContext } from '../Context/membersContext';
import { useTeamMembersContext } from '../Context/TeamMembersContext';

const TeamData = () => {
    const { teamId } = useTeamId();
    const [teamDataArray, setTeamDataArray] = useState<{ teamId: string, teamName: string, members: MemberData[], teamColor: string }[]>([]);
    const { setTeamNames } = useTeamsContext();
    const { setMembers } = useMembersContext();
    const { teamMembers } = useTeamMembersContext(); // Context for team members

    useEffect(() => {
        const storedTeamData = localStorage.getItem('teamDataArray');
        if (storedTeamData) {
            const parsedTeamData = JSON.parse(storedTeamData) || [];
            setTeamDataArray(parsedTeamData.filter((team: { removed?: boolean }) => !team.removed)); // Filter out removed teams
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
                    teamColor: teamData.color || 'No Color',
                    teamId: teamData.id
                };

                // Replace fetching members from Firestore with context data
                const membersData: MemberData[] = teamMembers.filter(member => {
                    // Assuming `member.userId` matches with `teamData.members`
                    return teamData.members.some((memberRef: { id: string }) => memberRef.id === member.userId);
                });

                newTeamData.members = membersData;

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
                            localStorage.setItem('teamDataArray', JSON.stringify(filteredTeamDataArray));
                            return filteredTeamDataArray;
                        }

                    } else {
                        // Add the new team data to the array
                        const newArray = [...prevTeamDataArray, newTeamData];
                        console.log('New Team Data Array (adding new):', newArray); // Log new team data array
                        localStorage.setItem('teamDataArray', JSON.stringify(newArray));
                        return newArray;
                    }
                });
            } else {
                console.log('No such document!');
            }
        });

        return () => unsubscribe();
    }, [teamId, setTeamNames, teamMembers]);

    useEffect(() => {
        const teamNamesWithIds = teamDataArray.map(team => ({
            teamName: team.teamName,
            teamId: team.teamId
        }));
     
        setTeamNames(teamNamesWithIds);
        console.log(teamId, teamNamesWithIds)
    }, [teamDataArray, setTeamNames]);
    

    useEffect(() => {
        teamDataArray.forEach(team => {
            console.log(`Members of ${team.teamName}:`, team.members);
        });
        const allMembersWithTeamColor = teamDataArray.flatMap(team =>
            team.members.map(member => ({ ...member, teamId: team.teamId, teamColor: team.teamColor }))
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
                    {teamDataArray.map((teamData) => (
                        <TeamDataDisplay
                            key={teamData.teamName}
                            teamData={teamData}
                            setTeamDataArray={setTeamDataArray}
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
