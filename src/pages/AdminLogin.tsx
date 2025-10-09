import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Lock, User, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const AdminLogin = () => {
	const [credentials, setCredentials] = useState({
		email: "",
		password: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();
	const { toast } = useToast();
	const { signIn } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			// Try to sign in with Supabase
			const { error } = await signIn(credentials.email, credentials.password);
			
			if (error) {
				toast({
					title: "Login Failed",
					description: "Invalid email or password",
					variant: "destructive",
				});
			} else {
				// Check if user has admin role
				// This will be handled by the AdminAuthGuard
				toast({
					title: "Login Successful",
					description: "Welcome to the Admin Dashboard",
				});
				navigate("/admin-citizn");
			}
		} catch (err) {
			toast({
				title: "Login Failed",
				description: "An error occurred during login",
				variant: "destructive",
			});
		}

		setIsLoading(false);
	};

	return (
		<div className="h-screen overflow-hidden bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
			<div className="flex h-screen">
				{/* Left side - Image */}
				<div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
					<img 
						src="/Assets/Images/LoginSignUp.jpg" 
						alt="Admin Portal" 
						className="w-full h-full object-cover"
					/>
				</div>

				{/* Right side - Admin Login Form */}
				<div className="flex-1 flex items-center justify-center p-8">
					<div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
						<div className="text-center mb-8">
							<h1 className="text-3xl text-gray-900 font-normal">
								Admin Login
							</h1>
						</div>
						
						<form
							onSubmit={handleSubmit}
							className="space-y-6"
						>
									<div className="space-y-2">
										<Label
											htmlFor="email"
											className="text-black font-medium"
										>
											Email
										</Label>
										<div className="relative">
											<User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
											<Input
												id="email"
												type="email"
												placeholder="Enter your admin email"
												value={credentials.email}
												onChange={(e) =>
													setCredentials({
														...credentials,
														email: e.target.value,
													})
												}
												className="pl-10 border-green-300 focus:border-green-500 focus:ring-green-500 rounded-xl"
												required
											/>
										</div>
									</div>

									<div className="space-y-2">
										<Label
											htmlFor="password"
											className="text-black font-medium"
										>
											Password
										</Label>
										<div className="relative">
											<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
											<Input
												id="password"
												type={
													showPassword
														? "text"
														: "password"
												}
												placeholder="Enter your password"
												value={credentials.password}
												onChange={(e) =>
													setCredentials({
														...credentials,
														password:
															e.target.value,
													})
												}
												className="pl-10 pr-10 border-green-300 focus:border-green-500 focus:ring-green-500 rounded-xl"
												required
											/>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
												onClick={() =>
													setShowPassword(
														!showPassword
													)
												}
											>
												{showPassword ? (
													<EyeOff className="h-4 w-4 text-gray-400" />
												) : (
													<Eye className="h-4 w-4 text-gray-400" />
												)}
											</Button>
										</div>
									</div>

									<Button
										type="submit"
										className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
										disabled={isLoading}
									>
									{isLoading ? (
										<div className="flex items-center space-x-2">
											<LoadingSpinner size="sm" text="" />
											<span>Authenticating...</span>
										</div>
									) : (
										<div className="flex items-center space-x-2">
											<Shield className="h-5 w-5" />
											<span>
												Login to Admin Dashboard
											</span>
										</div>
									)}
									</Button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminLogin;
