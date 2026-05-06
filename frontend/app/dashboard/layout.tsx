'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth.store';
import { MessageSquare, Phone, LogOut, User as UserIcon, Layout, Edit3 } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { disconnectClients } from '@/lib/stream-client';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await disconnectClients();
      clearAuth();
      router.push('/auth/login');
    }
  };

  if (!isMounted || !isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden relative font-sans antialiased text-slate-900">
      <div className="bg-mesh" />
      
      {/* Sidebar */}
      <aside className="w-72 m-4 mr-0 rounded-3xl glass-panel flex flex-col z-10 transition-all duration-300 ease-in-out">
        <div className="p-8 border-b border-white/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gradient-to-br from-primary-500 to-accent shadow-lg flex items-center justify-center p-0.5">
              <div className="w-full h-full rounded-[14px] overflow-hidden bg-white">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-full h-full p-2 text-primary-500" />
                )}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-slate-900 truncate tracking-tight">{user.fullName}</h2>
              <p className="text-[10px] text-slate-500 font-medium truncate -mt-0.5 mb-1">@{user.username}</p>
              <p className="text-xs font-semibold text-primary-600 truncate uppercase tracking-widest opacity-70">Online</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-3">
          <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Communication</div>
          
          <Link
            href="/dashboard/chat"
            className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-200 group ${
              pathname === '/dashboard/chat'
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                : 'text-slate-600 hover:bg-white/50 hover:text-primary-600'
            }`}
          >
            <MessageSquare className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${pathname === '/dashboard/chat' ? 'text-white' : 'text-slate-400 group-hover:text-primary-500'}`} />
            <span className="font-semibold text-sm">Messages</span>
          </Link>

          <Link
            href="/dashboard/calls"
            className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-200 group ${
              pathname === '/dashboard/calls'
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                : 'text-slate-600 hover:bg-white/50 hover:text-primary-600'
            }`}
          >
            <Phone className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${pathname === '/dashboard/calls' ? 'text-white' : 'text-slate-400 group-hover:text-primary-500'}`} />
            <span className="font-semibold text-sm">Video Calls</span>
          </Link>

          <div className="px-3 pt-6 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tools</div>

          <Link
            href="/dashboard/board"
            className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-200 group ${
              pathname === '/dashboard/board'
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                : 'text-slate-600 hover:bg-white/50 hover:text-primary-600'
            }`}
          >
            <Edit3 className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${pathname === '/dashboard/board' ? 'text-white' : 'text-slate-400 group-hover:text-primary-500'}`} />
            <span className="font-semibold text-sm">Whiteboard</span>
          </Link>
        </nav>

        <div className="p-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-5 py-4 w-full rounded-2xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 font-semibold text-sm group"
          >
            <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-hidden relative">
        <div className="w-full h-full rounded-3xl glass-panel overflow-hidden shadow-2xl border-white/40">
          {children}
        </div>
      </main>
    </div>
  );
}
