'use client';

import { useEffect, useState } from 'react';
import { StreamVideo, StreamVideoClient, StreamCall, PaginatedGridLayout, CallControls, StreamTheme, DeviceSettings } from '@stream-io/video-react-sdk';
import { useAuthStore } from '@/stores/auth.store';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { Phone, Layout } from 'lucide-react';

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;

export default function CallsPage() {
  const { user, streamToken } = useAuthStore();
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<any>(null);
  const [roomId, setRoomId] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !user.streamUserId || !streamToken) return;

    let isComponentMounted = true;
    const client = new StreamVideoClient({
      apiKey,
      user: { 
        id: user.streamUserId, 
        name: user.fullName, 
        image: user.avatar || `https://ui-avatars.com/api/?name=${user.fullName}` 
      },
      token: streamToken,
    });
    
    if (isComponentMounted) {
      setVideoClient(client);
    }

    return () => {
      isComponentMounted = false;
      client.disconnectUser().catch(console.error);
    };
  }, [user?.streamUserId, streamToken]);

  const joinCall = async (idToJoin: string) => {
    if (!videoClient || !idToJoin) return;
    setIsJoining(true);
    setError(null);
    try {
      const callInstance = videoClient.call('default', idToJoin);
      await callInstance.join({ create: true });
      setCall(callInstance);
    } catch (err: any) {
      console.error("Failed to join call", err);
      setError(err.message || "Failed to join the call.");
    } finally {
      setIsJoining(false);
    }
  };

  const createRandomCall = () => {
    const randomId = Math.random().toString(36).substring(2, 9);
    joinCall(randomId);
  };

  const leaveCall = () => {
    if (call) {
      call.leave().catch(console.error);
      setCall(null);
    }
  };

  if (!videoClient) {
    return (
      <div className="flex items-center justify-center h-full bg-transparent">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <div className="text-lg text-slate-600 font-bold tracking-tight animate-pulse">Initializing Video Engine...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-transparent">
      {!call ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="glass-card p-12 max-w-lg w-full shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 via-accent to-primary-600 opacity-50"></div>
            
            <div className="flex flex-col items-center mb-10 text-center">
              <div className="w-20 h-20 bg-primary-50 rounded-3xl flex items-center justify-center mb-6 shadow-inner transition-transform group-hover:scale-110 duration-500">
                <Phone className="w-10 h-10 text-primary-600" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Video Meetings</h2>
              <p className="text-slate-500 font-medium">Connect instantly with high-quality video & audio</p>
            </div>
            
            <button 
              onClick={createRandomCall}
              disabled={isJoining}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold py-4 px-6 rounded-2xl mb-8 transition-all duration-300 shadow-xl shadow-primary-200 hover:shadow-primary-300 transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
            >
              <Layout className="w-5 h-5" />
              {isJoining ? 'Creating Room...' : 'Start New Meeting'}
            </button>
            
            <div className="flex items-center mb-8">
              <div className="flex-1 border-t border-slate-200"></div>
              <span className="px-6 text-[10px] font-black text-slate-400 tracking-widest uppercase">or join by id</span>
              <div className="flex-1 border-t border-slate-200"></div>
            </div>

            <div className="flex gap-3">
              <input 
                type="text" 
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Paste Meeting ID"
                className="flex-1 glass-input rounded-2xl px-5 py-4 text-slate-900 font-semibold focus:outline-none placeholder:text-slate-400 shadow-sm"
              />
              <button 
                onClick={() => joinCall(roomId)}
                disabled={!roomId || isJoining}
                className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-xl shadow-slate-200 transform hover:-translate-y-1 active:scale-95"
              >
                Join
              </button>
            </div>
            
            {error && (
              <div className="mt-8 p-4 bg-red-50/50 border border-red-100 rounded-2xl text-red-600 text-sm font-semibold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                {error}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col h-full bg-slate-950">
          <div className="bg-slate-900/90 backdrop-blur-xl p-4 flex justify-between items-center border-b border-white/5 z-20">
            <div className="flex items-center gap-4">
              <div className="bg-primary-600/20 px-3 py-1.5 rounded-full flex items-center gap-2 border border-primary-500/30">
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold text-primary-400 uppercase tracking-widest">Live Room</span>
              </div>
              <div className="font-mono text-sm px-4 py-1.5 rounded-xl bg-white/5 text-slate-300 border border-white/10">
                ID: <span className="text-white font-bold select-all">{call.id}</span>
              </div>
            </div>
            <button 
              onClick={leaveCall}
              className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 border border-red-500/20"
            >
              End Session
            </button>
          </div>
          <div className="flex-1 relative h-full w-full">
            <StreamVideo client={videoClient}>
              <StreamCall call={call}>
                <StreamTheme className="str-video" style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div className="absolute top-6 right-6 z-[60]">
                    <DeviceSettings />
                  </div>
                  <div className="flex-1 w-full h-full relative">
                    <PaginatedGridLayout />
                  </div>
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50">
                    <CallControls onLeave={() => setCall(null)} />
                  </div>
                </StreamTheme>
              </StreamCall>
            </StreamVideo>
          </div>
        </div>
      )}
    </div>
  );
}