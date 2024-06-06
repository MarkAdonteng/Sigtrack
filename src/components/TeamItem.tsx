import React, { useState } from 'react';
import { RiPencilFill, RiDeleteBin6Line } from 'react-icons/ri';
import { DocumentReference } from 'firebase/firestore';
import { Team } from '../components/TeamList';

interface TeamItemProps {
  team: Team;
  onEdit: (teamId: string) => void;
  onDelete: (teamId: string) => void;
  onTeamClick: (members: DocumentReference[], teamId: string) => void;
  displayIconsOnly?: boolean;
  style?: React.CSSProperties;
}

const TeamItem: React.FC<TeamItemProps> = ({
  team,
  onEdit,
  onDelete,
  onTeamClick,
  displayIconsOnly,
  style
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleClick = () => {
    setIsClicked(!isClicked);
    onTeamClick(team.members, team.id);
  };

  const renderTeamName = () => {
    if (team.name.length > 10) {
      return (
        <div
          className="overflow-hidden whitespace-nowrap text-sm font-bold text-alternate-text team-name truncate"
          title={team.name}
        >
          {`${team.name.slice(0, 20)}...`}
        </div>
      );
    } else {
      return (
        <div
          className="overflow-hidden whitespace-nowrap text-sm font-bold text-alternate-text team-name truncate"
        >
          {team.name}
        </div>
      );
    }
  };

  if (displayIconsOnly) {
    return (
      <li className="flex items-center mb-4 cursor-pointer font-lato justify-center align-center" style={style}>
        <div
          className="rounded-md p-2 w-8 h-8 mr-2 flex items-center justify-center"
          style={{ backgroundColor: team.color || 'brown', color: 'white' }}
          onClick={handleClick}
        >
          {team.name.charAt(0)}
        </div>
      </li>
    );
  }

  return (
    <li
      className="flex items-center mb-2 cursor-pointer font-lato justify-center relative align-center"
      style={style}
    >
      <div
        className="rounded-md p-2 w-8 h-8 mr-2 flex items-center justify-center"
        style={{ backgroundColor: team.color || 'brown', color: 'white' }}
        onClick={handleClick}
      >
        {team.name.charAt(0)}
      </div>
      <div className="flex-grow flex items-center" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <div onClick={handleClick}>
          {renderTeamName()}
          <div className="text-xs text-gray-500">
            {team.date_established?.seconds && new Date(team.date_established.seconds * 1000).toLocaleDateString()}
          </div>
        </div>
        <div className="flex ml-[150px] absolute space-x-2">
          <RiPencilFill className="text-primary cursor-pointer text-gray-500" onClick={() => onEdit(team.id)} />
          <RiDeleteBin6Line className="text-red-500 cursor-pointer" onClick={() => onDelete(team.id)} />
        </div>
      </div>
    </li>
  );
};

export default TeamItem;