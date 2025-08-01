import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

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
	const { isLoaded, isSignedIn, user } = useUser();

	if (!isLoaded) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	if (requireAuth && !isSignedIn) {
		return <Navigate to="/auth" replace />;
	}

	// For citizen route, allow any authenticated user (since all users are citizens by default)
	if (requiredRole === "citizen" && isSignedIn) {
		return <>{children}</>;
	}

	// For admin route, check specific role (this is handled by AdminAuthGuard now)
	if (requiredRole === "admin" && user) {
		const userRole = user.publicMetadata?.role as string;
		if (userRole !== requiredRole) {
			return <Navigate to="/" replace />;
		}
	}

	return <>{children}</>;
};

export default AuthGuard;
