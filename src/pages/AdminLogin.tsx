import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, BarChart3, Lock, User } from "lucide-react";
import CitiznLogo from "@/components/CitiznLogo";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
	const [credentials, setCredentials] = useState({
		username: "",
		password: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const { toast } = useToast();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		// Simulate API call delay
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Check credentials
		if (
			credentials.username === "Admin" &&
			credentials.password === "123456789"
		) {
			// Store admin session
			localStorage.setItem("adminAuthenticated", "true");
			localStorage.setItem("adminUser", credentials.username);

			toast({
				title: "Login Successful",
				description: "Welcome to the Admin Dashboard",
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

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCredentials({
			...credentials,
			[e.target.name]: e.target.value,
		});
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
			{/* Header */}
			<header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<CitiznLogo size="md" />
				</div>
			</header>

			<div className="flex min-h-[calc(100vh-80px)]">
				{/* Left side - Branding */}
				<div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-green-800 p-12 flex-col justify-center">
					<div className="max-w-md">
						<div className="mb-8">
							<div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl w-16 h-16 flex items-center justify-center mb-4">
								<Shield className="h-8 w-8 text-white" />
							</div>
						</div>
						<h1 className="text-4xl font-bold text-white mb-6 leading-tight">
							Administrative Dashboard
						</h1>
						<p className="text-green-100 text-lg mb-8 leading-relaxed">
							Access comprehensive tools to manage citizen
							reports, coordinate response efforts, and track
							community infrastructure improvements.
						</p>

						<div className="space-y-4">
							<div className="flex items-center space-x-3 text-green-100">
								<BarChart3 className="h-5 w-5" />
								<span>Comprehensive Analytics</span>
							</div>
							<div className="flex items-center space-x-3 text-green-100">
								<Users className="h-5 w-5" />
								<span>Team Coordination</span>
							</div>
							<div className="flex items-center space-x-3 text-green-100">
								<Shield className="h-5 w-5" />
								<span>Secure Access Control</span>
							</div>
						</div>
					</div>
				</div>

				{/* Right side - Login Form */}
				<div className="flex-1 flex items-center justify-center p-8">
					<div className="w-full max-w-md">
						<Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
							<CardHeader className="text-center pb-6">
								<div className="lg:hidden mb-4">
									<CitiznLogo
										size="md"
										className="justify-center"
									/>
								</div>
								<div className="bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
									<Lock className="h-8 w-8 text-green-600" />
								</div>
								<CardTitle className="text-2xl text-gray-900">
									Admin Login
								</CardTitle>
								<CardDescription className="text-gray-600">
									Enter your credentials to access the
									administrative dashboard
								</CardDescription>
							</CardHeader>
							<CardContent>
								<form
									onSubmit={handleSubmit}
									className="space-y-4"
								>
									<div className="space-y-2">
										<Label htmlFor="username">
											Username
										</Label>
										<div className="relative">
											<User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
											<Input
												id="username"
												name="username"
												type="text"
												placeholder="Enter username"
												value={credentials.username}
												onChange={handleInputChange}
												className="pl-10"
												required
											/>
										</div>
									</div>

									<div className="space-y-2">
										<Label htmlFor="password">
											Password
										</Label>
										<div className="relative">
											<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
											<Input
												id="password"
												name="password"
												type="password"
												placeholder="Enter password"
												value={credentials.password}
												onChange={handleInputChange}
												className="pl-10"
												required
											/>
										</div>
									</div>

									<Button
										type="submit"
										className="w-full bg-green-600 hover:bg-green-700"
										disabled={isLoading}
									>
										{isLoading ? (
											<div className="flex items-center space-x-2">
												<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
												<span>Signing in...</span>
											</div>
										) : (
											"Sign In"
										)}
									</Button>
								</form>

								<div className="mt-6 text-center">
									<Button
										variant="ghost"
										onClick={() => navigate("/")}
										className="text-gray-600 hover:text-gray-900"
									>
										← Back to Home
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminLogin;
