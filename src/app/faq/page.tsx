
import type { Metadata } from 'next';
import { FadeIn } from '@/components/motion/fade-in';
import { StaticFAQ } from '@/components/faq/static-faq';
import { getFAQItems } from '@/services/faqService';
import type { FAQItem } from '@/types';
import { HelpCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions - ByteBrusters',
  description: "Find answers to common questions about ByteBrusters's services, processes, and policies. Get the information you need quickly and easily.",
  openGraph: {
    title: 'ByteBrusters FAQs - Your Questions Answered',
    description: "Explore our comprehensive list of frequently asked questions to learn more about ByteBrusters and how we can help you achieve your tech goals.",
  },
  twitter: {
    title: 'ByteBrusters FAQs - Your Questions Answered',
    description: "Explore our comprehensive list of frequently asked questions.",
  }
};

export default async function FAQPage() {
  let faqItems: FAQItem[] = [];
  try {
    faqItems = await getFAQItems();
  } catch (error) {
    console.error("Failed to load FAQs for FAQ page:", error);
    // Optionally, provide fallback FAQs or an error message component
  }

  return (
    <div className="container mx-auto section-padding">
      <FadeIn>
        <section className="text-center mb-16">
           <HelpCircle className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="section-title inline-block">Frequently Asked Questions</h1>
          <p className="text-xl text-muted-foreground mt-4 max-w-3xl mx-auto text-balance">
            Have questions? We've got answers. Explore our FAQs to find the information you need.
          </p>
        </section>
      </FadeIn>

      <FadeIn delay={100}>
        <StaticFAQ items={faqItems} />
      </FadeIn>

      <FadeIn delay={200}>
        <section className="mt-24 text-center bg-muted/50 p-12 rounded-lg">
            <h2 className="text-3xl font-semibold mb-4">Can't find your answer?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
                If you don't see your question answered here, please don't hesitate to reach out to us directly.
            </p>
            <Link href="/contact">
                <Button size="lg" className="button-primary">
                    Contact Us <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </Link>
        </section>
      </FadeIn>
    </div>
  );
}
