'use client';

import { useEffect, useState } from 'react';
import {
  Chat, Channel, ChannelHeader, MessageList, MessageInput, Window, Thread,
  ChannelList, useChatContext,
} from 'stream-chat-react';
import { StreamChat } from 'stream-chat';
import { useAuthStore } from '@/stores/auth.store';
import apiClient from '@/lib/api-client';
import 'stream-chat-react/dist/css/v2/index.css';
import { MessageSquare, Search, X, Loader2 } from 'lucide-react';

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;

// ─── Module-level connection lock ────────────────────────────────────────────
// Prevents React StrictMode's double-invoke from firing two concurrent
// connectUser() calls on the same singleton, which causes "token not set" errors.
let connectionPromise: Promise<StreamChat> | null = null;

async function getConnectedClient(
  streamUserId: string,
  fullName: string,
  avatar: string,
  streamToken: string
): Promise<StreamChat> {
  const client = StreamChat.getInstance(apiKey);

  // Already connected as this exact user — return immediately
  if (client.userID === streamUserId) return client;

  // Another call is already in flight — wait for it instead of racing
  if (connectionPromise) return connectionPromise;

  connectionPromise = (async () => {
    try {
      if (client.userID) await client.disconnectUser();
      await client.connectUser({ id: streamUserId, name: fullName, image: avatar }, streamToken);
      return client;
    } catch (err) {
      connectionPromise = null; // allow retry on failure
      throw err;
    }
  })();

  const result = await connectionPromise;
  connectionPromise = null;
  return result;
}

// ─── Inner component: has access to Stream's Chat Context ────────────────────
function ChatInner({ user }: { user: any }) {
  const { client, setActiveChannel, channel: activeChannel } = useChatContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isStartingChat, setIsStartingChat] = useState(false);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await apiClient.get(`/users/search?query=${encodeURIComponent(searchQuery)}`);
        setSearchResults(res.data.users || []);
      } catch (e) {
        console.error('Search failed', e);
      } finally {
        setIsSearching(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const startDirectMessage = async (targetUser: any) => {
    setIsStartingChat(true);
    try {
      await apiClient.post('/users/upsert-stream', { userId: targetUser._id });

      const channelId = [user.streamUserId, targetUser.streamUserId].sort().join('__');
      const newChannel = client.channel('messaging', channelId, {
        members: [user.streamUserId, targetUser.streamUserId],
      });
      await newChannel.watch();
      setActiveChannel(newChannel);
      setSearchQuery('');
      setSearchResults([]);
    } catch (err: any) {
      console.error('Failed to create channel:', err);
    } finally {
      setIsStartingChat(false);
    }
  };

  return (
    <div className="h-full flex bg-transparent overflow-hidden">
      {/* ── Left Sidebar ─────────────────────────────── */}
      <div className="w-80 flex-shrink-0 flex flex-col bg-white/40 backdrop-blur-sm border-r border-slate-200/50 overflow-hidden">
        <div className="p-4 border-b border-slate-200/50">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3">New Message</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or username..."
              className="w-full pl-9 pr-9 py-2.5 glass-input rounded-xl text-slate-900 font-medium text-sm focus:outline-none placeholder:text-slate-400"
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(''); setSearchResults([]); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {searchQuery && (
            <div className="mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden max-h-52 overflow-y-auto">
              {isSearching ? (
                <div className="flex items-center justify-center gap-2 p-4 text-slate-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm font-medium">Searching...</span>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-4 text-center text-sm text-slate-400 font-medium">No users found</div>
              ) : (
                searchResults.map((u) => (
                  <button
                    key={u._id}
                    onClick={() => startDirectMessage(u)}
                    disabled={isStartingChat}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary-50 transition-colors text-left disabled:opacity-50"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                      {u.avatar
                        ? <img src={u.avatar} alt={u.fullName} className="w-full h-full object-cover" />
                        : <span className="text-primary-600 font-bold text-xs">{u.fullName?.[0]?.toUpperCase()}</span>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-slate-900 truncate">{u.fullName}</div>
                      <div className="text-xs text-slate-400 truncate">@{u.username}</div>
                    </div>
                    {isStartingChat && <Loader2 className="w-3 h-3 animate-spin text-primary-500" />}
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="px-4 pt-3 pb-1">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Recent Chats</h2>
          </div>
          {/* ChannelList manages its own active channel through context — no onSelect needed */}
          <ChannelList
            filters={{ type: 'messaging', members: { $in: [user.streamUserId] } }}
            sort={{ last_message_at: -1 }}
          />
        </div>
      </div>

      {/* ── Right: Chat Area ──────────────────────────── */}
      <div className="flex-1 flex flex-col bg-white/20 overflow-hidden min-w-0">
        {activeChannel ? (
          // No `channel` prop — reads active channel from the same context ChannelList writes to
          <Channel>
            <Window>
              <div className="border-b border-slate-200/50 bg-white/60 backdrop-blur-md">
                <ChannelHeader />
              </div>
              <div className="flex-1 overflow-y-auto">
                <MessageList />
              </div>
              <div className="p-4 bg-white/60 backdrop-blur-md border-t border-slate-200/50">
                <MessageInput focus />
              </div>
            </Window>
            <Thread />
          </Channel>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 h-full">
            <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mb-6 shadow-inner opacity-60">
              <MessageSquare className="w-10 h-10 text-primary-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Your Inbox</h3>
            <p className="text-slate-500 font-medium max-w-xs leading-relaxed">
              Search for a teammate above or select a conversation from the sidebar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Outer component: manages Stream connection ───────────────────────────────
export default function ChatPage() {
  const { user, streamToken } = useAuthStore();
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.streamUserId || !streamToken) return;
    let cancelled = false;

    getConnectedClient(
      user.streamUserId,
      user.fullName,
      user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}`,
      streamToken
    )
      .then((client) => { if (!cancelled) setChatClient(client); })
      .catch((err) => { if (!cancelled) setError(err.message || 'Failed to connect to chat'); });

    return () => { cancelled = true; };
  }, [user?.streamUserId, streamToken]); // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-transparent p-12">
        <div className="glass-card p-10 max-w-lg w-full text-center shadow-2xl">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-8 h-8 bg-red-500 rounded-full animate-pulse"></div>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-4">Connection Error</h2>
          <p className="text-slate-600 font-medium mb-6 leading-relaxed">{error}</p>
          <button onClick={() => window.location.reload()} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-primary-200">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!chatClient) {
    return (
      <div className="flex items-center justify-center h-full bg-transparent">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <div className="text-lg text-slate-600 font-bold tracking-tight animate-pulse">Connecting to Chat...</div>
        </div>
      </div>
    );
  }

  return (
    <Chat client={chatClient} theme="str-chat__theme-light">
      <ChatInner user={user} />
    </Chat>
  );
}