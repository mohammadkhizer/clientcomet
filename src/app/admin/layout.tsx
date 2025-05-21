
"use client";

import type { ReactNode } from 'react';
import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import Link from 'next/link';
import {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
  SidebarMenuBadge,
} from "@/components/ui/sidebar";
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Briefcase, Users as TeamIconLucide, Settings, LogOut, UserCircle, FileText, Loader2, ShieldCheck, PanelLeft, KeyRound, HelpCircle, MessageSquareText, FileQuestion, Home, Info, TrendingUp } from 'lucide-react'; // Renamed Users to TeamIconLucide
import { getContactMessages } from '@/services/contactService';
import { countAllFeedbacks } from '@/services/feedbackService';
import { countNewServiceInquiries } from '@/services/serviceInquiryService';
import { useToast } from "@/hooks/use-toast";


const adminNavLinksGlobal = [
  { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/dashboard/home-content', label: 'Home Page Content', icon: Home },
  { href: '/admin/dashboard/about-content', label: 'About Page Content', icon: Info },
  { href: '/admin/dashboard/key-stats', label: 'Edit Key Stats', icon: TrendingUp },
  { href: '/admin/dashboard/services', label: 'Services', icon: Briefcase },
  { href: '/admin/dashboard/projects', label: 'Projects', icon: FileText },
  { href: '/admin/dashboard/teams', label: 'Teams', icon: TeamIconLucide }, // Use aliased Users icon
  { href: '/admin/dashboard/contact', label: 'Contact Info', icon: UserCircle, notificationType: 'messages' },
  { href: '/admin/dashboard/inquiries', label: 'Service Inquiries', icon: FileQuestion, notificationType: 'inquiries' },
  { href: '/admin/dashboard/faq', label: 'Manage FAQs', icon: HelpCircle },
  { href: '/admin/dashboard/feedback', label: 'View Feedback', icon: MessageSquareText, notificationType: 'feedback' },
  // { href: '/admin/dashboard/chatbot', label: 'Chatbot Rules', icon: Bot }, // Chatbot link removed
  { href: '/admin/dashboard/terms-and-conditions', label: 'Terms & Conditions', icon: ShieldCheck },
  { href: '/admin/dashboard/settings', label: 'Site Settings', icon: Settings },
  { href: '/admin/reset-password', label: 'Reset Password', icon: KeyRound },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { isLoggedIn, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const [newFeedbackCount, setNewFeedbackCount] = useState(0);
  const [newInquiriesCount, setNewInquiriesCount] = useState(0);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const fetchNotificationCounts = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const [messagesCountResult, feedbackCountResult, inquiriesCountResult] = await Promise.allSettled([
        getContactMessages().then(msgs => msgs.filter(msg => msg.status === 'New').length),
        countAllFeedbacks(),
        countNewServiceInquiries()
      ]);

      if (messagesCountResult.status === 'fulfilled') setNewMessagesCount(messagesCountResult.value);
      else console.error("Failed to fetch new messages count:", messagesCountResult.reason);

      if (feedbackCountResult.status === 'fulfilled') setNewFeedbackCount(feedbackCountResult.value);
      else console.error("Failed to fetch feedback count:", feedbackCountResult.reason);
      
      if (inquiriesCountResult.status === 'fulfilled') setNewInquiriesCount(inquiriesCountResult.value);
      else console.error("Failed to fetch new inquiries count:", inquiriesCountResult.reason);

    } catch (error) {
      console.error("Failed to fetch notification counts:", error);
       toast({
          title: "Error fetching notifications",
          description: "Could not load some notification counts.",
          variant: "destructive",
       });
    }
  }, [isLoggedIn, toast]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchNotificationCounts();
    } else {
      setNewMessagesCount(0);
      setNewFeedbackCount(0);
      setNewInquiriesCount(0);
    }
  }, [pathname, isLoggedIn, fetchNotificationCounts]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isLoggedIn) {
        fetchNotificationCounts();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isLoggedIn, fetchNotificationCounts]);


 useEffect(() => {
    if (authLoading) {
      return; 
    }

    let targetPath: string | null = null;
    const onLoginPage = pathname === '/admin/login';
    const onResetPasswordPage = pathname === '/admin/reset-password';

    if (isLoggedIn) {
      if (onLoginPage) { 
        targetPath = '/admin/dashboard';
      }
    } else { 
      if (!onLoginPage && !onResetPasswordPage) { 
        targetPath = '/admin/login';
      }
    }

    if (targetPath && targetPath !== pathname) {
      setIsRedirecting(true);
      router.push(targetPath);
    } else {
      setIsRedirecting(false);
    }
  }, [isLoggedIn, authLoading, pathname, router]);


  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const navLinkIsActive = (linkHref: string, currentPathname: string) => {
    if (linkHref === '/admin/dashboard' && currentPathname === '/admin/dashboard') {
      return true;
    }
    if (linkHref !== '/admin/dashboard' && currentPathname.startsWith(linkHref)) {
      return true;
    }
    return false;
  };

 const getCurrentPageLabel = () => {
    const segments = pathname.split('/').filter(Boolean);
    let currentLabel = "Admin Panel";

    const isResetPasswordPage = pathname === '/admin/reset-password';
    if (isResetPasswordPage) {
      return "Reset Admin Password";
    }

    if (segments.includes('dashboard')) {
        const mainSectionIndex = segments.indexOf('dashboard') + 1;
        let mainSection = segments[mainSectionIndex];
        const action = segments[mainSectionIndex + 1];
        const entityId = segments[mainSectionIndex + 2];

        if (mainSection === 'terms' && segments[mainSectionIndex + 1] === 'and' && segments[mainSectionIndex + 2] === 'conditions') {
            mainSection = 'terms-and-conditions';
        }
         if (mainSection === 'home-content') mainSection = 'home-content';
         if (mainSection === 'about-content') mainSection = 'about-content';
         if (mainSection === 'key-stats') mainSection = 'key-stats';


        const link = adminNavLinksGlobal.find(l => {
            const linkPathEnd = l.href.substring(l.href.lastIndexOf('/') + 1);
            if (mainSection === 'terms-and-conditions' && linkPathEnd === 'terms-and-conditions') return true;
            if (mainSection === 'faq' && linkPathEnd === 'faq') return true;
            if (mainSection === 'feedback' && linkPathEnd === 'feedback') return true;
            if (mainSection === 'inquiries' && linkPathEnd === 'inquiries') return true;
            if (mainSection === 'home-content' && linkPathEnd === 'home-content') return true;
            if (mainSection === 'about-content' && linkPathEnd === 'about-content') return true;
            if (mainSection === 'key-stats' && linkPathEnd === 'key-stats') return true;
            return linkPathEnd === mainSection;
        });


        if (link) {
            currentLabel = link.label;
            
            let entityName = link.label;
            if (link.label === 'Site Settings') entityName = 'Settings';
            else if (link.label === 'Terms & Conditions') entityName = 'Terms & Conditions';
            else if (link.label === 'Contact Info') entityName = 'Contact Info';
            else if (link.label === 'Manage FAQs') entityName = 'FAQ';
            else if (link.label === 'View Feedback') entityName = 'Feedback';
            else if (link.label === 'Service Inquiries') entityName = 'Service Inquiry';
            else if (link.label === 'Home Page Content') entityName = 'Home Page Content';
            else if (link.label === 'About Page Content') entityName = 'About Page Content';
            else if (link.label === 'Edit Key Stats') entityName = 'Key Stats';
            else if (entityName.endsWith('s') && !['Terms & Conditions', 'Site Settings', 'Service Inquiries', 'Edit Key Stats'].includes(entityName)) entityName = entityName.slice(0, -1);


            if (action === 'new') {
                currentLabel = `Add New ${entityName}`;
            } else if (action === 'edit' && entityId) {
                 currentLabel = `Edit ${entityName}`;
            } else if (link.label === 'Terms & Conditions' && !action){
                currentLabel = 'Manage Terms & Conditions';
            } else if (link.label === 'Contact Info' && !action){
                currentLabel = 'Manage Contact Info & Messages';
            } else if (link.label === 'Manage FAQs' && !action) {
                currentLabel = 'Manage FAQs';
            } else if (link.label === 'View Feedback' && !action) {
                 currentLabel = 'View Feedback';
            } else if (link.label === 'Service Inquiries' && !action) {
                 currentLabel = 'Manage Service Inquiries';
            } else if (link.label === 'Home Page Content' && !action) {
                 currentLabel = 'Manage Home Page Content';
            } else if (link.label === 'About Page Content' && !action) {
                 currentLabel = 'Manage About Page Content';
            } else if (link.label === 'Edit Key Stats' && !action) {
                 currentLabel = 'Manage Key Statistics';
            }
        } else if (!mainSection) {
             currentLabel = "Overview";
        }
    }
    return currentLabel;
  };

  const currentPageTitle = getCurrentPageLabel();


  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-foreground ml-4">Authenticating...</p>
      </div>
    );
  }

  if (isRedirecting) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-foreground ml-4">Redirecting...</p>
        </div>
    );
  }

  const onLoginPage = pathname === '/admin/login';
  
  if ((isLoggedIn && !onLoginPage) || (!isLoggedIn && (onLoginPage || pathname === '/admin/reset-password'))) {
      return (
        <SidebarProvider defaultOpen>
          <div className="flex min-h-screen bg-muted/40">
            <Sidebar collapsible="icon" className="border-r">
              <SidebarHeader className="p-4 flex items-center justify-between">
                 <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold text-lg text-sidebar-primary">
                    <PanelLeft className="h-7 w-7" />
                    <span className="group-data-[collapsible=icon]:hidden">ByteBrusters</span>
                  </Link>
              </SidebarHeader>
              <SidebarContent className="p-2 pt-6">
                <SidebarMenu>
                  {adminNavLinksGlobal.map((link) => {
                    let countToShow = 0;
                    let badgeColorClasses = "bg-yellow-400 text-yellow-950 dark:bg-yellow-500 dark:text-yellow-950 border border-yellow-600 dark:border-yellow-700";
                    
                    if (link.notificationType === 'messages') countToShow = newMessagesCount;
                    else if (link.notificationType === 'feedback') countToShow = newFeedbackCount;
                    else if (link.notificationType === 'inquiries') countToShow = newInquiriesCount;
                    
                    return (
                    <SidebarMenuItem key={link.href}>
                      <Link href={link.href} legacyBehavior passHref>
                        <SidebarMenuButton
                          isActive={navLinkIsActive(link.href, pathname)}
                          tooltip={{children: link.label, side: "right", className: "ml-2"}}
                        >
                          <link.icon />
                          <span className="flex-grow group-data-[collapsible=icon]:hidden">{link.label}</span>
                          {countToShow > 0 && (
                            <SidebarMenuBadge className={badgeColorClasses}>
                              {countToShow}
                            </SidebarMenuBadge>
                          )}
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  )})}
                </SidebarMenu>
              </SidebarContent>
              <SidebarFooter className="p-4 border-t">
                <Button onClick={handleLogout} variant="ghost" className="w-full justify-start gap-2 text-sidebar-foreground group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2">
                  <LogOut className="h-5 w-5" />
                  <span className="group-data-[collapsible=icon]:hidden">Logout</span>
                </Button>
              </SidebarFooter>
            </Sidebar>
            <SidebarInset className="flex-1 flex flex-col bg-background">
              <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6 md:px-8 shadow-sm">
                 <SidebarTrigger/>
                <h1 className="text-xl font-semibold text-foreground flex items-center">
                  {currentPageTitle}
                  {newMessagesCount > 0 && !pathname.startsWith('/admin/dashboard/contact') && (
                    <span className="ml-3 text-xs font-medium bg-yellow-400 text-yellow-950 dark:bg-yellow-500 dark:text-yellow-950 border border-yellow-600 dark:border-yellow-700 px-2 py-0.5 rounded-full animate-pulse">
                      {newMessagesCount} New Message{newMessagesCount > 1 ? 's' : ''}
                    </span>
                  )}
                  {newFeedbackCount > 0 && !pathname.startsWith('/admin/dashboard/feedback') && (
                    <span className="ml-3 text-xs font-medium bg-yellow-400 text-yellow-950 dark:bg-yellow-500 dark:text-yellow-950 border border-yellow-600 dark:border-yellow-700 px-2 py-0.5 rounded-full animate-pulse">
                      {newFeedbackCount} New Feedback
                    </span>
                  )}
                  {newInquiriesCount > 0 && !pathname.startsWith('/admin/dashboard/inquiries') && (
                    <span className="ml-3 text-xs font-medium bg-yellow-400 text-yellow-950 dark:bg-yellow-500 dark:text-yellow-950 border border-yellow-600 dark:border-yellow-700 px-2 py-0.5 rounded-full animate-pulse">
                      {newInquiriesCount} New Inquir{newInquiriesCount > 1 ? 'ies' : 'y'}
                    </span>
                  )}
                </h1>
              </header>
              <main className="flex-1 p-6 md:p-8 overflow-auto w-full max-w-7xl mx-auto">
                {children}
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      );
  }

  if (onLoginPage || pathname === '/admin/reset-password') {
    return <main className="flex-1">{children}</main>;
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="text-foreground ml-4">Loading Admin Panel...</p>
    </div>
  );
}
