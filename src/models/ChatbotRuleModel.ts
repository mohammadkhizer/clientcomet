
import mongoose, { Schema, Document, models, Model } from 'mongoose';
import type { ChatbotRule as ChatbotRuleType } from '@/types';

export interface IChatbotRule extends Omit<ChatbotRuleType, 'id' | 'createdAt' | 'updatedAt'>, Document {
  createdAt: Date;
  updatedAt: Date;
}

const ChatbotRuleSchema: Schema = new Schema({
  keywords: {
    type: [String],
    required: true,
    validate: [ (val: string[]) => val.length > 0, 'Keywords array cannot be empty']
  },
  response: { type: String, required: true },
  priority: { type: Number, default: 10 }, // Lower number means higher priority
}, { timestamps: true });

// Ensure keywords are stored as lowercase and trimmed for consistent matching
ChatbotRuleSchema.pre('save', function(next) {
  if (this.isModified('keywords')) {
    this.keywords = this.keywords.map(kw => kw.toLowerCase().trim()).filter(kw => kw.length > 0);
  }
  next();
});


const ChatbotRuleModel = (models.ChatbotRule as Model<IChatbotRule>) || mongoose.model<IChatbotRule>('ChatbotRule', ChatbotRuleSchema);

export default ChatbotRuleModel;
