import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MemberFeatures {
    userId: string;
    name: string;
    dateCreated: string | Date;
    callSign: string;
    status: string;
    user_type: string;
    longitude: number;
    latitude: number;
    password: string;
}

interface TeamData {
    teamName: string;
    members: MemberFeatures[];
    teamColor: string;
}

interface TeamDataState {
    teamDataArray: TeamData[];
}

const initialState: TeamDataState = {
    teamDataArray: [],
};

const teamDataSlice = createSlice({
    name: 'teamData',
    initialState,
    reducers: {
        setTeamDataArray: (state, action: PayloadAction<TeamData[]>) => {
            state.teamDataArray = action.payload;
        },
        addTeamData: (state, action: PayloadAction<TeamData>) => {
            state.teamDataArray.push(action.payload);
        },
        updateTeamData: (state, action: PayloadAction<TeamData>) => {
            const { teamName, members, teamColor } = action.payload;
            const existingIndex = state.teamDataArray.findIndex(team => team.teamName === teamName);

            if (existingIndex !== -1) {
                state.teamDataArray[existingIndex] = { teamName, members, teamColor };
            } else {
                state.teamDataArray.push({ teamName, members, teamColor });
            }
        },
    },
});

export const { setTeamDataArray, addTeamData, updateTeamData } = teamDataSlice.actions;

export default teamDataSlice.reducer;
