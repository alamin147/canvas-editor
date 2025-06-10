import React, { useState } from 'react';
import { FaUserPlus } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

interface CollaboratorUser {
  socketId: string;
  userId: string;
  username: string;
  userColor: string;
  mousePosition: { x: number, y: number };
  isOnline?: boolean;
}

interface CollaborationPanelProps {
  projectId: string; // Keeping this as it might be needed for future features
  collaborators: CollaboratorUser[];
  onInviteUser: (email: string) => void;
}

const CollaborationPanel: React.FC<CollaborationPanelProps> = ({
  collaborators,
  onInviteUser
}) => {
  const [showPanel, setShowPanel] = useState(false);
  const [email, setEmail] = useState('');

  const handleInvite = () => {
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }

    onInviteUser(email);
    setEmail('');
    toast.success(`Invitation sent to ${email}`);
  };

  return (
    <div className="absolute top-4 right-4 z-20">
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="bg-purple-600 hover:bg-purple-700 text-white rounded-md p-2 flex items-center gap-2 shadow-md"
        title="Manage collaborators"
      >
        <FaUserPlus />
        <span>Collaborators ({collaborators.length})</span>
      </button>

      {showPanel && (
        <div className="absolute top-12 right-0 bg-white rounded-lg shadow-xl p-4 w-72 border border-gray-200">
          <h3 className="font-medium text-lg mb-3 text-gray-800">Project Collaborators</h3>

          <div className="mb-4">
            <div className="flex gap-2 mb-2">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
              />
              <button
                onClick={handleInvite}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
              >
                Invite
              </button>
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Active Users</h4>
            {collaborators.length === 0 ? (
              <p className="text-gray-500 text-sm italic">No active collaborators</p>
            ) : (
              <ul className="space-y-2">
                {collaborators.map((user) => (
                  <li key={user.userId} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: user.userColor }}
                    />
                    <span className="text-sm">{user.username}</span>
                    <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-full ${user.isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                      {user.isOnline ? 'Online' : 'Offline'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaborationPanel;
