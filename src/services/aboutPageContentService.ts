
'use server';
import dbConnect from '@/lib/dbConnect';
import AboutPageContentModel, { type IAboutPageContent } from '@/models/AboutPageContentModel';
import type { AboutPageContent, UpdateAboutPageContentData } from '@/types';

const DEFAULT_ABOUT_CONTENT_DATA: UpdateAboutPageContentData = {
  introTitle: 'About ByteBrusters',
  introSubtitle: "We are a passionate team of tech enthusiasts dedicated to crafting exceptional digital experiences and robust IT solutions that drive growth and innovation for our clients.",
  missionTitle: 'Our Mission',
  missionParagraph: "To empower businesses with transformative technology solutions that enhance efficiency, foster innovation, and create lasting value. We strive to be a trusted partner, guiding our clients through the complexities of the digital landscape.",
  missionImageUrl: 'https://placehold.co/600x400.png',
  missionImageAiHint: 'mission target',
  visionTitle: 'Our Vision',
  visionParagraph: "To be a leading force in the IT industry, recognized for our innovative solutions, commitment to client success, and a culture of continuous learning and improvement. We envision a future where technology seamlessly integrates with business to unlock unprecedented potential.",
  visionImageUrl: 'https://placehold.co/600x400.png',
  visionImageAiHint: 'vision lightbulb',
  coreValuesTitle: 'Our Core Values',
  // teamSectionTitle: 'Meet Our Team', // Removed
  // teamSectionSubtitle: "The driving force behind ByteBrusters. A collective of creative minds, strategic thinkers, and tech wizards.", // Removed
};

function docToAboutPageContent(doc: IAboutPageContent | any): AboutPageContent {
  const plainDoc = doc && typeof doc.toObject === 'function' ? doc.toObject({ virtuals: true, getters: true }) : { ...doc };
  return {
    id: plainDoc._id ? plainDoc._id.toString() : plainDoc.id,
    introTitle: plainDoc.introTitle,
    introSubtitle: plainDoc.introSubtitle,
    missionTitle: plainDoc.missionTitle,
    missionParagraph: plainDoc.missionParagraph,
    missionImageUrl: plainDoc.missionImageUrl,
    missionImageAiHint: plainDoc.missionImageAiHint || "",
    visionTitle: plainDoc.visionTitle,
    visionParagraph: plainDoc.visionParagraph,
    visionImageUrl: plainDoc.visionImageUrl,
    visionImageAiHint: plainDoc.visionImageAiHint || "",
    coreValuesTitle: plainDoc.coreValuesTitle,
    // teamSectionTitle: plainDoc.teamSectionTitle, // Removed
    // teamSectionSubtitle: plainDoc.teamSectionSubtitle, // Removed
    createdAt: plainDoc.createdAt ? new Date(plainDoc.createdAt).toISOString() : undefined,
    updatedAt: plainDoc.updatedAt ? new Date(plainDoc.updatedAt).toISOString() : undefined,
  };
}

export async function getAboutPageContent(): Promise<AboutPageContent> {
  try {
    await dbConnect();
    let contentDoc = await AboutPageContentModel.findOne({}).lean();
    if (!contentDoc) {
      console.log('No about page content found, creating default content.');
      // Create a new object without the removed fields for the default
      const defaultDataForModel: Omit<AboutPageContent, 'id' | 'createdAt' | 'updatedAt'> = {
        introTitle: DEFAULT_ABOUT_CONTENT_DATA.introTitle,
        introSubtitle: DEFAULT_ABOUT_CONTENT_DATA.introSubtitle,
        missionTitle: DEFAULT_ABOUT_CONTENT_DATA.missionTitle,
        missionParagraph: DEFAULT_ABOUT_CONTENT_DATA.missionParagraph,
        missionImageUrl: DEFAULT_ABOUT_CONTENT_DATA.missionImageUrl,
        missionImageAiHint: DEFAULT_ABOUT_CONTENT_DATA.missionImageAiHint,
        visionTitle: DEFAULT_ABOUT_CONTENT_DATA.visionTitle,
        visionParagraph: DEFAULT_ABOUT_CONTENT_DATA.visionParagraph,
        visionImageUrl: DEFAULT_ABOUT_CONTENT_DATA.visionImageUrl,
        visionImageAiHint: DEFAULT_ABOUT_CONTENT_DATA.visionImageAiHint,
        coreValuesTitle: DEFAULT_ABOUT_CONTENT_DATA.coreValuesTitle,
      };
      const newContent = new AboutPageContentModel(defaultDataForModel);
      const savedContentDoc = await newContent.save();
      contentDoc = savedContentDoc.toObject({ virtuals: true, getters: true });
    }
    return docToAboutPageContent(contentDoc);
  } catch (error) {
    console.error('Error fetching about page content:', error);
    // Return default data on error
    const { ...relevantDefaults } = DEFAULT_ABOUT_CONTENT_DATA; // Ensure no removed fields here
    return { id: 'default', ...relevantDefaults };
  }
}

export async function updateAboutPageContent(data: UpdateAboutPageContentData): Promise<AboutPageContent> {
  try {
    await dbConnect();
    const updateData = { ...data, updatedAt: new Date() };
    // Remove potentially undefined fields that are no longer in the schema from the update
    const { ...validUpdateData } = updateData;
    // delete (validUpdateData as any).teamSectionTitle; // No longer needed as type controls this
    // delete (validUpdateData as any).teamSectionSubtitle;

    const updatedContentDoc = await AboutPageContentModel.findOneAndUpdate({}, validUpdateData, { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true });
    if (!updatedContentDoc) {
      throw new Error('Failed to update or create about page content.');
    }
    return docToAboutPageContent(updatedContentDoc);
  } catch (error) {
    console.error('Error updating about page content:', error);
    if (error instanceof Error && error.name === 'ValidationError') {
      throw new Error(`Validation failed: ${(error as any).message}`);
    }
    throw new Error(`Failed to update about page content. ${(error as Error).message}`);
  }
}
