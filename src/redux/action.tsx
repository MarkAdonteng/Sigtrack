import { DisplayedTeamAndMembers } from '../components/TeamMembers';
import { MemberData } from '../Context/TeamMembersContext';

export const addDisplayedTeam = (team: DisplayedTeamAndMembers) => {
  return {
    type: 'ADD_DISPLAYED_TEAM',
    payload: team
  };
};

export const removeDisplayedTeam = (teamName: string) => {
  return {
    type: 'REMOVE_DISPLAYED_TEAM',
    payload: teamName
  };
};

export const updateDisplayedTeamMember = (memberId: string, updatedValues: Partial<MemberData>) => {
  return {
    type: 'UPDATE_DISPLAYED_TEAM_MEMBER',
    payload: { memberId, updatedValues }
  };
};

export const toggleDisplayedTeamVisibility = (teamName: string) => {
  return {
    type: 'TOGGLE_DISPLAYED_TEAM_VISIBILITY',
    payload: teamName
  };
};
