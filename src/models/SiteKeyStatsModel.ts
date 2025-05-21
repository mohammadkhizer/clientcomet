
import mongoose, { Schema, Document, models, Model } from 'mongoose';
import type { KeyStatsData } from '@/types';

export interface ISiteKeyStats extends KeyStatsData, Document {
  createdAt: Date;
  updatedAt: Date;
}

const SiteKeyStatsSchema: Schema = new Schema({
  satisfiedClients: { type: String, required: true, default: '0+' },
  projectsCompleted: { type: String, required: true, default: '0+' },
  yearsOfExperience: { type: String, required: true, default: '0+' },
}, { timestamps: true });

const SiteKeyStatsModel = (models.SiteKeyStats as Model<ISiteKeyStats>) || mongoose.model<ISiteKeyStats>('SiteKeyStats', SiteKeyStatsSchema);

export default SiteKeyStatsModel;
