import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { UserPlus, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
	const { user, signOut } = useAuth();
	const navigate = useNavigate();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	const closeMobileMenu = () => {
		setIsMobileMenuOpen(false);
	};

	const handleSignOut = async () => {
		await signOut();
		navigate("/");
	};

	return (
		<nav className="relative z-50 w-full mb-[4rem]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0">
				{/* Semi-transparent dark background with backdrop blur */}
				<div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl">
					<div className="px-4 sm:px-6 py-3">
						<div className="flex items-center justify-between">
							{/* Logo */}
							<img 
								src="/Assets/logo/Citizn-full-logo.png" 
								alt="Citizn Logo" 
								className="h-[4rem] w-auto"
							/>

				

							{/* Desktop Auth Buttons */}
							<div className="hidden md:flex items-center space-x-4">
								{user ? (
									<div className="flex items-center space-x-3">
										{/* <span className="text-sm text-white font-medium">
											Welcome, {user?.user_metadata?.full_name || user?.email}
										</span> */}
										<Button
											onClick={() => navigate("/citizen")}
											className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0 px-4 py-2"
											size="sm"
										>
											Dashboard
										</Button>
										<Button
											onClick={handleSignOut}
											variant="outline"
											size="sm"
											className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white hover:text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0 px-4 py-2"
										>
											Sign Out
										</Button>
									</div>
								) : (
									<div className="flex items-center space-x-3">
										<Button
											onClick={() => navigate("/auth")}
											variant="outline"
											size="sm"
											className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:text-white text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0 px-4 py-2"
										>
											Sign In
										</Button>
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

							{/* Mobile Menu Button */}
							<button
								onClick={toggleMobileMenu}
								className="md:hidden p-2 text-green-700 hover:text-green-500 transition-colors duration-200"
							>
								{isMobileMenuOpen ? (
									<X className="h-6 w-6" />
								) : (
									<Menu className="h-6 w-6" />
								)}
							</button>
						</div>

						{/* Mobile Menu */}
						{isMobileMenuOpen && (
							<div className="md:hidden mt-4 pt-4 border-t border-green-700">
								<div className="flex flex-col space-y-4">
									{/* Mobile Navigation Links */}
									<a
										href="#problems"
										onClick={closeMobileMenu}
										className="text-green-700 hover:text-green-500 font-medium transition-colors duration-200 py-2"
									>
										Problems We Solve
									</a>
									<a
										href="#solution"
										onClick={closeMobileMenu}
										className="text-green-700 hover:green-500 font-medium transition-colors duration-200 py-2"
									>
										Our Solution
									</a>

									{/* Mobile Auth Buttons */}
									<div className="flex flex-col space-y-3 pt-4">
										{user ? (
											<>
												<span className="text-sm text-green-700 font-medium">
													Welcome, {user?.user_metadata?.full_name || user?.email}
												</span>
												<Button
													onClick={() => {
														navigate("/citizen");
														closeMobileMenu();
													}}
													className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0 w-full"
													size="sm"
												>
													Dashboard
												</Button>
												<Button
													onClick={() => {
														handleSignOut();
														closeMobileMenu();
													}}
													variant="outline"
													size="sm"
													className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white hover:text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0 w-full"
												>
													Sign Out
												</Button>
											</>
										) : (
											<>
												<Button
													onClick={() => {
														navigate("/auth");
														closeMobileMenu();
													}}
													variant="outline"
													size="sm"
													className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white hover:text-white font-semibold shadow-lg backdrop-blur-sm w-full"
												>
													Sign In
												</Button>
												<Button
													onClick={() => {
														navigate("/auth");
														closeMobileMenu();
													}}
													className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold shadow-lg backdrop-blur-sm w-full"
													size="sm"
												>
													<UserPlus className="h-4 w-4 mr-2" />
													Get Started
												</Button>
											</>
										)}
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
