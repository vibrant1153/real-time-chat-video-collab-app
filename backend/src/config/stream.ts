import { StreamChat } from 'stream-chat';
import dotenv from 'dotenv'

const apiKey = process.env.STREAM_API_KEY!;
const apiSecret = process.env.STREAM_API_SECRET!;

// Initialize Stream Chat server client
export const serverClient = StreamChat.getInstance(apiKey, apiSecret);

// Generate Stream user token
export const generateStreamToken = (userId: string): string => {
  return serverClient.createToken(userId);
};

// Create or update Stream user
export const upsertStreamUser = async (user: {
  id: string;
  name: string;
  email: string;
  image?: string;
}) => {
  await serverClient.upsertUser({
    id: user.id,
    name: user.name,
    email : user.email,
    image: user.image || `https://ui-avatars.com/api/?name=${user.name}`,
  } as any);
};