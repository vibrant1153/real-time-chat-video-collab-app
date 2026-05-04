import type { Request, Response } from 'express';
import { serverClient } from '../config/stream.js';
import User from '../models/User.js';
import Conversation from '../models/Conversation.js';

export const createChannel = async (req: Request, res: Response) => {
  try {
    const currentUserId = (req as any).userId;
    const { participantIds, type = 'messaging', name } = req.body;

    // Get current user
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get all participants
    const participants = await User.find({
      _id: { $in: participantIds }
    });

    if (participants.length !== participantIds.length) {
      return res.status(400).json({ message: 'Some participants not found' });
    }

    // Create channel ID
    const allUserIds = [currentUser.streamUserId, ...participants.map(p => p.streamUserId)].sort();
    const channelId = type === 'messaging' 
      ? `direct_${allUserIds.join('_')}`
      : `group_${Date.now()}`;

    // Create channel in Stream
    const channel = serverClient.channel(type, channelId, {
      name: name || participants.map(p => p.fullName).join(', '),
      members: [currentUser.streamUserId, ...participants.map(p => p.streamUserId)],
      created_by_id: currentUser.streamUserId
    } as any);

    await channel.create();

    // Save conversation in MongoDB
    const conversation = await Conversation.create({
      participants: [currentUserId, ...participantIds],
      streamChannelId: channelId,
      type: type === 'messaging' ? 'direct' : 'group',
      name: name
    });

    res.status(201).json({
      message: 'Channel created successfully',
      channel: {
        id: channelId,
        type: type,
        conversationId: conversation._id
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createCall = async (req: Request, res: Response) => {
  try {
    const currentUserId = (req as any).userId;
    const { participantIds, callType = 'default' } = req.body;

    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const participants = await User.find({
      _id: { $in: participantIds }
    });

    const callId = `call_${Date.now()}_${currentUser.streamUserId}`;

    res.json({
      message: 'Call created',
      call: {
        id: callId,
        type: callType,
        participants: participants.map(p => ({
          id: p._id,
          streamUserId: p.streamUserId,
          fullName: p.fullName,
          avatar: p.avatar
        }))
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};