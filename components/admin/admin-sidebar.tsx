"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LucideIcon,
  LayoutDashboard, 
  Globe,
  FolderKanban,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/lib/constants";

interface SidebarLink {
  title: string;
  href: string;
  icon: LucideIcon;
}

const sidebarLinks: SidebarLink[] = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Services", href: "/admin/services", icon: Globe },
  { title: "Projects", href: "/admin/projects", icon: FolderKanban },
  { title: "Team", href: "/admin/team", icon: Users },
  { title: "Messages", href: "/admin/messages", icon: MessageSquare },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      {/* Mobile menu toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={toggleMobileSidebar}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "bg-card border-r border-border h-screen flex flex-col fixed top-0 left-0 z-40 transition-all duration-300",
          collapsed ? "w-20" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo section */}
        <div className="p-4 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            {!collapsed && (
              <span className="font-bold text-lg gradient-text">{SITE_NAME}</span>
            )}
            {collapsed && (
              <span className="font-bold text-2xl gradient-text">CC</span>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex"
            onClick={toggleSidebar}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>

        <Separator />

        {/* Navigation links */}
        <div className="flex-1 py-6 overflow-y-auto">
          <nav className="px-2 space-y-1">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-200",
                  pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted"
                )}
              >
                <link.icon className="h-5 w-5" />
                {!collapsed && <span>{link.title}</span>}
              </Link>
            ))}
          </nav>
        </div>

        {/* User section */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
              {user?.name?.charAt(0)}
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <p className="font-medium truncate">{user?.name}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            )}
          </div>
          <Button
            variant="outline"
            size={collapsed ? "icon" : "default"}
            className="w-full"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
          onClick={toggleMobileSidebar}
        />
      )}
    </>
  );
}