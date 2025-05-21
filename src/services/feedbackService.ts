
'use server';
import dbConnect from '@/lib/dbConnect';
import FeedbackModel, { type IFeedback } from '@/models/FeedbackModel';
import type { Feedback, CreateFeedbackData } from '@/types';

function docToFeedback(doc: IFeedback | any): Feedback {
  const plainDoc = doc && typeof doc.toObject === 'function' ? doc.toObject({ virtuals: true, getters: true }) : { ...doc };
  return {
    id: plainDoc._id ? plainDoc._id.toString() : plainDoc.id,
    name: plainDoc.name,
    email: plainDoc.email,
    rating: plainDoc.rating,
    message: plainDoc.message,
    createdAt: plainDoc.createdAt ? new Date(plainDoc.createdAt).toISOString() : undefined,
  };
}

export async function submitFeedback(data: CreateFeedbackData): Promise<Feedback> {
  try {
    await dbConnect();
    const newFeedback = new FeedbackModel(data);
    const savedFeedback = await newFeedback.save();
    return docToFeedback(savedFeedback);
  } catch (error) {
    console.error('Error submitting feedback:', error);
    if (error instanceof Error && error.name === 'ValidationError') {
      throw new Error(`Validation failed: ${(error as any).message}`);
    }
    throw new Error(`Failed to submit feedback. ${(error as Error).message}`);
  }
}

export async function getFeedbacks(): Promise<Feedback[]> {
  try {
    await dbConnect();
    const feedbacks = await FeedbackModel.find({}).sort({ createdAt: -1 }).lean();
    return feedbacks.map(docToFeedback);
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    throw new Error(`Failed to fetch feedbacks. ${(error as Error).message}`);
  }
}

export async function countAllFeedbacks(): Promise<number> {
  try {
    await dbConnect();
    const count = await FeedbackModel.countDocuments({});
    return count;
  } catch (error) {
    console.error('Error counting all feedbacks:', error);
    throw new Error(`Failed to count all feedbacks. ${(error as Error).message}`);
  }
}


export async function deleteFeedback(id: string): Promise<boolean> {
  try {
    await dbConnect();
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.warn(`Invalid feedback ID format for delete: ${id}`);
      throw new Error('Invalid feedback ID format for delete.');
    }
    const result = await FeedbackModel.findByIdAndDelete(id);
    if (!result) {
        return false;
    }
    return true;
  } catch (error) {
    console.error(`Error deleting feedback ${id}:`, error);
    throw new Error(`Failed to delete feedback ${id}. ${(error as Error).message}`);
  }
}
