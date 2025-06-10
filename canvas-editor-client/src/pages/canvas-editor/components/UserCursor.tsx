import React from 'react';

interface CursorProps {
  position: { x: number, y: number };
  username: string;
  color: string;
}

const UserCursor: React.FC<CursorProps> = ({ position, username, color }) => {
  return (
    <div
      className="absolute pointer-events-none z-50 select-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-4px, -4px)'
      }}
    >
      {/* Cursor icon */}
      <svg
        width="24"
        height="36"
        viewBox="0 0 24 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: `drop-shadow(0px 2px 4px rgba(0,0,0,0.2))`,
          transformOrigin: '0 0'
        }}
      >
        <path
          d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
          fill={color}
          stroke="white"
        />
      </svg>

      {/* Username label */}
      <div
        className="absolute left-5 top-0 rounded px-2 py-1 text-xs font-medium whitespace-nowrap"
        style={{
          backgroundColor: color,
          color: 'white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        {username}
      </div>
    </div>
  );
};

export default UserCursor;
