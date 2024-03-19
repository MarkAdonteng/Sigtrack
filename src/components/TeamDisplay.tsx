import React from 'react';

interface TeamDisplayProps {
  teamNames: { userId: string; name: string; organization: string }[];
}

const TeamDisplay: React.FC<TeamDisplayProps> = ({ teamNames }) => {
  return (
    <div>
      <h2>Team Names:</h2>
      <ul>
        {teamNames && teamNames.length > 0 ? (
          teamNames.map((team) => (
            <li key={team.userId}>
              {`User ID: ${team.userId}, Name: ${team.name}, Organization: ${team.organization}`}
            </li>
          ))
        ) : (
          <p>No team names available.</p>
        )}
      </ul>
    </div>
  );
};

export default TeamDisplay;
