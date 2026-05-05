// frontend/components/chat/TypingIndicator.tsx
import { useEffect, useState } from 'react';
import { Channel } from 'stream-chat';

export const TypingIndicator = ({ channel }: { channel: Channel }) => {
  const [typing, setTyping] = useState<string[]>([]);

  useEffect(() => {
    const handleTypingStart = (event: any) => {
      if (event.user?.id) {
        setTyping(prev => [...new Set([...prev, event.user.name])]);
      }
    };

    const handleTypingStop = (event: any) => {
      if (event.user?.id) {
        setTyping(prev => prev.filter(name => name !== event.user.name));
      }
    };

    channel.on('typing.start', handleTypingStart);
    channel.on('typing.stop', handleTypingStop);

    return () => {
      channel.off('typing.start', handleTypingStart);
      channel.off('typing.stop', handleTypingStop);
    };
  }, [channel]);

  if (typing.length === 0) return null;

  return (
    <div className="px-4 py-2 text-sm text-gray-500">
      {typing.join(', ')} {typing.length === 1 ? 'is' : 'are'} typing
      <span className="typing-dots">...</span>
    </div>
  );
};