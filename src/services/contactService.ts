
'use server';
import dbConnect from '@/lib/dbConnect';
import ContactMessageModel, { type IContactMessage } from '@/models/ContactMessageModel';
import ContactInfoModel, { type IContactInfo } from '@/models/ContactInfoModel';
import type { ContactMessage, ContactInfo, NewContactMessageData } from '@/types';

// Helper to convert MongoDB doc to ContactMessage type
function docToContactMessage(doc: IContactMessage | any): ContactMessage {
  const plainDoc = doc.toObject ? doc.toObject({ virtuals: true, getters: true }) : { ...doc };
  return {
    id: plainDoc._id ? plainDoc._id.toString() : plainDoc.id,
    name: plainDoc.name,
    email: plainDoc.email,
    subject: plainDoc.subject,
    messageBody: plainDoc.messageBody,
    date: new Date(plainDoc.date).toISOString(),
    status: plainDoc.status,
    createdAt: plainDoc.createdAt ? new Date(plainDoc.createdAt).toISOString() : undefined,
    updatedAt: plainDoc.updatedAt ? new Date(plainDoc.updatedAt).toISOString() : undefined,
  };
}

// Helper to convert MongoDB doc to ContactInfo type
function docToContactInfo(doc: IContactInfo | any): ContactInfo {
  const plainDoc = doc.toObject ? doc.toObject({ virtuals: true, getters: true }) : { ...doc };
  return {
    id: plainDoc._id ? plainDoc._id.toString() : plainDoc.id,
    email: plainDoc.email,
    phone: plainDoc.phone,
    address: plainDoc.address,
    createdAt: plainDoc.createdAt ? new Date(plainDoc.createdAt).toISOString() : undefined,
    updatedAt: plainDoc.updatedAt ? new Date(plainDoc.updatedAt).toISOString() : undefined,
  };
}


export async function getContactMessages(): Promise<ContactMessage[]> {
  try {
    await dbConnect();
    const messagesDocs = await ContactMessageModel.find({}).sort({ date: -1 }).lean();
    return messagesDocs.map(doc => docToContactMessage(doc));
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    throw new Error(`Failed to fetch contact messages. ${(error as Error).message}`);
  }
}

export async function updateMessageStatus(id: string, status: ContactMessage['status']): Promise<ContactMessage> {
  try {
    await dbConnect();
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.warn(`Invalid contact message ID format for status update: ${id}`);
      throw new Error('Invalid contact message ID format for status update.');
    }
    const updatedMessageDoc = await ContactMessageModel.findByIdAndUpdate(id, { status, updatedAt: new Date() }, { new: true });
    if (!updatedMessageDoc) {
      throw new Error(`Contact message with ID ${id} not found for status update.`);
    }
    return docToContactMessage(updatedMessageDoc);
  } catch (error) {
    console.error(`Error updating message status for ${id}:`, error);
    throw new Error(`Failed to update message status for ${id}. ${(error as Error).message}`);
  }
}

export async function deleteContactMessage(id: string): Promise<boolean> {
  try {
    await dbConnect();
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.warn(`Invalid contact message ID format for delete: ${id}`);
      throw new Error('Invalid contact message ID format for delete.');
    }
    const result = await ContactMessageModel.findByIdAndDelete(id);
    if (!result) {
      return false;
    }
    return true;
  } catch (error) {
    console.error(`Error deleting contact message ${id}:`, error);
    throw new Error(`Failed to delete contact message ${id}. ${(error as Error).message}`);
  }
}

export async function deleteManyContactMessages(ids: string[]): Promise<{ success: boolean; deletedCount: number; error?: string }> {
  if (!ids || ids.length === 0) {
    return { success: false, deletedCount: 0, error: "No message IDs provided for deletion." };
  }
  try {
    await dbConnect();
    for (const id of ids) {
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error(`Invalid contact message ID format: ${id}.`);
      }
    }
    const result = await ContactMessageModel.deleteMany({ _id: { $in: ids } });
    return { success: true, deletedCount: result.deletedCount || 0 };
  } catch (error) {
    console.error('Error deleting multiple contact messages:', error);
    return { success: false, deletedCount: 0, error: `Failed to delete messages. ${(error as Error).message}` };
  }
}


export async function submitContactFormMessage(data: NewContactMessageData): Promise<ContactMessage> {
  try {
    await dbConnect();
    const newMessageDoc = new ContactMessageModel({
      ...data,
      date: new Date(),
      status: 'New',
    });
    const savedMessage = await newMessageDoc.save();
    return docToContactMessage(savedMessage);
  } catch (error) {
    console.error('Error submitting contact form message:', error);
    if (error instanceof Error && error.name === 'ValidationError') {
      throw new Error(`Validation failed: ${(error as any).message}`);
    }
    throw new Error(`Failed to submit contact message. ${(error as Error).message}`);
  }
}

const DEFAULT_CONTACT_INFO_DATA = {
  email: 'info@bytebrusters.com',
  phone: '+1 (234) 567-8900',
  address: '123 Tech Avenue, Silicon Valley, CA 94000, USA',
};

export async function getContactInfo(): Promise<ContactInfo> {
  try {
    await dbConnect();
    let infoDoc = await ContactInfoModel.findOne({}).lean();
    if (!infoDoc) {
      console.log('No contact info found, creating default contact info.');
      const newInfo = new ContactInfoModel(DEFAULT_CONTACT_INFO_DATA);
      const savedInfoDoc = await newInfo.save();
      infoDoc = savedInfoDoc.toObject({ virtuals: true, getters: true });
    }
    return docToContactInfo(infoDoc);
  } catch (error) {
    console.error('Error fetching contact info:', error);
    throw new Error(`Failed to fetch contact info. ${(error as Error).message}`);
  }
}

export async function updateContactInfo(newInfo: Partial<Omit<ContactInfo, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ContactInfo> {
  try {
    await dbConnect();
    const updateData = { ...newInfo, updatedAt: new Date() };
    const updatedInfoDoc = await ContactInfoModel.findOneAndUpdate({}, updateData, { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true });
    if (!updatedInfoDoc) {
      throw new Error('Failed to update or create contact info.');
    }
    return docToContactInfo(updatedInfoDoc);
  } catch (error) {
    console.error('Error updating contact info:', error);
    if (error instanceof Error && error.name === 'ValidationError') {
      throw new Error(`Validation failed: ${(error as any).message}`);
    }
    throw new Error(`Failed to update contact info. ${(error as Error).message}`);
  }
}
