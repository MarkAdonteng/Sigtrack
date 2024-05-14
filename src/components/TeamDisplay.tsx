// DisplayedTeamsAndMembers.tsx
import React from 'react';
import TeamMemberItem from './TeamMemberItem';
import { MemberData } from '../Context/TeamMembersContext';

interface DisplayedTeamAndMembersProps {
  teamsAndMembers: {
    teamName: string;
    teamColor: string;
    members: MemberData[];
  }[];
  formatDate: (date: string | Date | undefined) => string;
  onEditClick: (userId: string) => void;
  onDeleteClick: (userId: string) => void;
  onMemberClick: (name: string, dateCreated: string | Date) => void;
  onEditModalOpen: (member: MemberData) => void;
}

const DisplayedTeamAndMember: React.FC<DisplayedTeamAndMembersProps> = ({
  teamsAndMembers,
  formatDate,
  onEditClick,
  onDeleteClick,
  onMemberClick,
  onEditModalOpen,
}) => {
  return (
    <>
      {teamsAndMembers.map((displayedTeam, index) => (
        <div key={index}>
          <h3 className="font-bold mb-2">{displayedTeam.teamName} Members</h3>
          <ul>
            {displayedTeam.members.length === 0 ? (
              <li className="text-secondary-text">No members in this team</li>
            ) : (
              displayedTeam.members.map((member, memberIndex) => (
                <TeamMemberItem
                  key={memberIndex}
                  member={member}
                  formatDate={formatDate}
                  teamColor={displayedTeam.teamColor}
                  onEditClick={onEditClick}
                  onDeleteClick={onDeleteClick}
                  onMemberClick={onMemberClick}
                  onEditModalOpen={onEditModalOpen}
                />
              ))
            )}
          </ul>
        </div>
      ))}
    </>
  );
};

export default DisplayedTeamAndMember;
