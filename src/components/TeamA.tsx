import React from 'react';

const TeamA: React.FC = () => {
  return (
    <div className="flex flex-col -mt-70 ">
      <div className="flex items-center mb-2">
        <div className="bg-red-500 text-white rounded-md p-2 w-8 h-8 mr-2 flex items-center justify-center">
          A
        </div>
        <div>
          <div className="text-sm  ">Team A</div>
          <div className="text-xs " style={{ color: '#708090' }}>9 minutes</div>
        </div>
      </div>
    </div>
  );
};

export default TeamA;
