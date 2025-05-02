import { LucideIcon } from "lucide-react";

// Service Types
export interface ServiceFeature {
  title: string;
  description: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  slug?: string;
}

// Project Types
export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  technologies: string[];
  slug?: string;
  content?: string;
  clientName?: string;
  completionDate?: string;
}

// Team Member Types
export interface SocialLink {
  icon: LucideIcon;
  url: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  social: SocialLink[];
}

// Testimonial Types
export interface Testimonial {
  id: string;
  name: string;
  company: string;
  content: string;
  image: string;
}

// Contact Types
export interface ContactInfo {
  address: string;
  email: string;
  phone: string;
  hours: string;
}

// Contact Form Types
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
}

// Authentication Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: Omit<User, 'password'>;
}

// Dashboard/Admin Types
export interface DashboardStats {
  totalProjects: number;
  totalTeamMembers: number;
  totalServices: number;
  totalMessages: number;
}

export interface Message extends ContactFormData {
  id: string;
  createdAt: Date;
  read: boolean;
}