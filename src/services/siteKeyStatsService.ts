
'use server';
import dbConnect from '@/lib/dbConnect';
import SiteKeyStatsModel, { type ISiteKeyStats } from '@/models/SiteKeyStatsModel';
import type { SiteKeyStats, UpdateSiteKeyStatsData, KeyStatsData } from '@/types';

const DEFAULT_KEY_STATS_DATA: KeyStatsData = {
  satisfiedClients: "50+",
  projectsCompleted: "5+",
  yearsOfExperience: "3+",
};

function docToSiteKeyStats(doc: ISiteKeyStats | any): SiteKeyStats {
  const plainDoc = doc && typeof doc.toObject === 'function' ? doc.toObject({ virtuals: true, getters: true }) : { ...doc };
  return {
    id: plainDoc._id ? plainDoc._id.toString() : plainDoc.id,
    satisfiedClients: plainDoc.satisfiedClients,
    projectsCompleted: plainDoc.projectsCompleted,
    yearsOfExperience: plainDoc.yearsOfExperience,
    createdAt: plainDoc.createdAt ? new Date(plainDoc.createdAt).toISOString() : undefined,
    updatedAt: plainDoc.updatedAt ? new Date(plainDoc.updatedAt).toISOString() : undefined,
  };
}

export async function getKeyStats(): Promise<SiteKeyStats> {
  try {
    await dbConnect();
    let statsDoc = await SiteKeyStatsModel.findOne({}).lean();
    if (!statsDoc) {
      console.log('No key stats found, creating default stats.');
      const newStats = new SiteKeyStatsModel(DEFAULT_KEY_STATS_DATA);
      const savedStatsDoc = await newStats.save();
      statsDoc = savedStatsDoc.toObject({ virtuals: true, getters: true });
    }
    return docToSiteKeyStats(statsDoc);
  } catch (error) {
    console.error('Error fetching key stats:', error);
    const fallbackData: SiteKeyStats = {
      id: 'default',
      ...DEFAULT_KEY_STATS_DATA,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return fallbackData;
  }
}

export async function updateKeyStats(data: UpdateSiteKeyStatsData): Promise<SiteKeyStats> {
  try {
    await dbConnect();
    const updateData = { ...data, updatedAt: new Date() };
    const updatedStatsDoc = await SiteKeyStatsModel.findOneAndUpdate({}, updateData, { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true });
    if (!updatedStatsDoc) {
      throw new Error('Failed to update or create key stats.');
    }
    return docToSiteKeyStats(updatedStatsDoc);
  } catch (error) {
    console.error('Error updating key stats:', error);
    if (error instanceof Error && error.name === 'ValidationError') {
      throw new Error(`Validation failed: ${(error as any).message}`);
    }
    throw new Error(`Failed to update key stats. ${(error as Error).message}`);
  }
}
