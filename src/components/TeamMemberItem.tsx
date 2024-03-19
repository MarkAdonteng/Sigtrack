import React, { useState, useRef, useEffect } from 'react';

export type TeamMemberModel = {
  lat: string;
  lng: string;
  id: number;
  name: string;
  username: string;
};

const TeamMemberItem: React.FC<TeamMemberModel> = (teamMemberItemProps: TeamMemberModel) => {
  const [isClicked, setIsClicked] = useState(false);
  const [textInput, setTextInput] = useState('');
  const icon = teamMemberItemProps.name.charAt(0).toUpperCase();
  const popupRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    setIsClicked(!isClicked);
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextInput(event.target.value);
  };

  const handleDocumentClick = (event: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      setIsClicked(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleDocumentClick);

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, []);

  return (
    <div className={`relative ${isClicked ? 'selected' : ''}`}>
      <h1 className="-mt-80 fixed font-bold text-primary-text -ml-32">Team Members</h1>
      <div className="left-44 top-0 mt-24 fixed font-semibold text-primary-text mb-4 flex items-center justify-center">
        <div className={`bg-red-500 text-white rounded-md p-2 w-8 h-8 mr-2 flex items-center justify-center group cursor-pointer ${isClicked ? 'group-selected' : ''}`} onClick={handleClick}>
          {icon}
        </div>
        <div>
          <div className="text-sm relative">
            <span className={`inline-block relative cursor-pointer group ${isClicked ? 'group-selected' : ''}`} onClick={handleClick}>
              {teamMemberItemProps.name}
            </span>
            {isClicked && (
              <div ref={popupRef} className="absolute w-72 top-0 left-60 text-black bg-white border border-gray-300 p-2 rounded whitespace-pre">
                <div>
                  Name: {teamMemberItemProps.name} <br />
                  Call Sign: {teamMemberItemProps.username}
                </div>
                <div className="mt-2">
                  <label htmlFor="textBox">Additional Information:</label>
                  <input
                    type="text"
                    id="textBox"
                    value={textInput}
                    onChange={handleTextChange}
                    className="border border-gray-300 p-1 rounded w-28"
                  />
                </div>
              </div>
            )}
          </div>
          <div className={`text-xs ${isClicked ? 'opacity-100' : ''}`} style={{ color: '#708090' }}>
            {teamMemberItemProps.lat} minutes
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberItem;
