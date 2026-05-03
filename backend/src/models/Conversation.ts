import mongoose, { Schema, Document } from 'mongoose';

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[];
  streamChannelId: string;
  type: 'direct' | 'group';
  name?: string;
  lastMessage?: string;
  lastMessageAt: Date;
  createdAt: Date;
}

const conversationSchema = new Schema<IConversation>({
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  streamChannelId: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['direct', 'group'],
    default: 'direct'
  },
  name: {
    type: String
  },
  lastMessage: {
    type: String
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model<IConversation>('Conversation', conversationSchema);