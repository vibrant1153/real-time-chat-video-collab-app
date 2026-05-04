import type { Request, Response } from 'express';
import User from '../models/User.js';
import { upsertStreamUser } from '../config/stream.js';

export const upsertStreamUserEndpoint = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: 'userId is required' });

    const targetUser = await User.findById(userId).select('-password');
    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    await upsertStreamUser({
      id: targetUser.streamUserId,
      name: targetUser.fullName,
      email: targetUser.email,
      image: targetUser.avatar || `https://ui-avatars.com/api/?name=${targetUser.fullName}`,
    });

    res.json({ message: 'User upserted to Stream successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const currentUserId = (req as any).userId;
    
    const users = await User.find({ 
      _id: { $ne: currentUserId } 
    }).select('-password');

    res.json({ users });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const searchUsers = async (req: Request, res: Response) => {
  try {
  const { query } = req.query;
  const currentUserId = (req as any).userId;

  if (!query) {
    return res.status(400).json({ message: 'Query is required' });
  }

  const escapeRegex = (text: string) =>
    text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const safeQuery = escapeRegex(query as string);

  const users = await User.find({
    _id: { $ne: currentUserId },
    $or: [
      { username: { $regex: safeQuery, $options: 'i' } },
      { fullName: { $regex: safeQuery, $options: 'i' } },
      { email: { $regex: safeQuery, $options: 'i' } }
    ]
  })
    .select('-password')
    .limit(10);

  res.json({ users });

} catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};