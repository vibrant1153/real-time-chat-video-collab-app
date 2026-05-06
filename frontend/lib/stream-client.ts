import { StreamChat } from 'stream-chat';
import { StreamVideoClient } from '@stream-io/video-react-sdk';

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;

let chatClient: StreamChat | null = null;
let videoClient: StreamVideoClient | null = null;

export const initializeChatClient = async (userId: string, userToken: string, userData: any) => {
  if (chatClient) {
    await chatClient.disconnectUser();
  }

  chatClient = StreamChat.getInstance(apiKey);
  
  await chatClient.connectUser(
    {
      id: userId,
      name: userData.fullName,
      image: userData.avatar,
    },
    userToken
  );

  return chatClient;
};

export const initializeVideoClient = (userId: string, userToken: string, userData: any) => {
  if (videoClient) {
    videoClient.disconnectUser();
  }

  videoClient = new StreamVideoClient({
    apiKey,
    user: {
      id: userId,
      name: userData.fullName,
      image: userData.avatar,
    },
    token: userToken,
  });

  return videoClient;
};

export const getChatClient = () => chatClient;
export const getVideoClient = () => videoClient;

export const disconnectClients = async () => {
  if (chatClient) {
    await chatClient.disconnectUser();
    chatClient = null;
  }
  if (videoClient) {
    await videoClient.disconnectUser();
    videoClient = null;
  }
};