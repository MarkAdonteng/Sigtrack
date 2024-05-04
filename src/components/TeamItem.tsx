import { RiPencilFill, RiDeleteBin6Line } from 'react-icons/ri';
import {  DocumentReference} from 'firebase/firestore';
import {Team} from '../components/TeamList';


interface TeamItemProps {
    team: Team;
    onEdit: (teamId: string) => void;
    onDelete: (teamId: string) => void;
    onTeamClick: (members: DocumentReference[], teamId: string) => void;
    displayIconsOnly?: boolean;
  }
  
  const TeamItem: React.FC<TeamItemProps> = ({ team, onEdit, onDelete, onTeamClick, displayIconsOnly }) => {
    return (
      <li className="flex items-center mb-2 cursor-pointer font-lato justify-center align-center">
        {displayIconsOnly ? (
          <div
            className="rounded-md p-2 w-8 h-8 mr-2 flex items-center justify-center"
            style={{ backgroundColor: team.color || 'brown', color: 'white' }}
          >
            {team.name.charAt(0)}
          </div>
        ) : (
          <>
            <div
              className="rounded-md p-2 w-8 h-8 mr-2 flex items-center justify-center"
              style={{ backgroundColor: team.color || 'brown', color: 'white' }}
            >
              {team.name.charAt(0)}
            </div>
            <div className="flex-grow flex items-center">
              <div onClick={() => onTeamClick(team.members, team.id)}>
                <div className={`overflow-hidden whitespace-nowrap text-ellipsis text-sm font-bold text-alternate-text ${team.name.length > 10 ? 'marquee' : ''}`}>
                  {team.name}
                </div>
                <div className="text-xs text-gray-500">{team.date_established?.seconds && new Date(team.date_established.seconds * 1000).toLocaleDateString()}</div>
              </div>
              <div className="flex ml-[150px] absolute space-x-2">
                <RiPencilFill
                  className="text-primary cursor-pointer text-gray-500"
                  onClick={() => onEdit(team.id)}
                />
                <RiDeleteBin6Line
                  className="text-red-500 cursor-pointer"
                  onClick={() => onDelete(team.id)}
                />
              </div>
            </div>
          </>
        )}
      </li>
    );
  };
  export default TeamItem;