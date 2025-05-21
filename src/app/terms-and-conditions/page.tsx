
import type { Metadata } from 'next';
import { FadeIn } from '@/components/motion/fade-in';
import { ShieldAlert } from 'lucide-react';
import { getTermsAndConditions } from '@/services/termsAndConditionsService';
import { format } from 'date-fns';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const terms = await getTermsAndConditions();
    const description = terms.content ? terms.content.substring(0, 160).replace(/<[^>]*>?/gm, '') + '...' : 'Read the terms and conditions for using ByteBrusters services and website.';
    return {
      title: 'Terms and Conditions - ByteBrusters',
      description: description,
      openGraph: {
        title: 'Terms and Conditions - ByteBrusters',
        description: 'Understand the terms of service for ByteBrusters.',
        ...(terms.updatedAt && { modifiedTime: terms.updatedAt }),
      },
      twitter: {
        title: 'Terms andConditions - ByteBrusters',
        description: 'Understand the terms of service for ByteBrusters.',
      }
    };
  } catch (error) {
    console.error("Failed to generate metadata for T&C:", error);
    return {
      title: 'Terms and Conditions - ByteBrusters',
      description: 'Read the terms and conditions for using ByteBrusters services and website.',
    }
  }
}

export default async function TermsAndConditionsPage() {
  let termsContent = "<p>Could not load Terms and Conditions at this moment. Please try again later.</p>";
  let lastUpdated = new Date().toISOString(); // Fallback

  try {
    const terms = await getTermsAndConditions();
    termsContent = terms.content;
    if (terms.updatedAt) {
      lastUpdated = terms.updatedAt;
    }
  } catch (error) {
    console.error("Error fetching T&C for page render:", error);
  }

  return (
    <div className="container mx-auto section-padding">
      <FadeIn>
        <header className="text-center mb-16">
          <ShieldAlert className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="section-title inline-block !mb-4">Terms and Conditions</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Last Updated: {format(new Date(lastUpdated), 'dd, MMMM, yyyy')}
          </p>
        </header>
      </FadeIn>

      <FadeIn delay={100}>
        <article 
          className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-foreground prose-a:text-primary hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: termsContent }}
        />
      </FadeIn>
    </div>
  );
}
