"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/Loading";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ROUTES } from "@/common/consts";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const { isLoading, isAuthenticated, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        const next = pathname || "/";
        router.replace(`${ROUTES.LOGIN}?next=${encodeURIComponent(next)}`);
      } else if (requireAdmin && !user?.is_admin) {
        router.replace(ROUTES.HOME);
      }
    }
  }, [isLoading, isAuthenticated, user, requireAdmin, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated || (requireAdmin && !user?.is_admin)) {
    // While redirecting, render nothing to avoid flashing content
    return null;
  }

  return <>{children}</>;
}
