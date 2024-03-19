// membersContext.tsx
import { createContext, ReactNode, useContext, useState } from 'react';

interface MemberContextProps {
  memberName: string;
  userId: string;
  setMemberInfo: (name: string, id: string) => void;
}

const MemberContext = createContext<MemberContextProps | undefined>(undefined);

export const useMemberIdContext = () => {
  const context = useContext(MemberContext);
  if (!context) {
    throw new Error('useMemberContext must be used within a MemberProvider');
  }
  return context;
};

export const MemberProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [memberName, setMemberName] = useState<string>('');
  const [userId, setUserId] = useState<string>('');

  const setMemberInfo = (name: string, id: string) => {
    setMemberName(name);
    setUserId(id);
  };

  const contextValue: MemberContextProps = {
    memberName,
    userId,
    setMemberInfo,
  };

  return <MemberContext.Provider value={contextValue}>{children}</MemberContext.Provider>;
};
