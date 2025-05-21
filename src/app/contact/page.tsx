
import { ContactForm } from '@/components/contact/contact-form';
import { Mail, Phone } from 'lucide-react'; // Removed MapPin
import { FadeIn } from '@/components/motion/fade-in';
import type { Metadata } from 'next';
import { getFAQItems } from '@/services/faqService';
import type { FAQItem } from '@/types';
import { getContactInfo } from '@/services/contactService';
import type { ContactInfo } from '@/types';

export const metadata: Metadata = {
  title: 'Contact Us - Get in Touch with ByteBrusters',
  description: "Have a question or project idea? Contact ByteBrusters. We're ready to discuss your IT needs and provide expert solutions. Reach out via form, email, or phone.",
  openGraph: {
    title: 'Contact ByteBrusters - Let\'s Start a Conversation',
    description: "Reach out to ByteBrusters for inquiries about our IT services, project collaborations, or general questions. We're here to help.",
  },
  twitter: {
    title: 'Contact ByteBrusters - Let\'s Start a Conversation',
    description: "Reach out to ByteBrusters for inquiries about our IT services, project collaborations, or general questions.",
  }
};

export default async function ContactPage() {
  let faqItems: FAQItem[] = [];
  let contactInfo: ContactInfo | null = null;

  try {
    faqItems = await getFAQItems();
  } catch (error) {
    console.error("Failed to load FAQs for contact page:", error);
  }

  try {
    contactInfo = await getContactInfo();
  } catch (error) {
    console.error("Failed to load contact info for contact page:", error);
  }


  return (
    <div className="container mx-auto section-padding">
      <FadeIn>
        <section className="text-center mb-16">
          <h1 className="section-title inline-block">Get In Touch</h1>
          <p className="text-xl text-muted-foreground mt-4 max-w-3xl mx-auto text-balance">
            We're here to help and answer any question you might have. We look forward to hearing from you!
          </p>
        </section>
      </FadeIn>

      <div className="grid lg:grid-cols-2 gap-x-12 gap-y-16 items-start mb-24">
        <FadeIn delay={100}>
          <div className="bg-card p-6 md:p-8 rounded-lg shadow-xl">
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-card-foreground">Send Us a Message</h2>
            <ContactForm />
          </div>
        </FadeIn>

        <FadeIn delay={200}>
          <div className="space-y-8">
            <div className="bg-card p-6 md:p-8 rounded-lg shadow-xl">
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-card-foreground">Contact Information</h2>
              {contactInfo ? (
                <ul className="space-y-4 text-base md:text-lg text-muted-foreground">
                  <li className="flex items-center">
                    <Mail className="h-5 w-5 md:h-6 md:w-6 mr-3 text-primary" />
                    <a href={`mailto:${contactInfo.email}`} className="hover:text-primary transition-colors">{contactInfo.email}</a>
                  </li>
                  <li className="flex items-center">
                    <Phone className="h-5 w-5 md:h-6 md:w-6 mr-3 text-primary" />
                    <a href={`tel:${contactInfo.phone}`} className="hover:text-primary transition-colors">{contactInfo.phone}</a>
                  </li>
                  <li className="flex items-start"> {/* Changed MapPin to a generic info icon or remove icon */}
                     {/* If MapPin is used, import it. For now, assuming physical address text is enough or replace with another icon if desired */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 md:h-6 md:w-6 mr-3 text-primary mt-1 shrink-0 lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span>{contactInfo.address}</span>
                  </li>
                </ul>
              ) : (
                <p className="text-muted-foreground">Contact information is currently unavailable. Please try again later.</p>
              )}
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
