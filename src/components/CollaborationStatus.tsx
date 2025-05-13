
import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Users } from 'lucide-react';

interface User {
  id: string;
  name: string;
  color: string;
}

interface CollaborationStatusProps {
  users: User[];
}

const CollaborationStatus = ({ users }: CollaborationStatusProps) => {
  if (!users.length) return null;

  const displayUsers = users.slice(0, 3);
  const additionalUsersCount = Math.max(0, users.length - 3);

  return (
    <div className="flex items-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center border rounded-full px-3 py-1 bg-white dark:bg-gray-800 shadow-sm">
            <div className="flex -space-x-2 mr-2">
              {displayUsers.map((user) => (
                <div
                  key={user.id}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-medium"
                  style={{ backgroundColor: user.color }}
                >
                  {user.name.charAt(0)}
                </div>
              ))}
              
              {additionalUsersCount > 0 && (
                <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs text-gray-800 dark:text-white font-medium">
                  +{additionalUsersCount}
                </div>
              )}
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-300 flex items-center">
              <Users className="h-3 w-3 mr-1" />
              {users.length}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            {users.map((user) => (
              <div key={user.id} className="flex items-center mb-1">
                <div
                  className="w-3 h-3 rounded-full mr-1"
                  style={{ backgroundColor: user.color }}
                />
                <span>{user.name}</span>
              </div>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default CollaborationStatus;
