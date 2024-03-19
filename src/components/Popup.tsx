// MemberPopup.tsx
import React, { useEffect, useState } from 'react';

interface MemberPopupProps {
  memberName: string;
  dateCreated: string;
  onClose: () => void;
}

const MemberPopup: React.FC<MemberPopupProps> = ({ memberName, dateCreated, onClose }) => {
  const [textFieldValue, setTextFieldValue] = useState('');
  const [isMouseOverPopup, setIsMouseOverPopup] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (!isMouseOverPopup) {
      timer = setTimeout(() => {
        onClose();
      }, 5000);
    }

    return () => clearTimeout(timer);
  }, [isMouseOverPopup, onClose]);

  const handleMouseEnter = () => {
    setIsMouseOverPopup(true);
  };

  const handleMouseLeave = () => {
    setIsMouseOverPopup(false);
  };

  return (
    <div className="popup h-36" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="popup-content">
        <p>{`Details for ${memberName}`}</p>

        {/* Text Field with Label */}
        <div className="mb-4">
          <label htmlFor="textField" className="block text-sm font-medium text-gray-700">
            Custom Label:
          </label>
          <input
            type="text"
            id="textField"
            className="mt-1 p-2 border rounded-md w-full"
            value={textFieldValue}
            onChange={(e) => setTextFieldValue(e.target.value)}
          />
        </div>

        {/* Add additional details or content as needed */}
      </div>
    </div>
  );
};

export default MemberPopup;