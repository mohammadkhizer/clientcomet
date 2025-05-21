
'use server';
import dbConnect from '@/lib/dbConnect';
import ChatbotRuleModel, { type IChatbotRule } from '@/models/ChatbotRuleModel';
import type { ChatbotRule, CreateChatbotRuleData } from '@/types';

function docToChatbotRule(doc: IChatbotRule | any): ChatbotRule {
  const plainDoc = doc && typeof doc.toObject === 'function' ? doc.toObject({ virtuals: true, getters: true }) : { ...doc };
  return {
    id: plainDoc._id ? plainDoc._id.toString() : plainDoc.id,
    keywords: plainDoc.keywords,
    response: plainDoc.response,
    priority: plainDoc.priority,
    createdAt: plainDoc.createdAt ? new Date(plainDoc.createdAt).toISOString() : undefined,
    updatedAt: plainDoc.updatedAt ? new Date(plainDoc.updatedAt).toISOString() : undefined,
  };
}

export async function getChatbotRules(): Promise<ChatbotRule[]> {
  try {
    await dbConnect();
    const rulesDocs = await ChatbotRuleModel.find({}).sort({ priority: 1, createdAt: -1 }).lean(); // Sort by priority then by creation date
    return rulesDocs.map(docToChatbotRule);
  } catch (error) {
    console.error('Error fetching chatbot rules:', error);
    throw new Error(`Failed to fetch chatbot rules. ${(error as Error).message}`);
  }
}

export async function getChatbotRuleById(id: string): Promise<ChatbotRule | null> {
  try {
    await dbConnect();
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.warn(`Invalid chatbot rule ID format: ${id}`);
      return null;
    }
    const ruleDoc = await ChatbotRuleModel.findById(id).lean();
    if (!ruleDoc) return null;
    return docToChatbotRule(ruleDoc);
  } catch (error) {
    console.error(`Error fetching chatbot rule by ID ${id}:`, error);
    throw new Error(`Failed to fetch chatbot rule ${id}. ${(error as Error).message}`);
  }
}

export async function addChatbotRule(data: CreateChatbotRuleData): Promise<ChatbotRule> {
  try {
    await dbConnect();
    const newRuleDoc = new ChatbotRuleModel({
      ...data,
      keywords: data.keywords.map(kw => kw.toLowerCase().trim()).filter(kw => kw.length > 0),
    });
    const savedRule = await newRuleDoc.save();
    return docToChatbotRule(savedRule);
  } catch (error) {
    console.error('Error adding chatbot rule:', error);
    if (error instanceof Error && error.name === 'ValidationError') {
      throw new Error(`Validation failed: ${(error as any).message}`);
    }
    throw new Error(`Failed to add chatbot rule. ${(error as Error).message}`);
  }
}

export async function updateChatbotRule(id: string, updates: Partial<CreateChatbotRuleData>): Promise<ChatbotRule | null> {
  try {
    await dbConnect();
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.warn(`Invalid chatbot rule ID format for update: ${id}`);
      throw new Error('Invalid chatbot rule ID format for update.');
    }
    if (updates.keywords) {
        updates.keywords = updates.keywords.map(kw => kw.toLowerCase().trim()).filter(kw => kw.length > 0);
    }
    const updatedRuleDoc = await ChatbotRuleModel.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!updatedRuleDoc) return null;
    return docToChatbotRule(updatedRuleDoc);
  } catch (error) {
    console.error(`Error updating chatbot rule ${id}:`, error);
    if (error instanceof Error && error.name === 'ValidationError') {
      throw new Error(`Validation failed: ${(error as any).message}`);
    }
    throw new Error(`Failed to update chatbot rule ${id}. ${(error as Error).message}`);
  }
}

export async function deleteChatbotRule(id: string): Promise<boolean> {
  try {
    await dbConnect();
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.warn(`Invalid chatbot rule ID format for delete: ${id}`);
      throw new Error('Invalid chatbot rule ID format for delete.');
    }
    const result = await ChatbotRuleModel.findByIdAndDelete(id);
    return !!result;
  } catch (error) {
    console.error(`Error deleting chatbot rule ${id}:`, error);
    throw new Error(`Failed to delete chatbot rule ${id}. ${(error as Error).message}`);
  }
}
