// import { MemberData } from "../Context/TeamMembersContext";
// import { DisplayedTeamAndMembers } from "../components/TeamMembers";

// interface DisplayedTeam {
//   teamName: string;
//   teamColor: string;
//   members: MemberData[];
//   isVisible: boolean;
// }

// interface RootState {
//   displayedTeamsAndMembers: DisplayedTeam[];
// }

// interface AddDisplayedTeamAction {
//   type: 'ADD_DISPLAYED_TEAM';
//   payload: DisplayedTeamAndMembers;
// }

// interface RemoveDisplayedTeamAction {
//   type: 'REMOVE_DISPLAYED_TEAM';
//   payload: string; // TeamName
// }

// interface UpdateDisplayedTeamMemberAction {
//   type: 'UPDATE_DISPLAYED_TEAM_MEMBER';
//   payload: {
//     teamId: string;
//     memberId: string;
//     updatedValues: Partial<MemberData> | null;
//   };
// }

// interface ToggleDisplayedTeamVisibilityAction {
//   type: 'TOGGLE_DISPLAYED_TEAM_VISIBILITY';
//   payload: string; // TeamName
// }

// type TeamAction = AddDisplayedTeamAction | RemoveDisplayedTeamAction | UpdateDisplayedTeamMemberAction | ToggleDisplayedTeamVisibilityAction;

// const initialState: RootState = {
//   displayedTeamsAndMembers: []
// };

// const teamReducer = (state: RootState = initialState, action: TeamAction): RootState => {
//   switch (action.type) {
//     case 'ADD_DISPLAYED_TEAM':
//       return {
//         ...state,
//         displayedTeamsAndMembers: [
//           ...state.displayedTeamsAndMembers.filter(team => team.teamName !== action.payload.teamName),
//           { ...action.payload, isVisible: true }
//         ]
//       };
//     case 'REMOVE_DISPLAYED_TEAM':
//       return {
//         ...state,
//         displayedTeamsAndMembers: state.displayedTeamsAndMembers.filter(team => team.teamName !== action.payload)
//       };
//     case 'UPDATE_DISPLAYED_TEAM_MEMBER':
//       if (action.payload.updatedValues === null) {
//         return {
//           ...state,
//           displayedTeamsAndMembers: state.displayedTeamsAndMembers.map(team => {
//             if (team.members.some(member => member.userId === action.payload.memberId)) {
//               return {
//                 ...team,
//                 members: team.members.filter(member => member.userId !== action.payload.memberId)
//               };
//             }
//             return team;
//           })
//         };
//       } else {
//         return {
//           ...state,
//           displayedTeamsAndMembers: state.displayedTeamsAndMembers.map(team => {
//             if (team.teamName === action.payload.teamId) {
//               return {
//                 ...team,
//                 members: team.members.map(member => {
//                   if (member.userId === action.payload.memberId) {
//                     return { ...member, ...action.payload.updatedValues };
//                   }
//                   return member;
//                 })
//               };
//             }
//             return team;
//           })
//         };
//       }
//     case 'TOGGLE_DISPLAYED_TEAM_VISIBILITY':
//       return {
//         ...state,
//         displayedTeamsAndMembers: state.displayedTeamsAndMembers.map(team => {
//           if (team.teamName === action.payload) {
//             return { ...team, isVisible: !team.isVisible };
//           }
//           return team;
//         })
//       };
//     default:
//       return state;
//   }
// };

// export default teamReducer;













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

export interface TeamData {
  teamName: string;
  members: MemberFeatures[];
  teamColor: string;
}

export type TeamDataState = TeamData[];

type Action =
  | { type: 'SET_TEAMS', payload: TeamData[] }
  | { type: 'ADD_TEAM', payload: TeamData }
  | { type: 'REMOVE_TEAM', payload: string }
  | { type: 'UPDATE_TEAM', payload: TeamData };

export const teamDataReducer = (state: TeamDataState, action: Action): TeamDataState => {
  switch (action.type) {
      case 'SET_TEAMS':
          return action.payload;
      case 'ADD_TEAM':
          return [...state, action.payload];
      case 'REMOVE_TEAM':
          return state.filter(team => team.teamName !== action.payload);
      case 'UPDATE_TEAM':
          return state.map(team => team.teamName === action.payload.teamName ? action.payload : team);
      default:
          return state;
  }
};

