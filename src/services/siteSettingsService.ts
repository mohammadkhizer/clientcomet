
'use server';
import dbConnect from '@/lib/dbConnect';
import SiteSettingsModel, { type ISiteSettings } from '@/models/SiteSettingsModel';
import type { SiteSettings } from '@/types';

// Helper to convert MongoDB doc to SiteSettings type
function docToSiteSettings(doc: ISiteSettings | any): SiteSettings {
  const plainDoc = doc && typeof doc.toObject === 'function' ? doc.toObject({ virtuals: true, getters: true }) : { ...doc };

  return {
    id: plainDoc._id ? plainDoc._id.toString() : plainDoc.id,
    siteTitle: plainDoc.siteTitle,
    siteDescription: plainDoc.siteDescription,
    adminEmail: plainDoc.adminEmail || '', 
    contactEmail: plainDoc.contactEmail,
    footerPhoneNumber: plainDoc.footerPhoneNumber || '',
    footerTagline: plainDoc.footerTagline || '',
    footerCopyright: plainDoc.footerCopyright,
    developerCreditText: plainDoc.developerCreditText || '',
    footerQuickLinksTitle: plainDoc.footerQuickLinksTitle || 'Quick Links',
    footerGetInTouchTitle: plainDoc.footerGetInTouchTitle || 'Get In Touch',
    footerResourcesTitle: plainDoc.footerResourcesTitle || 'Resources',
    socials: {
      facebookUrl: plainDoc.socials?.facebookUrl || '',
      twitterUrl: plainDoc.socials?.twitterUrl || '',
      linkedinUrl: plainDoc.socials?.linkedinUrl || '',
      githubUrl: plainDoc.socials?.githubUrl || '',
      instagramUrl: plainDoc.socials?.instagramUrl || '',
    },
    createdAt: plainDoc.createdAt ? new Date(plainDoc.createdAt).toISOString() : undefined,
    updatedAt: plainDoc.updatedAt ? new Date(plainDoc.updatedAt).toISOString() : undefined,
  };
}

const DEFAULT_SITE_SETTINGS_DATA: Omit<SiteSettings, 'id' | 'createdAt' | 'updatedAt'> = {
  siteTitle: 'ByteBrusters',
  siteDescription: 'Innovative IT solutions to boost your business. Web development, mobile apps, and AI integration by ByteBrusters.',
  adminEmail: 'admin@example.com', 
  contactEmail: 'info@bytebrusters.com',
  footerPhoneNumber: '+91 9510865651',
  footerTagline: 'Crafting digital excellence, one line of code at a time.',
  footerCopyright: `© ${new Date().getFullYear()} ByteBrusters. All rights reserved.`,
  developerCreditText: 'Managed and Developed By Shaikh Mohammed Khizer.',
  footerQuickLinksTitle: 'Quick Links',
  footerGetInTouchTitle: 'Get In Touch',
  footerResourcesTitle: 'Resources',
  socials: {
    facebookUrl: '',
    twitterUrl: '',
    linkedinUrl: '',
    githubUrl: '',
    instagramUrl: '',
  },
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    await dbConnect();
    let settingsDoc = await SiteSettingsModel.findOne({}).lean();
    if (!settingsDoc) {
      console.log('No site settings found, creating default settings.');
      const newSettings = new SiteSettingsModel(DEFAULT_SITE_SETTINGS_DATA);
      const savedSettingsDoc = await newSettings.save();
      settingsDoc = savedSettingsDoc.toObject({ virtuals: true, getters: true });
    }
    return docToSiteSettings(settingsDoc);
  } catch (error) {
    console.error('Error fetching site settings:', error);
    // In case of error, return default settings to prevent site breakage
    return {
        id: 'default',
        ...DEFAULT_SITE_SETTINGS_DATA,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    // Or throw: throw new Error(`Failed to fetch site settings. ${(error as Error).message}`);
  }
}

export async function updateSiteSettings(newSettings: Partial<Omit<SiteSettings, 'id' | 'createdAt' | 'updatedAt'>>): Promise<SiteSettings> {
  try {
    await dbConnect();
    const updateData = { ...newSettings, updatedAt: new Date() };
    const updatedSettingsDoc = await SiteSettingsModel.findOneAndUpdate({}, updateData, { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true });
     if (!updatedSettingsDoc) {
        throw new Error('Failed to update or create site settings.');
    }
    return docToSiteSettings(updatedSettingsDoc);
  } catch (error) {
    console.error('Error updating site settings:', error);
    if (error instanceof Error && error.name === 'ValidationError') {
      throw new Error(`Validation failed: ${(error as any).message}`);
    }
    throw new Error(`Failed to update site settings. ${(error as Error).message}`);
  }
}
