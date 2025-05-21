
'use server';
import dbConnect from '@/lib/dbConnect';
import ServiceModel, { type IService } from '@/models/ServiceModel';
import type { Service, CreateServiceData } from '@/types';
import { getIconComponent } from '@/lib/iconUtils'; // Keep for admin, but not for docToService's `icon` prop

// Helper to convert MongoDB doc to Service type
function docToService(doc: IService | any): Service {
  // Ensure we are working with a plain object
  const plainDoc = doc && typeof doc.toObject === 'function' ? doc.toObject({ virtuals: true, getters: true }) : { ...doc };

  if (!plainDoc || typeof plainDoc !== 'object') {
    console.error("docToService received invalid doc:", doc);
    // Decide how to handle this, e.g., throw an error or return a default/empty object
    // For now, let's assume an error or inappropriate data might lead to a problem downstream
    // and it might be better to throw or return a clearly identifiable "error" state.
    // However, for robustness in mapping, we'll try to proceed if possible or return a minimal valid structure.
    // This part depends on how strictly you want to handle malformed data from DB.
    // For now, let's proceed assuming plainDoc has the expected structure after toObject or spread.
  }
  
  return {
    id: plainDoc._id ? plainDoc._id.toString() : plainDoc.id?.toString() || '', // Ensure id is always a string
    title: plainDoc.title || '',
    description: plainDoc.description || '',
    longDescription: plainDoc.longDescription || '',
    // DO NOT pass the actual icon component from server to client
    // icon: getIconComponent(plainDoc.iconName), // REMOVED THIS LINE
    iconName: plainDoc.iconName || 'Code', // Ensure iconName has a default
    features: Array.isArray(plainDoc.features) ? plainDoc.features.map(String) : [],
    process: Array.isArray(plainDoc.process) ? plainDoc.process.map((p: any) => ({ step: p.step || '', description: p.description || '' })) : [],
    status: plainDoc.status || "Draft",
    lastUpdated: plainDoc.lastUpdated ? new Date(plainDoc.lastUpdated).toISOString() : undefined,
    createdAt: plainDoc.createdAt ? new Date(plainDoc.createdAt).toISOString() : undefined,
    updatedAt: plainDoc.updatedAt ? new Date(plainDoc.updatedAt).toISOString() : undefined,
  };
}

export async function getServices(): Promise<Service[]> {
  try {
    await dbConnect();
    const servicesDocs = await ServiceModel.find({}).sort({ createdAt: -1 }).lean();
    return servicesDocs.map(doc => docToService(doc));
  } catch (error) {
    console.error('Error fetching services:', error);
    throw new Error(`Failed to fetch services. ${(error as Error).message}`);
  }
}

export async function getServiceById(id: string): Promise<Service | null> {
  try {
    await dbConnect();
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.warn(`Invalid service ID format: ${id}`);
      // throw new Error('Invalid service ID format'); // Or return null
      return null;
    }
    const serviceDoc = await ServiceModel.findById(id).lean();
    if (!serviceDoc) return null;
    return docToService(serviceDoc);
  } catch (error) {
    console.error(`Error fetching service by ID ${id}:`, error);
    throw new Error(`Failed to fetch service ${id}. ${(error as Error).message}`);
  }
}

export async function addService(serviceData: CreateServiceData): Promise<Service> {
  try {
    await dbConnect();
    const newServiceDoc = new ServiceModel({
      ...serviceData,
      iconName: serviceData.iconName || 'Code', // Ensure default iconName if not provided
      lastUpdated: new Date(),
    });
    const savedService = await newServiceDoc.save();
    return docToService(savedService);
  } catch (error) {
    console.error('Error adding service:', error);
    if (error instanceof Error && error.name === 'ValidationError') {
      throw new Error(`Validation failed: ${(error as any).message}`);
    }
    throw new Error(`Failed to add service. ${(error as Error).message}`);
  }
}

export async function updateService(id: string, updates: Partial<CreateServiceData>): Promise<Service | null> {
  try {
    await dbConnect();
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.warn(`Invalid service ID format for update: ${id}`);
      throw new Error('Invalid service ID format for update.');
    }
    const updateData = { ...updates, lastUpdated: new Date() };
    const updatedServiceDoc = await ServiceModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!updatedServiceDoc) {
        // throw new Error('Service not found for update');
        return null;
    }
    return docToService(updatedServiceDoc);
  } catch (error) {
    console.error(`Error updating service ${id}:`, error);
    if (error instanceof Error && error.name === 'ValidationError') {
      throw new Error(`Validation failed: ${(error as any).message}`);
    }
    throw new Error(`Failed to update service ${id}. ${(error as Error).message}`);
  }
}

export async function deleteService(id: string): Promise<boolean> {
  try {
    await dbConnect();
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.warn(`Invalid service ID format for delete: ${id}`);
      throw new Error('Invalid service ID format for delete.');
    }
    const result = await ServiceModel.findByIdAndDelete(id);
    if (!result) {
        // throw new Error(`Service with ID ${id} not found for deletion.`);
        return false;
    }
    return true;
  } catch (error) {
    console.error(`Error deleting service ${id}:`, error);
    throw new Error(`Failed to delete service ${id}. ${(error as Error).message}`);
  }
}
