import { SignIn, SignUp, useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import CitiznLogo from "@/components/CitiznLogo";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Shield,
	Users,
	BarChart3,
	CheckCircle,
	Star,
	TrendingUp,
} from "lucide-react";

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
		<div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
			{/* Enhanced Header with Nigerian styling */}
			<header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-green-200/50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<CitiznLogo size="md" />
				</div>
			</header>

			<div className="flex min-h-[calc(100vh-80px)]">
				{/* Left side - Enhanced Branding with Nigerian context */}
				<div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 via-green-700 to-blue-800 p-12 flex-col justify-center relative overflow-hidden">
					{/* Nigerian flag-inspired decorative elements */}
					<div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
					<div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

					<div className="max-w-md relative z-10">
						<CitiznLogo
							size="lg"
							variant="icon"
							className="mb-8 bg-white/10 backdrop-blur-sm p-4 rounded-2xl"
						/>
						<h1 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
							Join Your Nigerian Community
						</h1>
						<p className="text-green-100 text-lg md:text-xl mb-10 leading-relaxed font-medium">
							Start reporting issues and making a real difference
							in your Nigerian community through transparent
							reporting and collaborative problem-solving.
						</p>

						<div className="space-y-6">
							<div className="flex items-center space-x-4 text-green-100">
								<div className="bg-white/20 p-3 rounded-xl">
									<Shield className="h-6 w-6" />
								</div>
								<div>
									<p className="font-semibold">
										Secure & Professional Platform
									</p>
									<p className="text-green-200 text-sm">
										Trusted by Nigerian communities
									</p>
								</div>
							</div>
							<div className="flex items-center space-x-4 text-green-100">
								<div className="bg-white/20 p-3 rounded-xl">
									<Users className="h-6 w-6" />
								</div>
								<div>
									<p className="font-semibold">
										Community-Driven Solutions
									</p>
									<p className="text-green-200 text-sm">
										Real impact in your neighborhood
									</p>
								</div>
							</div>
							<div className="flex items-center space-x-4 text-green-100">
								<div className="bg-white/20 p-3 rounded-xl">
									<BarChart3 className="h-6 w-6" />
								</div>
								<div>
									<p className="font-semibold">
										Real-Time Progress Tracking
									</p>
									<p className="text-green-200 text-sm">
										See your reports make a difference
									</p>
								</div>
							</div>
						</div>

						{/* Success stories section */}
						<div className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
							<h3 className="text-white font-semibold mb-4 flex items-center">
								<Star className="h-5 w-5 mr-2 text-yellow-300" />
								Success Stories
							</h3>
							<div className="space-y-3">
								<div className="flex items-center space-x-3">
									<CheckCircle className="h-4 w-4 text-green-300" />
									<span className="text-green-100 text-sm">
										2,847 issues resolved across Nigeria
									</span>
								</div>
								<div className="flex items-center space-x-3">
									<TrendingUp className="h-4 w-4 text-green-300" />
									<span className="text-green-100 text-sm">
										85% resolution rate in Lagos
									</span>
								</div>
								<div className="flex items-center space-x-3">
									<Users className="h-4 w-4 text-green-300" />
									<span className="text-green-100 text-sm">
										15,632 active Nigerian citizens
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Right side - Enhanced Auth Forms */}
				<div className="flex-1 flex items-center justify-center p-8">
					<div className="w-full max-w-md">
						<Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden">
							<CardHeader className="text-center pb-8 pt-12">
								<div className="lg:hidden mb-6">
									<CitiznLogo
										size="md"
										className="justify-center"
									/>
								</div>
								<CardTitle className="text-3xl text-gray-900 font-bold">
									{mode === "signin"
										? "Welcome Back"
										: "Join Citizn"}
								</CardTitle>
								<CardDescription className="text-gray-600 text-lg font-medium">
									{mode === "signin"
										? "Sign in to your account to continue making a difference in your Nigerian community"
										: "Create your account to start reporting and tracking issues in your neighborhood"}
								</CardDescription>
							</CardHeader>
							<CardContent className="px-8 pb-8">
								<div className="mb-8">
									{mode === "signin" ? (
										<SignIn
											appearance={{
												elements: {
													formButtonPrimary:
														"bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300",
													card: "bg-transparent shadow-none",
													headerTitle: "hidden",
													headerSubtitle: "hidden",
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
													card: "bg-transparent shadow-none",
													headerTitle: "hidden",
													headerSubtitle: "hidden",
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

								{/* Enhanced mode toggle */}
								<div className="text-center">
									<p className="text-gray-600 mb-4">
										{mode === "signin"
											? "Don't have an account?"
											: "Already have an account?"}
									</p>
									<Button
										variant="outline"
										onClick={() =>
											setMode(
												mode === "signin"
													? "signup"
													: "signin"
											)
										}
										className="border-green-300 text-green-700 hover:bg-green-50 font-medium"
									>
										{mode === "signin"
											? "Create Account"
											: "Sign In"}
									</Button>
								</div>

								{/* Trust indicators */}
								<div className="mt-8 pt-6 border-t border-gray-200">
									<div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
										<div className="flex items-center space-x-2">
											<Shield className="h-4 w-4 text-green-600" />
											<span>Secure</span>
										</div>
										<div className="flex items-center space-x-2">
											<CheckCircle className="h-4 w-4 text-green-600" />
											<span>Trusted</span>
										</div>
										<div className="flex items-center space-x-2">
											<Users className="h-4 w-4 text-green-600" />
											<span>Community</span>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Auth;
