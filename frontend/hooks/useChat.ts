// frontend/hooks/useChat.ts
import { useState, useEffect } from 'react';
import { StreamChat, Channel } from 'stream-chat';

export const useChat = (client: StreamChat | null, channelId: string) => {
  const [channel, setChannel] = useState<Channel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!client) return;

    const initChannel = async () => {
      try {
        const ch = client.channel('messaging', channelId);
        await ch.watch();
        setChannel(ch);
      } catch (error) {
        console.error('Channel init error:', error);
      } finally {
        setLoading(false);
      }
    };

    initChannel();
  }, [client, channelId]);

  return { channel, loading };
};