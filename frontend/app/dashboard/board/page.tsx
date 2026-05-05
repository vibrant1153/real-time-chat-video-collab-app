'use client';

import { Tldraw } from 'tldraw';
import 'tldraw/tldraw.css';

export default function BoardPage() {
  return (
    <div className="h-full w-full bg-white flex flex-col">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white/80 backdrop-blur-md z-10">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Whiteboard</h1>
          <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Your creative space</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-[10px] font-bold uppercase tracking-wider">Draft Mode</span>
        </div>
      </div>
      <div className="flex-1 relative">
        <Tldraw 
          inferDarkMode={false}
          autoFocus={true}
        />
      </div>
    </div>
  );
}
