
'use server';
import dbConnect from '@/lib/dbConnect';
import ServiceInquiryModel, { type IServiceInquiry } from '@/models/ServiceInquiryModel';
import type { ServiceInquiry, CreateServiceInquiryData, ServiceInquiryStatus } from '@/types';
import ServiceModel from '@/models/ServiceModel'; // To validate serviceId

function docToServiceInquiry(doc: IServiceInquiry | any): ServiceInquiry {
  const plainDoc = doc && typeof doc.toObject === 'function' ? doc.toObject({ virtuals: true, getters: true }) : { ...doc };
  return {
    id: plainDoc._id ? plainDoc._id.toString() : plainDoc.id,
    serviceId: plainDoc.serviceId ? plainDoc.serviceId.toString() : '',
    serviceName: plainDoc.serviceName,
    name: plainDoc.name,
    email: plainDoc.email,
    phone: plainDoc.phone || "",
    message: plainDoc.message,
    status: plainDoc.status as ServiceInquiryStatus,
    createdAt: plainDoc.createdAt ? new Date(plainDoc.createdAt).toISOString() : undefined,
    updatedAt: plainDoc.updatedAt ? new Date(plainDoc.updatedAt).toISOString() : undefined,
  };
}

export async function submitServiceInquiry(data: CreateServiceInquiryData): Promise<ServiceInquiry> {
  try {
    await dbConnect();
    // Optional: Validate if serviceId actually exists
    const serviceExists = await ServiceModel.findById(data.serviceId);
    if (!serviceExists) {
      throw new Error(`Service with ID ${data.serviceId} not found.`);
    }

    const newInquiry = new ServiceInquiryModel({
      ...data,
      status: 'New', // Default status
    });
    const savedInquiry = await newInquiry.save();
    return docToServiceInquiry(savedInquiry);
  } catch (error) {
    console.error('Error submitting service inquiry:', error);
    if (error instanceof Error && error.name === 'ValidationError') {
      throw new Error(`Validation failed: ${(error as any).message}`);
    }
    throw new Error(`Failed to submit service inquiry. ${(error as Error).message}`);
  }
}

export async function getServiceInquiries(): Promise<ServiceInquiry[]> {
  try {
    await dbConnect();
    const inquiries = await ServiceInquiryModel.find({}).sort({ createdAt: -1 }).lean();
    return inquiries.map(docToServiceInquiry);
  } catch (error) {
    console.error('Error fetching service inquiries:', error);
    throw new Error(`Failed to fetch service inquiries. ${(error as Error).message}`);
  }
}

export async function countNewServiceInquiries(): Promise<number> {
  try {
    await dbConnect();
    const count = await ServiceInquiryModel.countDocuments({ status: 'New' });
    return count;
  } catch (error) {
    console.error('Error counting new service inquiries:', error);
    throw new Error(`Failed to count new service inquiries. ${(error as Error).message}`);
  }
}

export async function updateServiceInquiryStatus(id: string, status: ServiceInquiryStatus): Promise<ServiceInquiry | null> {
  try {
    await dbConnect();
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new Error('Invalid inquiry ID format.');
    }
    const updatedInquiry = await ServiceInquiryModel.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
    if (!updatedInquiry) {
      return null;
    }
    return docToServiceInquiry(updatedInquiry);
  } catch (error) {
    console.error(`Error updating service inquiry status for ${id}:`, error);
    if (error instanceof Error && error.name === 'ValidationError') {
      throw new Error(`Validation failed: ${(error as any).message}`);
    }
    throw new Error(`Failed to update inquiry status. ${(error as Error).message}`);
  }
}

export async function deleteServiceInquiry(id: string): Promise<boolean> {
  try {
    await dbConnect();
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new Error('Invalid inquiry ID format.');
    }
    const result = await ServiceInquiryModel.findByIdAndDelete(id);
    if (!result) {
        return false;
    }
    return true;
  } catch (error) {
    console.error(`Error deleting service inquiry ${id}:`, error);
    throw new Error(`Failed to delete service inquiry. ${(error as Error).message}`);
  }
}
