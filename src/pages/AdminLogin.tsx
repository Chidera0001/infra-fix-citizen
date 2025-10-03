import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Lock, User, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
	const [credentials, setCredentials] = useState({
		username: "",
		password: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();
	const { toast } = useToast();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		await new Promise((resolve) => setTimeout(resolve, 1000));

		if (
			credentials.username === "Admin" &&
			credentials.password === "123456789"
		) {
			localStorage.setItem("adminAuthenticated", "true");
			localStorage.setItem("adminUser", credentials.username);

			toast({
				title: "Login Successful",
				description: "Welcome to the Nigerian Administrative Dashboard",
			});

			navigate("/admin-citizn");
		} else {
			toast({
				title: "Login Failed",
				description: "Invalid username or password",
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
											htmlFor="username"
											className="text-gray-700 font-medium"
										>
											Username
										</Label>
										<div className="relative">
											<User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
											<Input
												id="username"
												type="text"
												placeholder="Enter your username"
												value={credentials.username}
												onChange={(e) =>
													setCredentials({
														...credentials,
														username:
															e.target.value,
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
											className="text-gray-700 font-medium"
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
												<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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
