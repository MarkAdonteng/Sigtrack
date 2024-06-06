import React, { createContext, useReducer, useContext, useEffect, ReactNode } from 'react';

export interface MemberFeatures {
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

interface State {
    teamDataArray: TeamData[];
}

interface Action {
    type: string;
    payload: any;
}

const initialState: State = {
    teamDataArray: [],
};

export const actionTypes = {
    SET_TEAM_DATA: 'SET_TEAM_DATA',
    REMOVE_TEAM_DATA: 'REMOVE_TEAM_DATA',
    ADD_TEAM_DATA: 'ADD_TEAM_DATA', // New action type for adding team data
};

const teamDataReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case actionTypes.SET_TEAM_DATA:
            return { ...state, teamDataArray: action.payload };
        case actionTypes.REMOVE_TEAM_DATA:
            return { ...state, teamDataArray: state.teamDataArray.filter(team => team.teamName !== action.payload) };
        case actionTypes.ADD_TEAM_DATA: {
            const existingTeamIndex = state.teamDataArray.findIndex(team => team.teamName === action.payload.teamName);
            if (existingTeamIndex !== -1) {
                // Update the existing team data
                const updatedTeamDataArray = state.teamDataArray.map((team, index) =>
                    index === existingTeamIndex ? action.payload : team
                );
                return { ...state, teamDataArray: updatedTeamDataArray };
            }
            return { ...state, teamDataArray: [...state.teamDataArray, action.payload] };
        }
        default:
            return state;
    }
};

const TeamDataContext = createContext<{ state: State; dispatch: React.Dispatch<Action> }>({
    state: initialState,
    dispatch: () => null,
});

interface TeamDataProviderProps {
    children: ReactNode;
}

export const TeamDataProvider: React.FC<TeamDataProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(teamDataReducer, initialState);

    useEffect(() => {
        const storedData = localStorage.getItem('teamDataArray');
        if (storedData) {
            dispatch({ type: actionTypes.SET_TEAM_DATA, payload: JSON.parse(storedData) });
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('teamDataArray', JSON.stringify(state.teamDataArray));
    }, [state.teamDataArray]);

    return (
        <TeamDataContext.Provider value={{ state, dispatch }}>
            {children}
        </TeamDataContext.Provider>
    );
};

export const useTeamDataContext = () => {
    return useContext(TeamDataContext);
};
