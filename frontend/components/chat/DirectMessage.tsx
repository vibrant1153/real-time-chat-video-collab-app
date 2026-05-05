// frontend/components/chat/DirectMessage.tsx
import { useEffect, useState } from 'react';
import apiClient from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth.store';

export const createDirectMessage = async (targetUserId: string) => {
  try {
    const response = await apiClient.post('/stream/channel', {
      participantIds: [targetUserId],
      type: 'messaging'
    });
    
    return response.data.channel;
  } catch (error) {
    console.error('Failed to create channel:', error);
    throw error;
  }
};