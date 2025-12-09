'use client';

import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { useCurrentProfile } from "@/hooks/use-profile";
import LoadingPage from "@/components/ui/LoadingPage";

interface AdminAuthGuardProps {
	children: React.ReactNode;
}

const AdminAuthGuard = ({ children }: AdminAuthGuardProps) => {
	const router = useRouter();
	// Use useContext directly to handle undefined context gracefully during HMR
	const authContext = useContext(AuthContext);
	
	// If context is not available (e.g., during hot reload), show loading state
	if (!authContext) {
		return <LoadingPage text="Initializing..." subtitle="Setting up authentication" />;
	}
	
	const { user, loading } = authContext;
	const { data: profile, isLoading: profileLoading } = useCurrentProfile();

	useEffect(() => {
		if (!loading && !profileLoading) {
			if (!user) {
				router.push('/admin-login');
			} else if (profile?.role !== 'admin') {
				router.push('/');
			}
		}
	}, [loading, profileLoading, user, profile, router]);

	// Show loading while checking authentication
	if (loading || profileLoading) {
		return <LoadingPage text="Verifying Admin Access..." subtitle="Checking your administrative privileges" />;
	}

	// Will redirect via useEffect if not authenticated or not admin
	if (!user || profile?.role !== 'admin') {
		return null;
	}

	return <>{children}</>;
};

export default AdminAuthGuard;
