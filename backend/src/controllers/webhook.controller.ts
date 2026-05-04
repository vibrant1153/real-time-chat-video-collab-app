// backend/src/controllers/webhook.controller.ts
import type { Request, Response } from 'express';
import Conversation from '../models/Conversation.js';

export const handleStreamWebhook = async (req: Request, res: Response) => {
  const { type, message, channel } = req.body;

  try {
    switch (type) {
      case 'message.new':
        // Update last message in conversation
        await Conversation.findOneAndUpdate(
          { streamChannelId: channel.id },
          { 
            lastMessage: message.text,
            lastMessageAt: new Date(message.created_at)
          }
        );
        break;
      
      // Add more webhook handlers as needed
    }

    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};