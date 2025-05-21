
import type { LucideIcon } from 'lucide-react';

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  imageUrl: string;
  dataAiHint?: string;
  tags: string[];
  liveUrl?: string;
  repoUrl?: string;
  client?: string;
  date?: string;
  technologies?: string[];
  status?: "Planning" | "In Progress" | "Completed" | "On Hold";
  developerName: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateProjectData = Omit<Project, 'id' | 'createdAt' | 'updatedAt'> & {
  date?: string;
};


export interface Service {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  iconName: string;
  features?: string[];
  process?: { step: string, description: string }[];
  status?: "Active" | "Draft";
  lastUpdated?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateServiceData = Omit<Service, 'id' | 'createdAt' | 'updatedAt' | 'lastUpdated'>;

export interface TeamMemberSocials {
  linkedin?: string;
  twitter?: string;
  github?: string;
  instagram?: string; // This seems to be from SiteSettings, not typically for team members individually
  cvUrl?: string; // Added CV URL
}
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  dataAiHint?: string;
  bio: string;
  socials?: TeamMemberSocials;
  createdAt?: string;
  updatedAt?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  company: string;
  imageUrl?: string;
  dataAiHint?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateFAQItemData = Omit<FAQItem, 'id' | 'createdAt' | 'updatedAt'>;

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  messageBody: string;
  date: string;
  status: 'New' | 'Read' | 'Replied';
  createdAt?: string;
  updatedAt?: string;
}

export type NewContactMessageData = Omit<ContactMessage, 'id' | 'date' | 'status' | 'createdAt' | 'updatedAt'>;


export interface ContactInfo {
  id: string;
  email: string;
  phone: string;
  address: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SiteSettings {
  id: string;
  siteTitle: string;
  siteDescription: string;
  adminEmail?: string;
  contactEmail: string;
  footerPhoneNumber?: string;
  footerTagline?: string;
  footerCopyright: string;
  developerCreditText?: string;
  footerQuickLinksTitle?: string;
  footerGetInTouchTitle?: string;
  footerResourcesTitle?: string;
  socials: {
    facebookUrl?: string;
    twitterUrl?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    instagramUrl?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface TermsAndConditions {
  id: string;
  content: string;
  updatedAt?: string;
  createdAt?: string;
}

export interface Feedback {
  id: string;
  name: string;
  email: string;
  rating: number;
  message: string;
  createdAt?: string;
}

export type CreateFeedbackData = Omit<Feedback, 'id' | 'createdAt'>;

export interface ChatbotRule {
  id: string;
  keywords: string[];
  response: string;
  priority?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateChatbotRuleData = Omit<ChatbotRule, 'id' | 'createdAt' | 'updatedAt'>;

export type ServiceInquiryStatus = 'New' | 'Pending' | 'Contacted' | 'Resolved' | 'Closed';

export interface ServiceInquiry {
  id: string;
  serviceId: string;
  serviceName: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: ServiceInquiryStatus;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateServiceInquiryData = Omit<ServiceInquiry, 'id' | 'status' | 'createdAt' | 'updatedAt'>;

export interface HomePageContent {
  id: string;
  heroTitle: string;
  heroSubtitle: string;
  whyByteBrustersTitle: string;
  whyByteBrustersParagraph: string;
  whyByteBrustersImageUrl: string;
  whyByteBrustersImageAiHint?: string;
  finalCtaTitle: string;
  finalCtaSubtitle: string;
  createdAt?: string;
  updatedAt?: string;
}

export type UpdateHomePageContentData = Omit<HomePageContent, 'id' | 'createdAt' | 'updatedAt'>;

export interface AboutPageContent {
  id: string;
  introTitle: string;
  introSubtitle: string;
  missionTitle: string;
  missionParagraph: string;
  missionImageUrl: string;
  missionImageAiHint?: string;
  visionTitle: string;
  visionParagraph: string;
  visionImageUrl: string;
  visionImageAiHint?: string;
  coreValuesTitle: string;
  createdAt?: string;
  updatedAt?: string;
}

export type UpdateAboutPageContentData = Omit<AboutPageContent, 'id' | 'createdAt' | 'updatedAt'>;

export interface KeyStatsData {
  satisfiedClients: string;
  projectsCompleted: string;
  yearsOfExperience: string;
}

export interface SiteKeyStats extends KeyStatsData {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export type UpdateSiteKeyStatsData = KeyStatsData;

export interface StatItem {
  id: string;
  title: string;
  value: string;
  iconName?: string;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}
export type CreateStatItemData = Omit<StatItem, 'id' | 'createdAt' | 'updatedAt'>;
