// frontend/components/chat/UserList.tsx
'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/api-client';
import { Avatar } from '@/components/ui/Avatar';
import { Spinner } from '@/components/ui/Spinner';

interface User {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  isOnline: boolean;
}

export const UserList = ({ onSelectUser }: { onSelectUser: (user: User) => void }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get('/users');
      setUsers(response.data.users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(search.toLowerCase()) ||
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      
      <div className="space-y-2">
        {filteredUsers.map((user) => (
          <button
            key={user.id}
            onClick={() => onSelectUser(user)}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition"
          >
            <div className="relative">
              <Avatar src={user.avatar} alt={user.fullName} size="md" />
              {user.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-gray-900">{user.fullName}</p>
              <p className="text-sm text-gray-500">@{user.username}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};