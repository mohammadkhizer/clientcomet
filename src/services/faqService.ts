
'use server';
import dbConnect from '@/lib/dbConnect';
import FAQItemModel, { type IFAQItem } from '@/models/FAQItemModel';
import type { FAQItem, CreateFAQItemData } from '@/types';

function docToFAQItem(doc: IFAQItem | any): FAQItem {
  const plainDoc = doc && typeof doc.toObject === 'function' ? doc.toObject({ virtuals: true, getters: true }) : { ...doc };
  return {
    id: plainDoc._id ? plainDoc._id.toString() : plainDoc.id,
    question: plainDoc.question,
    answer: plainDoc.answer,
    createdAt: plainDoc.createdAt ? new Date(plainDoc.createdAt).toISOString() : undefined,
    updatedAt: plainDoc.updatedAt ? new Date(plainDoc.updatedAt).toISOString() : undefined,
  };
}

export async function getFAQItems(): Promise<FAQItem[]> {
  try {
    await dbConnect();
    const faqDocs = await FAQItemModel.find({}).sort({ createdAt: 'desc' }).lean();
    return faqDocs.map(docToFAQItem);
  } catch (error) {
    console.error('Error fetching FAQ items:', error);
    throw new Error(`Failed to fetch FAQ items. ${(error as Error).message}`);
  }
}

export async function getFAQItemById(id: string): Promise<FAQItem | null> {
  try {
    await dbConnect();
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.warn(`Invalid FAQ item ID format: ${id}`);
      return null;
    }
    const faqDoc = await FAQItemModel.findById(id).lean();
    if (!faqDoc) return null;
    return docToFAQItem(faqDoc);
  } catch (error) {
    console.error(`Error fetching FAQ item by ID ${id}:`, error);
    throw new Error(`Failed to fetch FAQ item ${id}. ${(error as Error).message}`);
  }
}

export async function addFAQItem(data: CreateFAQItemData): Promise<FAQItem> {
  try {
    await dbConnect();
    const newFAQDoc = new FAQItemModel(data);
    const savedFAQ = await newFAQDoc.save();
    return docToFAQItem(savedFAQ);
  } catch (error) {
    console.error('Error adding FAQ item:', error);
    if (error instanceof Error && error.name === 'ValidationError') {
      throw new Error(`Validation failed: ${(error as any).message}`);
    }
    throw new Error(`Failed to add FAQ item. ${(error as Error).message}`);
  }
}

export async function updateFAQItem(id: string, updates: Partial<CreateFAQItemData>): Promise<FAQItem | null> {
  try {
    await dbConnect();
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.warn(`Invalid FAQ item ID format for update: ${id}`);
      throw new Error('Invalid FAQ item ID format for update.');
    }
    const updatedFAQDoc = await FAQItemModel.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!updatedFAQDoc) return null;
    return docToFAQItem(updatedFAQDoc);
  } catch (error) {
    console.error(`Error updating FAQ item ${id}:`, error);
    if (error instanceof Error && error.name === 'ValidationError') {
      throw new Error(`Validation failed: ${(error as any).message}`);
    }
    throw new Error(`Failed to update FAQ item ${id}. ${(error as Error).message}`);
  }
}

export async function deleteFAQItem(id: string): Promise<boolean> {
  try {
    await dbConnect();
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.warn(`Invalid FAQ item ID format for delete: ${id}`);
      throw new Error('Invalid FAQ item ID format for delete.');
    }
    const result = await FAQItemModel.findByIdAndDelete(id);
    return !!result;
  } catch (error) {
    console.error(`Error deleting FAQ item ${id}:`, error);
    throw new Error(`Failed to delete FAQ item ${id}. ${(error as Error).message}`);
  }
}
