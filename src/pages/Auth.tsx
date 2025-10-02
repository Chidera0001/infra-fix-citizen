import { SignIn, SignUp, useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";

const Auth = () => {
	const { isSignedIn, isLoaded, user } = useUser();
	const [mode, setMode] = useState<"signin" | "signup">("signin");

	// Handle redirect after successful authentication
	useEffect(() => {
		if (isLoaded && isSignedIn && user) {
			// Always redirect to citizen dashboard after successful authentication
			window.location.href = "/citizen";
		}
	}, [isLoaded, isSignedIn, user]);

	// Show loading state while Clerk is initializing
	if (!isLoaded) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
					<p className="text-gray-600 font-medium">
						Loading Citizn...
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="h-screen overflow-hidden bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
			<div className="flex h-screen">
				{/* Left side - Image */}
				<div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
					<img 
						src="/Assets/Images/LoginSignUp.jpg" 
						alt="Citizn Platform" 
						className="w-full h-full object-cover"
					/>
				</div>

				{/* Right side - Clerk Auth */}
				<div className="flex-1 flex items-center justify-center p-8">
					{mode === "signin" ? (
						<SignIn
							appearance={{
								elements: {
									formButtonPrimary:
										"bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300",
									card: "shadow-2xl",
									formFieldInput:
										"border-green-300 focus:border-green-500 focus:ring-green-500 rounded-xl",
									formFieldLabel:
										"text-gray-700 font-medium",
									footerActionLink:
										"text-green-600 hover:text-green-700 font-medium",
								},
							}}
							fallbackRedirectUrl="/citizen"
						/>
					) : (
						<SignUp
							appearance={{
								elements: {
									formButtonPrimary:
										"bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300",
									card: "shadow-2xl",
									formFieldInput:
										"border-green-300 focus:border-green-500 focus:ring-green-500 rounded-xl",
									formFieldLabel:
										"text-gray-700 font-medium",
									footerActionLink:
										"text-green-600 hover:text-green-700 font-medium",
								},
							}}
							fallbackRedirectUrl="/citizen"
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default Auth;
