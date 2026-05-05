// frontend/components/chat/ChatLayout.tsx
'use client';

import { useState } from 'react';
import { UserList } from './UserList';
import { ChatWindow } from './ChatWindow';

export const ChatLayout = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          <UserList onSelectUser={setSelectedUser} />
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1">
        {selectedUser ? (
          <ChatWindow user={selectedUser} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};