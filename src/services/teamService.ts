
'use server';
import dbConnect from '@/lib/dbConnect';
import TeamMemberModel, { type ITeamMember } from '@/models/TeamMemberModel';
import type { TeamMember } from '@/types';

// Helper to convert MongoDB doc to TeamMember type
function docToTeamMember(doc: ITeamMember | any): TeamMember {
  const plainDoc = doc && typeof doc.toObject === 'function' ? doc.toObject({ virtuals: true, getters: true }) : { ...doc };

  return {
    id: plainDoc._id ? plainDoc._id.toString() : plainDoc.id,
    name: plainDoc.name,
    role: plainDoc.role,
    imageUrl: plainDoc.imageUrl,
    dataAiHint: plainDoc.dataAiHint || '',
    bio: plainDoc.bio,
    socials: {
      linkedin: plainDoc.socials?.linkedin || undefined,
      twitter: plainDoc.socials?.twitter || undefined,
      github: plainDoc.socials?.github || undefined,
      cvUrl: plainDoc.socials?.cvUrl || undefined, // Added CV URL
    },
    createdAt: plainDoc.createdAt ? new Date(plainDoc.createdAt).toISOString() : undefined,
    updatedAt: plainDoc.updatedAt ? new Date(plainDoc.updatedAt).toISOString() : undefined,
  };
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    await dbConnect();
    const membersDocs = await TeamMemberModel.find({}).sort({ createdAt: -1 }).lean();
    return membersDocs.map(doc => docToTeamMember(doc));
  } catch (error) {
    console.error('Error fetching team members:', error);
    throw new Error(`Failed to fetch team members. ${(error as Error).message}`);
  }
}

export async function getTeamMemberById(id: string): Promise<TeamMember | null> {
  try {
    await dbConnect();
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.warn(`Invalid team member ID format: ${id}`);
      return null; 
    }
    const memberDoc = await TeamMemberModel.findById(id).lean();
    if (!memberDoc) return null;
    return docToTeamMember(memberDoc);
  } catch (error) {
    console.error(`Error fetching team member by ID ${id}:`, error);
    throw new Error(`Failed to fetch team member ${id}. ${(error as Error).message}`);
  }
}

export async function addTeamMember(memberData: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>): Promise<TeamMember> {
  try {
    await dbConnect();
    const newMemberDoc = new TeamMemberModel({
      ...memberData,
      imageUrl: memberData.imageUrl || `https://placehold.co/400x400.png?text=${encodeURIComponent(memberData.name.charAt(0))}`,
      dataAiHint: memberData.dataAiHint || 'person avatar',
      socials: {
        linkedin: memberData.socials?.linkedin || undefined,
        twitter: memberData.socials?.twitter || undefined,
        github: memberData.socials?.github || undefined,
        cvUrl: memberData.socials?.cvUrl || undefined, // Added CV URL
      }
    });
    const savedMember = await newMemberDoc.save();
    return docToTeamMember(savedMember);
  } catch (error) {
    console.error('Error adding team member:', error);
    if (error instanceof Error && error.name === 'ValidationError') {
      throw new Error(`Validation failed: ${(error as any).message}`);
    }
    throw new Error(`Failed to add team member. ${(error as Error).message}`);
  }
}

export async function updateTeamMember(id: string, updates: Partial<Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>>): Promise<TeamMember | null> {
  try {
    await dbConnect();
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.warn(`Invalid team member ID format for update: ${id}`);
      throw new Error('Invalid team member ID format for update.');
    }
    // Ensure socials object is correctly structured for update
    const updateData = { ...updates };
    if (updates.socials) {
      updateData.socials = {
        linkedin: updates.socials.linkedin || undefined,
        twitter: updates.socials.twitter || undefined,
        github: updates.socials.github || undefined,
        cvUrl: updates.socials.cvUrl || undefined, // Added CV URL
      };
    }

    const updatedMemberDoc = await TeamMemberModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!updatedMemberDoc) return null; 
    return docToTeamMember(updatedMemberDoc);
  } catch (error) {
    console.error(`Error updating team member ${id}:`, error);
    if (error instanceof Error && error.name === 'ValidationError') {
      throw new Error(`Validation failed: ${(error as any).message}`);
    }
    throw new Error(`Failed to update team member ${id}. ${(error as Error).message}`);
  }
}

export async function deleteTeamMember(id: string): Promise<boolean> {
  try {
    await dbConnect();
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.warn(`Invalid team member ID format for delete: ${id}`);
      throw new Error('Invalid team member ID format for delete.');
    }
    const result = await TeamMemberModel.findByIdAndDelete(id);
    if (!result) {
      return false;
    }
    return true;
  } catch (error) {
    console.error(`Error deleting team member ${id}:`, error);
    throw new Error(`Failed to delete team member ${id}. ${(error as Error).message}`);
  }
}
