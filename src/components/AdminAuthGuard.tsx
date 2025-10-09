import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrentProfile } from "@/hooks/use-profile";
import LoadingPage from "@/components/ui/LoadingPage";

interface AdminAuthGuardProps {
	children: React.ReactNode;
}

const AdminAuthGuard = ({ children }: AdminAuthGuardProps) => {
	const { user, loading } = useAuth();
	const { data: profile, isLoading: profileLoading } = useCurrentProfile();

	// Show loading while checking authentication
	if (loading || profileLoading) {
		return <LoadingPage text="Verifying Admin Access..." subtitle="Checking your administrative privileges" />;
	}

	// Redirect to admin login if not authenticated
	if (!user) {
		return <Navigate to="/admin-login" replace />;
	}

	// Check if user has admin role
	if (profile?.role !== 'admin') {
		return <Navigate to="/" replace />;
	}

	return <>{children}</>;
};

export default AdminAuthGuard;
