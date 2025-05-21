
'use server';
import dbConnect from '@/lib/dbConnect';
import TermsAndConditionsModel, { type ITermsAndConditions } from '@/models/TermsAndConditionsModel';
import type { TermsAndConditions } from '@/types';

function docToTermsAndConditions(doc: ITermsAndConditions | any): TermsAndConditions {
  const plainDoc = doc && typeof doc.toObject === 'function' ? doc.toObject({ virtuals: true, getters: true }) : { ...doc };
  return {
    id: plainDoc._id ? plainDoc._id.toString() : plainDoc.id,
    content: plainDoc.content,
    updatedAt: plainDoc.updatedAt ? new Date(plainDoc.updatedAt).toISOString() : undefined,
    createdAt: plainDoc.createdAt ? new Date(plainDoc.createdAt).toISOString() : undefined,
  };
}

const DEFAULT_TERMS_CONTENT = `
<h2>1. Welcome to ByteBrusters!</h2>
<p>These terms and conditions outline the rules and regulations for the use of ByteBrusters's Website, located at [Your Website URL].</p>
<p>By accessing this website we assume you accept these terms and conditions. Do not continue to use ByteBrusters if you do not agree to take all of the terms and conditions stated on this page.</p>
<p><em>Please replace this placeholder text with your actual Terms and Conditions. You can edit this from the admin panel.</em></p>
<h2>2. Cookies</h2>
<p>We employ the use of cookies. By accessing ByteBrusters, you agreed to use cookies in agreement with the ByteBrusters's Privacy Policy.</p>
<h2>3. License</h2>
<p>Unless otherwise stated, ByteBrusters and/or its licensors own the intellectual property rights for all material on ByteBrusters. All intellectual property rights are reserved. You may access this from ByteBrusters for your own personal use subjected to restrictions set in these terms and conditions.</p>
<p>You must not:</p>
<ul>
    <li>Republish material from ByteBrusters</li>
    <li>Sell, rent or sub-license material from ByteBrusters</li>
    <li>Reproduce, duplicate or copy material from ByteBrusters</li>
    <li>Redistribute content from ByteBrusters</li>
</ul>
<h2>4. Placeholder Content</h2>
<p>This is placeholder content. Ensure you update this with legally sound terms and conditions relevant to your services and jurisdiction.</p>
<p>Consult with a legal professional to draft appropriate terms for your business.</p>
<p><strong>Last Updated:</strong> placeholder</p>
`;


export async function getTermsAndConditions(): Promise<TermsAndConditions> {
  try {
    await dbConnect();
    let termsDoc = await TermsAndConditionsModel.findOne({}).lean();
    if (!termsDoc) {
      console.log('No Terms and Conditions found, creating default content.');
      const newTerms = new TermsAndConditionsModel({ content: DEFAULT_TERMS_CONTENT });
      const savedTermsDoc = await newTerms.save();
      termsDoc = savedTermsDoc.toObject({ virtuals: true, getters: true });
    }
    return docToTermsAndConditions(termsDoc);
  } catch (error) {
    console.error('Error fetching Terms and Conditions:', error);
    throw new Error(`Failed to fetch Terms and Conditions. ${(error as Error).message}`);
  }
}

export async function updateTermsAndConditions(content: string): Promise<TermsAndConditions> {
  try {
    await dbConnect();
    // Use findOneAndUpdate with upsert:true to create if it doesn't exist, or update if it does.
    // Mongoose `timestamps: true` will automatically handle `updatedAt`.
    const updatedTermsDoc = await TermsAndConditionsModel.findOneAndUpdate(
      {}, // An empty filter object will match the first document if one exists, or be used for upsert.
      { content, updatedAt: new Date() }, // Explicitly set updatedAt here as findOneAndUpdate might not trigger schema middleware by default
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    if (!updatedTermsDoc) {
      throw new Error('Failed to update or create Terms and Conditions.');
    }
    return docToTermsAndConditions(updatedTermsDoc);
  } catch (error) {
    console.error('Error updating Terms and Conditions:', error);
    if (error instanceof Error && error.name === 'ValidationError') {
      throw new Error(`Validation failed for T&C: ${(error as any).message}`);
    }
    throw new Error(`Failed to update Terms and Conditions. ${(error as Error).message}`);
  }
}
