import React from "react";
import { useUser, SignInButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import CitiznLogo from "@/components/CitiznLogo";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
	const { isSignedIn, user } = useUser();
	const navigate = useNavigate();

	return (
		<nav className="relative z-50 w-full">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
				{/* Semi-transparent dark background with backdrop blur */}
				<div className="bg-black/20 backdrop-blur-md rounded-2xl  shadow-2xl">
					<div className="px-6 py-4">
						<div className="flex items-center justify-between">
							{/* Logo */}
							<CitiznLogo size="md" />

							{/* Navigation Links */}
							<div className="hidden md:flex items-center space-x-8">
								<a
									href="#problems"
									className="text-white/90 hover:text-white font-medium transition-colors duration-200"
								>
									Problems We Solve
								</a>
								<a
									href="#solution"
									className="text-white/90 hover:text-white font-medium transition-colors duration-200"
								>
									Our Solution
								</a>
							</div>

							{/* Auth Buttons */}
							<div className="flex items-center space-x-4">
								{isSignedIn ? (
									<div className="flex items-center space-x-3">
										<span className="text-sm text-white/90 font-medium">
											Welcome back, {user?.firstName}
										</span>
										<Button
											onClick={() => navigate("/citizen")}
											className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0 px-4 py-2"
											size="sm"
										>
											Dashboard
										</Button>
									</div>
								) : (
									<div className="flex items-center space-x-3">
										<SignInButton mode="modal">
											<Button
												variant="outline"
												size="sm"
												className="border-white/30 text-white bg-inherit hover:border-white/50 backdrop-blur-sm"
											>
												Sign In
											</Button>
										</SignInButton>
										<Button
											onClick={() => navigate("/auth")}
											className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold shadow-lg backdrop-blur-sm"
											size="sm"
										>
											<UserPlus className="h-4 w-4 mr-2" />
											Get Started
										</Button>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
