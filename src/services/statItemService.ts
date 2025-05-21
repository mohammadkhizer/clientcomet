
'use server';
import dbConnect from '@/lib/dbConnect';
import StatItemModel, { type IStatItem } from '@/models/StatItemModel';
import type { StatItem, CreateStatItemData } from '@/types';

function docToStatItem(doc: IStatItem | any): StatItem {
  const plainDoc = doc && typeof doc.toObject === 'function' ? doc.toObject({ virtuals: true, getters: true }) : { ...doc };
  return {
    id: plainDoc._id ? plainDoc._id.toString() : plainDoc.id,
    title: plainDoc.title,
    value: plainDoc.value,
    iconName: plainDoc.iconName || undefined,
    sortOrder: plainDoc.sortOrder,
    createdAt: plainDoc.createdAt ? new Date(plainDoc.createdAt).toISOString() : undefined,
    updatedAt: plainDoc.updatedAt ? new Date(plainDoc.updatedAt).toISOString() : undefined,
  };
}

export async function getStatItems(): Promise<StatItem[]> {
  try {
    await dbConnect();
    const statDocs = await StatItemModel.find({}).sort({ sortOrder: 1, createdAt: 1 }).lean();
    return statDocs.map(docToStatItem);
  } catch (error) {
    console.error('Error fetching stat items:', error);
    throw new Error(`Failed to fetch stat items. ${(error as Error).message}`);
  }
}

export async function getStatItemById(id: string): Promise<StatItem | null> {
  try {
    await dbConnect();
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.warn(`Invalid stat item ID format: ${id}`);
      return null;
    }
    const statDoc = await StatItemModel.findById(id).lean();
    if (!statDoc) return null;
    return docToStatItem(statDoc);
  } catch (error) {
    console.error(`Error fetching stat item by ID ${id}:`, error);
    throw new Error(`Failed to fetch stat item ${id}. ${(error as Error).message}`);
  }
}

export async function addStatItem(data: CreateStatItemData): Promise<StatItem> {
  try {
    await dbConnect();
    const newStatDoc = new StatItemModel(data);
    const savedStat = await newStatDoc.save();
    return docToStatItem(savedStat);
  } catch (error) {
    console.error('Error adding stat item:', error);
    if (error instanceof Error && error.name === 'ValidationError') {
      throw new Error(`Validation failed: ${(error as any).message}`);
    }
    throw new Error(`Failed to add stat item. ${(error as Error).message}`);
  }
}

export async function updateStatItem(id: string, updates: Partial<CreateStatItemData>): Promise<StatItem | null> {
  try {
    await dbConnect();
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.warn(`Invalid stat item ID format for update: ${id}`);
      throw new Error('Invalid stat item ID format for update.');
    }
    const updatedStatDoc = await StatItemModel.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!updatedStatDoc) return null;
    return docToStatItem(updatedStatDoc);
  } catch (error) {
    console.error(`Error updating stat item ${id}:`, error);
    if (error instanceof Error && error.name === 'ValidationError') {
      throw new Error(`Validation failed: ${(error as any).message}`);
    }
    throw new Error(`Failed to update stat item ${id}. ${(error as Error).message}`);
  }
}

export async function deleteStatItem(id: string): Promise<boolean> {
  try {
    await dbConnect();
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.warn(`Invalid stat item ID format for delete: ${id}`);
      throw new Error('Invalid stat item ID format for delete.');
    }
    const result = await StatItemModel.findByIdAndDelete(id);
    return !!result;
  } catch (error) {
    console.error(`Error deleting stat item ${id}:`, error);
    throw new Error(`Failed to delete stat item ${id}. ${(error as Error).message}`);
  }
}
