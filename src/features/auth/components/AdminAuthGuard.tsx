import { useState, useEffect, ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface AdminAuthGuardProps {
	children: ReactNode;
}

const AdminAuthGuard = ({ children }: AdminAuthGuardProps) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
		null
	);

	useEffect(() => {
		// Check if admin is authenticated via localStorage
		const adminAuth = localStorage.getItem("adminAuthenticated");
		setIsAuthenticated(adminAuth === "true");
	}, []);

	// Show loading while checking authentication
	if (isAuthenticated === null) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
			</div>
		);
	}

	// Redirect to admin login if not authenticated
	if (!isAuthenticated) {
		return <Navigate to="/admin-login" replace />;
	}

	return <>{children}</>;
};

export default AdminAuthGuard;
