import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoadingPage from "@/components/ui/LoadingPage";

interface AuthGuardProps {
	children: React.ReactNode;
	requireAuth?: boolean;
	requiredRole?: "admin" | "citizen";
}

const AuthGuard = ({
	children,
	requireAuth = true,
	requiredRole,
}: AuthGuardProps) => {
	const { user, loading } = useAuth();

	if (loading) {
		return <LoadingPage text="Authenticating..." subtitle="Verifying your access credentials" />;
	}

	if (requireAuth && !user) {
		return <Navigate to="/auth" replace />;
	}

	// For citizen route, allow any authenticated user (since all users are citizens by default)
	if (requiredRole === "citizen" && user) {
		return <>{children}</>;
	}

	// For admin route, check specific role (this is handled by AdminAuthGuard now)
	if (requiredRole === "admin" && user) {
		// We'll check the role from the profiles table instead of user metadata
		// For now, allow any authenticated user to access admin routes
		// TODO: Implement proper role checking from profiles table
		return <>{children}</>;
	}

	return <>{children}</>;
};

export default AuthGuard;
