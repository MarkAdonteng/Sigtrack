// TeamMemberItem.tsx
import React from 'react';
import { RiPencilFill, RiDeleteBin6Line } from 'react-icons/ri';
import { MemberData } from '../Context/TeamMembersContext';

interface TeamMemberItemProps {
  member: MemberData;
  formatDate: (date: string | Date | undefined) => string;
  teamColor: string;
  onEditClick: (userId: string) => void;
  onDeleteClick: (userId: string) => void;
  onMemberClick: (name: string, dateCreated: string | Date) => void; // New prop for handling member click
  onEditModalOpen: (member: MemberData) => void; // New prop for opening edit modal
}

const TeamMemberItem: React.FC<TeamMemberItemProps> = ({
  member,
  formatDate,
  teamColor,
  onEditClick,
  onDeleteClick,
  onMemberClick,
  onEditModalOpen,
}) => {
  const handleClick = () => {
    // Call onMemberClick with member details
    onMemberClick(member.name, member.dateCreated);
  };

  return (
    <div className="flex items-center mb-4 relative" onClick={handleClick}>
      <div
        style={{ backgroundColor: teamColor }}
        className="text-white rounded-md p-2 w-8 h-8 mr-2 flex items-center justify-center font-lato cursor-pointer"
        onClick={() => onEditClick(member.userId)}
      >
        {member.name.charAt(0)}
      </div>
      <div className="flex flex-col">
        <div
          className="text-sm font-bold cursor-pointer"
          onClick={() => onEditClick(member.userId)}
        >
          {member.name}
        </div>
        <div className="flex items-center absolute space-x-2 ml-32 mt-1">
          <RiPencilFill
            className="text-primary cursor-pointer text-gray-500"
            onClick={() => onEditModalOpen(member)} // Call onEditModalOpen with member data
          />
          <RiDeleteBin6Line
            className="text-red-500 cursor-pointer"
            onClick={() => onDeleteClick(member.userId)}
          />
        </div>
        <div className="text-xs text-gray-500">
          {formatDate(member.dateCreated)}
        </div>
      </div>
    </div>
  );
};

export default TeamMemberItem;