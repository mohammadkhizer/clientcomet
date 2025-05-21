
"use client";

import { Code2, Facebook, Twitter, Linkedin, Github, Instagram, Mail, ExternalLink, Home, Info, Briefcase, FileText, MessageSquare, ShieldAlert, HelpCircle, Phone, MessageCircleQuestion, Users } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { getSiteSettings } from '@/services/siteSettingsService';
import type { SiteSettings } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';

const FooterSkeleton = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-12 text-left">
        {/* Column 1: Brand Skeleton */}
        <div>
          <div className="flex items-center mb-4"><Skeleton className="h-10 w-10 rounded-full mr-2" /><Skeleton className="h-6 w-32" /></div>
          <Skeleton className="h-4 w-4/5 mb-2" /><Skeleton className="h-4 w-3/5" />
        </div>

        {/* Column 2: Quick Links Skeleton */}
        <div>
          <Skeleton className="h-5 w-24 mb-6" />
          <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={`ql-${i}`} className="h-4 w-20" />)}</div>
        </div>

        {/* Column 3: Get In Touch Skeleton */}
        <div>
          <Skeleton className="h-5 w-32 mb-6" />
          <div className="flex items-center mb-3"><Skeleton className="h-5 w-5 mr-3 rounded-sm" /><Skeleton className="h-4 w-40" /></div>
          <div className="flex items-center mb-3"><Skeleton className="h-5 w-5 mr-3 rounded-sm" /><Skeleton className="h-4 w-32" /></div>
          <div className="flex space-x-4 mt-4">{[...Array(5)].map((_, i) => <Skeleton key={`social-${i}`} className="h-8 w-8 rounded-md" />)}</div>
        </div>

         {/* Column 4: Resources Skeleton */}
        <div>
          <Skeleton className="h-5 w-28 mb-6" />
           <div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={`rl-${i}`} className="h-4 w-20" />)}</div>
        </div>
      </div>
      <div className="border-t border-border/20 py-6 text-center">
        <Skeleton className="h-4 w-1/2 mx-auto mb-2" /><Skeleton className="h-3 w-1/3 mx-auto" />
      </div>
    </div>
  );
};


export default function Footer() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchSettings = useCallback(async () => {
    setIsLoading(true); // Set loading true at the start
    try {
      const siteSettings = await getSiteSettings();
      setSettings(siteSettings);
    } catch (error) {
      console.error("Failed to fetch site settings for footer:", error);
      toast({
        title: "Error loading site settings",
        description: "Could not load footer information. Displaying default values.",
        variant: "destructive",
      });
      // Fallback to default settings if fetching fails
      setSettings({
        id: 'fallback',
        siteTitle: 'ByteBrusters',
        siteDescription: '', // Default or empty
        adminEmail: '',
        contactEmail: 'contact@example.com',
        footerPhoneNumber: '+1 (234) 567-8900',
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false); // Ensure loading is set to false in all cases
    }
  }, [toast]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  if (isLoading && !settings) { // Show skeleton if loading AND settings are not yet available
      return (
        <footer className="bg-muted text-muted-foreground">
            <FooterSkeleton />
        </footer>
      )
  }

  // Fallback to default settings if settings are null after loading (should be handled by catch block ideally)
  const currentSettings = settings || {
    id: 'fallback-render',
    siteTitle: 'ByteBrusters',
    siteDescription: '',
    adminEmail: '',
    contactEmail: 'info@bytebrusters.com',
    footerPhoneNumber: '+91 9510865651',
    footerTagline: 'Crafting digital excellence, one line of code at a time.',
    footerCopyright: `© ${new Date().getFullYear()} ByteBrusters. All rights reserved.`,
    developerCreditText: 'Managed and Developed By Shaikh Mohammed Khizer.',
    footerQuickLinksTitle: 'Quick Links',
    footerGetInTouchTitle: 'Get In Touch',
    footerResourcesTitle: 'Resources',
    socials: { facebookUrl: '', twitterUrl: '', linkedinUrl: '', githubUrl: '', instagramUrl: '' },
  };


  const {
    siteTitle,
    footerTagline,
    footerCopyright,
    developerCreditText,
    contactEmail,
    footerPhoneNumber,
    socials,
    footerQuickLinksTitle,
    footerGetInTouchTitle,
    footerResourcesTitle,
  } = currentSettings;

  const quickLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/about', label: 'About Us', icon: Info },
    { href: '/services', label: 'Services', icon: Briefcase },
    { href: '/projects', label: 'Projects', icon: FileText },
    { href: '/team', label: 'Our Team', icon: Users },
    { href: '/contact', label: 'Contact', icon: MessageSquare },
  ];

  const resourceLinks = [
    { href: '/faq', label: 'FAQ', icon: HelpCircle },
    { href: '/terms-and-conditions', label: 'Terms & Conditions', icon: ShieldAlert },
    { href: '/feedback', label: 'Feedback', icon: MessageCircleQuestion },
  ];

  return (
    <footer className="bg-muted text-muted-foreground">
      {isLoading && !settings ? <FooterSkeleton /> : (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-16 text-left">
            {/* Column 1: Brand */}
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-foreground hover:text-primary transition-colors">
                <Code2 className="h-8 w-8 text-primary" />
                <span className='gradient-text'>{siteTitle}</span>
              </Link>
              <p className="text-sm">{footerTagline}</p>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">{footerQuickLinksTitle}</h3>
              <ul className="space-y-2">
                {quickLinks.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm hover:text-primary transition-colors flex items-center group">
                      <link.icon className="h-4 w-4 mr-2 text-muted-foreground group-hover:text-primary transition-colors" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Get In Touch */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">{footerGetInTouchTitle}</h3>
              <ul className="space-y-2">
                <li>
                  <a href={`mailto:${contactEmail}`} className="text-sm hover:text-primary transition-colors flex items-center group">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground group-hover:text-primary transition-colors" />
                    {contactEmail}
                  </a>
                </li>
                {footerPhoneNumber && (
                  <li>
                      <a href={`tel:${footerPhoneNumber.replace(/\s/g, '')}`} className="text-sm hover:text-primary transition-colors flex items-center group">
                          <Phone className="h-4 w-4 mr-2 text-muted-foreground group-hover:text-primary transition-colors"/>
                          {footerPhoneNumber}
                      </a>
                  </li>
                )}
              </ul>
              <div className="flex space-x-4 mt-4">
                {socials?.facebookUrl && socials.facebookUrl !== '#' && (
                  <Link href={socials.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors duration-300" aria-label="Facebook">
                    <Facebook size={24} />
                  </Link>
                )}
                {socials?.twitterUrl && socials.twitterUrl !== '#' && (
                  <Link href={socials.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors duration-300" aria-label="Twitter">
                    <Twitter size={24} />
                  </Link>
                )}
                {socials?.linkedinUrl && socials.linkedinUrl !== '#' && (
                  <Link href={socials.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors duration-300" aria-label="LinkedIn">
                    <Linkedin size={24} />
                  </Link>
                )}
                {socials?.githubUrl && socials.githubUrl !== '#' && (
                  <Link href={socials.githubUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors duration-300" aria-label="GitHub">
                    <Github size={24} />
                  </Link>
                )}
                {socials?.instagramUrl && socials.instagramUrl !== '#' && (
                  <Link href={socials.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors duration-300" aria-label="Instagram">
                    <Instagram size={24} />
                  </Link>
                )}
              </div>
              {(!socials?.facebookUrl || socials.facebookUrl === '#') &&
                (!socials?.twitterUrl || socials.twitterUrl === '#') &&
                (!socials?.linkedinUrl || socials.linkedinUrl === '#') &&
                (!socials?.githubUrl || socials.githubUrl === '#') &&
                (!socials?.instagramUrl || socials.instagramUrl === '#') && (
                  <p className="text-xs mt-2 text-muted-foreground">Social media links coming soon. Configure them in Admin &gt; Site Settings.</p>
              )}
            </div>

            {/* Column 4: Resources */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">{footerResourcesTitle}</h3>
              <ul className="space-y-2">
                {resourceLinks.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm hover:text-primary transition-colors flex items-center group">
                      <link.icon className="h-4 w-4 mr-2 text-muted-foreground group-hover:text-primary transition-colors" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-border/20 py-8 text-center">
            <p className="text-sm mb-1">{footerCopyright}</p>
            {developerCreditText && (<p className="text-xs">{developerCreditText}</p>)}
          </div>
        </div>
      )}
    </footer>
  );
}
    