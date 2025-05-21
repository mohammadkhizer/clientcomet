
'use server';
import dbConnect from '@/lib/dbConnect';
import ProjectModel, { type IProject } from '@/models/ProjectModel';
import type { Project, CreateProjectData } from '@/types';

// Helper to convert MongoDB doc to Project type
function docToProject(doc: IProject | any): Project {
  const plainDoc = doc && typeof doc.toObject === 'function' ? doc.toObject({ virtuals: true, getters: true }) : { ...doc };

  return {
    id: plainDoc._id ? plainDoc._id.toString() : plainDoc.id,
    title: plainDoc.title || '',
    description: plainDoc.description || '',
    longDescription: plainDoc.longDescription || "",
    imageUrl: plainDoc.imageUrl || '',
    dataAiHint: plainDoc.dataAiHint || "",
    tags: Array.isArray(plainDoc.tags) ? plainDoc.tags : [],
    liveUrl: plainDoc.liveUrl || "",
    repoUrl: plainDoc.repoUrl || "",
    client: plainDoc.client || "",
    date: plainDoc.date ? new Date(plainDoc.date).toISOString().split('T')[0] : undefined,
    technologies: Array.isArray(plainDoc.technologies) ? plainDoc.technologies : [],
    status: plainDoc.status || "Planning",
    developerName: plainDoc.developerName,
    createdAt: plainDoc.createdAt ? new Date(plainDoc.createdAt).toISOString() : undefined,
    updatedAt: plainDoc.updatedAt ? new Date(plainDoc.updatedAt).toISOString() : undefined,
  };
}


export async function getProjects(): Promise<Project[]> {
  try {
    await dbConnect();
    const projectsDocs = await ProjectModel.find({}).sort({ createdAt: -1 }).lean();
    return projectsDocs.map(docToProject);
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw new Error(`Failed to fetch projects. ${(error as Error).message}`);
  }
}

export async function getProjectById(id: string): Promise<Project | null> {
  try {
    await dbConnect();
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        console.warn(`Invalid project ID format: ${id}`);
        return null;
    }
    const projectDoc = await ProjectModel.findById(id).lean();
    if (!projectDoc) return null;
    return docToProject(projectDoc);
  } catch (error) {
    console.error(`Error fetching project by ID ${id}:`, error);
    throw new Error(`Failed to fetch project ${id}. ${(error as Error).message}`);
  }
}

export async function addProject(projectData: CreateProjectData): Promise<Project> {
  try {
    await dbConnect();
    const newProjectDoc = new ProjectModel({
      ...projectData,
      date: projectData.date ? new Date(projectData.date) : undefined,
      imageUrl: projectData.imageUrl || `https://placehold.co/600x400.png?text=${encodeURIComponent(projectData.title.charAt(0))}`,
      dataAiHint: projectData.dataAiHint || 'project abstract',
    });
    const savedProject = await newProjectDoc.save();
    return docToProject(savedProject);
  } catch (error) {
    console.error('Error adding project:', error);
    if (error instanceof Error && error.name === 'ValidationError') {
      throw new Error(`Validation failed: ${(error as any).message}`);
    }
    throw new Error(`Failed to add project. ${(error as Error).message}`);
  }
}

export async function updateProject(id: string, updates: Partial<CreateProjectData>): Promise<Project | null> {
  try {
    await dbConnect();
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        console.warn(`Invalid project ID format for update: ${id}`);
        throw new Error('Invalid project ID format for update.');
    }
    const updateData: Partial<IProject> = { ...updates } as Partial<IProject>;
    if (updates.date === '') { 
      updateData.date = undefined;
    } else if (updates.date) {
      updateData.date = new Date(updates.date);
    }


    const updatedProjectDoc = await ProjectModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!updatedProjectDoc) {
      console.error(`Project with ID ${id} not found for update.`);
      return null;
    }
    return docToProject(updatedProjectDoc);
  } catch (error) {
    console.error(`Error updating project ${id}:`, error);
    if (error instanceof Error && error.name === 'ValidationError') {
      throw new Error(`Validation failed: ${(error as any).message}`);
    }
    throw new Error(`Failed to update project ${id}. ${(error as Error).message}`);
  }
}

export async function deleteProject(id: string): Promise<boolean> {
  try {
    await dbConnect();
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        console.warn(`Invalid project ID format for delete: ${id}`);
        throw new Error('Invalid project ID format for delete.');
    }
    const result = await ProjectModel.findByIdAndDelete(id);
    if (!result) {
        console.warn(`Project with ID ${id} not found for deletion.`);
        return false;
    }
    return true;
  } catch (error) {
    console.error(`Error deleting project ${id}:`, error);
    throw new Error(`Failed to delete project ${id}. ${(error as Error).message}`);
  }
}

export async function deleteManyProjects(ids: string[]): Promise<{ success: boolean; deletedCount: number; error?: string }> {
  if (!ids || ids.length === 0) {
    return { success: false, deletedCount: 0, error: "No project IDs provided for deletion." };
  }
  try {
    await dbConnect();
    // Validate all IDs
    for (const id of ids) {
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error(`Invalid project ID format: ${id}.`);
      }
    }
    const result = await ProjectModel.deleteMany({ _id: { $in: ids } });
    return { success: true, deletedCount: result.deletedCount || 0 };
  } catch (error) {
    console.error('Error deleting multiple projects:', error);
    return { success: false, deletedCount: 0, error: `Failed to delete projects. ${(error as Error).message}` };
  }
}
