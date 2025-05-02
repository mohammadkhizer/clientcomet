"use client";

import { useAuth } from "@/lib/auth";
import { ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

interface AuthContainerProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export default function AuthContainer({ 
  children, 
  requireAuth = true 
}: AuthContainerProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip during loading state
    if (isLoading) return;

    // If authentication is required but user is not logged in
    if (requireAuth && !user) {
      // Store the current path for redirect after login
      localStorage.setItem("auth_redirect", pathname);
      router.push("/admin/login");
    }

    // If user is logged in and trying to access login/signup pages
    if (user && (pathname === "/admin/login" || pathname === "/admin/signup")) {
      // Get stored redirect path or default to dashboard
      const redirectPath = localStorage.getItem("auth_redirect") || "/admin/dashboard";
      localStorage.removeItem("auth_redirect");
      router.push(redirectPath);
    }
  }, [user, isLoading, requireAuth, router, pathname]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If authentication is required and user is not logged in, show nothing
  // (router.push in useEffect will redirect)
  if (requireAuth && !user) {
    return null;
  }

  // If authentication is not required or user is logged in, show children
  return <>{children}</>;
}