import type { Request, Response } from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { generateStreamToken, upsertStreamUser } from '../config/stream.js';


const JWT_SECRET = process.env.JWT_SECRET!;

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, username, fullName } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email or username already exists' 
      });
    }

    // Create stream user ID (alphanumeric, underscores, and dashes only)
    const sanitizedUsername = username.replace(/[^a-zA-Z0-9_-]/g, '');
    const streamUserId = `user_${Date.now()}_${sanitizedUsername}`;

    // Create user in MongoDB
    const user = await User.create({
      email,
      password,
      username,
      fullName,
      streamUserId,
      avatar: `https://ui-avatars.com/api/?name=${fullName}`
    });

    // Create user in Stream
    await upsertStreamUser({
      id: streamUserId,
      name: fullName,
      email: email,
      ...(user.avatar && { image: user.avatar }),
    });

    // Generate tokens
    const jwtToken = jwt.sign({ userId: user._id }, JWT_SECRET, { 
      expiresIn: '7d' 
    });
    const streamToken = generateStreamToken(streamUserId);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        avatar: user.avatar,
        streamUserId: user.streamUserId
      },
      tokens: {
        jwtToken,
        streamToken
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};



export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check and fix invalid streamUserId
    if (/[^a-zA-Z0-9_-]/.test(user.streamUserId)) {
      const sanitizedId = user.streamUserId.replace(/[^a-zA-Z0-9_-]/g, '_');
      user.streamUserId = sanitizedId;
      await upsertStreamUser({
        id: sanitizedId,
        name: user.fullName,
        email: user.email,
        ...(user.avatar && { image: user.avatar }),
      });
    }

    // Update user status
    user.isOnline = true;
    await user.save();

    // Generate tokens
    const jwtToken = jwt.sign({ userId: user._id }, JWT_SECRET, { 
      expiresIn: '7d' 
    });
    const streamToken = generateStreamToken(user.streamUserId);

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        avatar: user.avatar,
        streamUserId: user.streamUserId
      },
      tokens: {
        jwtToken,
        streamToken
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};



export const logout = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    
    await User.findByIdAndUpdate(userId, {
      isOnline: false,
      lastSeen: new Date()
    });

    res.json({ message: 'Logout successful' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};



export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (/[^a-zA-Z0-9_-]/.test(user.streamUserId)) {
      const sanitizedId = user.streamUserId.replace(/[^a-zA-Z0-9_-]/g, '_');
      user.streamUserId = sanitizedId;
      await upsertStreamUser({
        id: sanitizedId,
        name: user.fullName,
        email: user.email,
        ...(user.avatar && { image: user.avatar }),
      });
      await user.save();
    }

    const streamToken = generateStreamToken(user.streamUserId);

    res.json({
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        avatar: user.avatar,
        streamUserId: user.streamUserId,
        isOnline: user.isOnline
      },
      streamToken
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


