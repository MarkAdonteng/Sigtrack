// src/context/SelectedMembersContext.tsx

import React, { createContext, useContext, ReactNode, useReducer } from 'react';

// Define action types
type ActionType = 
  | { type: 'SET_SELECTED_MEMBERS', payload: string | null };

// Define reducer function
const selectedMembersReducer = (state: string | null, action: ActionType): string | null => {
  switch (action.type) {
    case 'SET_SELECTED_MEMBERS':
      return action.payload;
    default:
      return state;
  }
};

interface SelectedMembersContextProps {
  selectedMembers: string | null;
  dispatch: React.Dispatch<ActionType>;
}

const SelectedMembersContext = createContext<SelectedMembersContextProps | undefined>(undefined);

export const SelectedMembersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedMembers, dispatch] = useReducer(selectedMembersReducer, null);

  return (
    <SelectedMembersContext.Provider value={{ selectedMembers, dispatch }}>
      {children}
    </SelectedMembersContext.Provider>
  );
};

export const useSelectedMembers = () => {
  const context = useContext(SelectedMembersContext);
  if (!context) {
    throw new Error('useSelectedMembers must be used within a SelectedMembersProvider');
  }
  return context;
};
