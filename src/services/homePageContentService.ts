
'use server';
import dbConnect from '@/lib/dbConnect';
import HomePageContentModel, { type IHomePageContent } from '@/models/HomePageContentModel';
import type { HomePageContent, UpdateHomePageContentData } from '@/types';

const DEFAULT_HOME_CONTENT_DATA: UpdateHomePageContentData = {
  heroTitle: 'Innovative <span class="gradient-text">IT Solutions</span> for a Digital Future',
  heroSubtitle: "ByteBrusters empowers businesses with cutting-edge technology, from custom web and mobile applications to intelligent AI integrations. Let's build something amazing together.",
  whyByteBrustersTitle: 'Why ByteBrusters?',
  whyByteBrustersParagraph: "At ByteBrusters, we're not just developers; we're innovators and problem solvers dedicated to your success. We combine technical expertise with a client-centric approach.",
  whyByteBrustersImageUrl: 'https://placehold.co/600x600.png',
  whyByteBrustersImageAiHint: 'team collaboration',
  finalCtaTitle: '<span class="gradient-text">Ready to Start Your Project?</span>',
  finalCtaSubtitle: "We're excited to learn about your ideas and help bring them to life. Let's collaborate and build something exceptional.",
};

function docToHomePageContent(doc: IHomePageContent | any): HomePageContent {
  const plainDoc = doc && typeof doc.toObject === 'function' ? doc.toObject({ virtuals: true, getters: true }) : { ...doc };
  return {
    id: plainDoc._id ? plainDoc._id.toString() : plainDoc.id,
    heroTitle: plainDoc.heroTitle,
    heroSubtitle: plainDoc.heroSubtitle,
    whyByteBrustersTitle: plainDoc.whyByteBrustersTitle,
    whyByteBrustersParagraph: plainDoc.whyByteBrustersParagraph,
    whyByteBrustersImageUrl: plainDoc.whyByteBrustersImageUrl,
    whyByteBrustersImageAiHint: plainDoc.whyByteBrustersImageAiHint || "",
    finalCtaTitle: plainDoc.finalCtaTitle,
    finalCtaSubtitle: plainDoc.finalCtaSubtitle,
    createdAt: plainDoc.createdAt ? new Date(plainDoc.createdAt).toISOString() : undefined,
    updatedAt: plainDoc.updatedAt ? new Date(plainDoc.updatedAt).toISOString() : undefined,
  };
}

export async function getHomePageContent(): Promise<HomePageContent> {
  try {
    await dbConnect();
    let contentDoc = await HomePageContentModel.findOne({}).lean();
    if (!contentDoc) {
      console.log('No home page content found, creating default content.');
      const newContent = new HomePageContentModel(DEFAULT_HOME_CONTENT_DATA);
      const savedContentDoc = await newContent.save();
      contentDoc = savedContentDoc.toObject({ virtuals: true, getters: true });
    }
    return docToHomePageContent(contentDoc);
  } catch (error) {
    console.error('Error fetching home page content:', error);
    // Return default data on error to prevent site breakage
    return { id: 'default', ...DEFAULT_HOME_CONTENT_DATA };
    // Or throw: throw new Error(`Failed to fetch home page content. ${(error as Error).message}`);
  }
}

export async function updateHomePageContent(data: UpdateHomePageContentData): Promise<HomePageContent> {
  try {
    await dbConnect();
    const updateData = { ...data, updatedAt: new Date() };
    const updatedContentDoc = await HomePageContentModel.findOneAndUpdate({}, updateData, { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true });
    if (!updatedContentDoc) {
      throw new Error('Failed to update or create home page content.');
    }
    return docToHomePageContent(updatedContentDoc);
  } catch (error) {
    console.error('Error updating home page content:', error);
    if (error instanceof Error && error.name === 'ValidationError') {
      throw new Error(`Validation failed: ${(error as any).message}`);
    }
    throw new Error(`Failed to update home page content. ${(error as Error).message}`);
  }
}
