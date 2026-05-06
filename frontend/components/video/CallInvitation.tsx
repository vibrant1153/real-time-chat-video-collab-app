// frontend/components/video/CallInvitation.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import apiClient from '@/lib/api-client';

interface CallInvitationProps {
  recipientId: string;
  recipientName: string;
  onCallStarted: (callId: string) => void;
}

export const CallInvitation = ({ 
  recipientId, 
  recipientName, 
  onCallStarted 
}: CallInvitationProps) => {
  const [calling, setCalling] = useState(false);

  const startCall = async () => {
    setCalling(true);
    try {
      const response = await apiClient.post('/stream/call', {
        participantIds: [recipientId],
        callType: 'default'
      });

      onCallStarted(response.data.call.id);
    } catch (error) {
      console.error('Failed to start call:', error);
    } finally {
      setCalling(false);
    }
  };

  return (
    <Button onClick={startCall} disabled={calling} variant="primary">
      {calling ? 'Calling...' : `📞 Call ${recipientName}`}
    </Button>
  );
};