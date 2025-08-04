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
import {
	Shield,
	Users,
	BarChart3,
	Lock,
	User,
	Eye,
	EyeOff,
	CheckCircle,
	AlertTriangle,
} from "lucide-react";
import CitiznLogo from "@/components/CitiznLogo";
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
		<div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
			{/* Enhanced Header with Nigerian government styling */}
			<header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-green-200/50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<CitiznLogo size="md" />
				</div>
			</header>

			<div className="flex min-h-[calc(100vh-80px)]">
				{/* Left side - Enhanced Branding with Nigerian government context */}
				<div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 via-green-700 to-blue-800 p-12 flex-col justify-center relative overflow-hidden">
					{/* Nigerian government-inspired decorative elements */}
					<div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
					<div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

					<div className="max-w-md relative z-10">
						<CitiznLogo
							size="lg"
							variant="icon"
							className="mb-8 bg-white/10 backdrop-blur-sm p-4 rounded-2xl"
						/>
						<h1 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
							Administrative Access
						</h1>
						<p className="text-green-100 text-lg md:text-xl mb-10 leading-relaxed font-medium">
							Access the Nigerian government administrative
							dashboard to manage community infrastructure reports
							and citizen concerns.
						</p>

						<div className="space-y-6">
							<div className="flex items-center space-x-4 text-green-100">
								<div className="bg-white/20 p-3 rounded-xl">
									<Shield className="h-6 w-6" />
								</div>
								<div>
									<p className="font-semibold">
										Secure Government Access
									</p>
									<p className="text-green-200 text-sm">
										Protected administrative portal
									</p>
								</div>
							</div>
							<div className="flex items-center space-x-4 text-green-100">
								<div className="bg-white/20 p-3 rounded-xl">
									<Users className="h-6 w-6" />
								</div>
								<div>
									<p className="font-semibold">
										Community Management
									</p>
									<p className="text-green-200 text-sm">
										Manage Nigerian infrastructure
									</p>
								</div>
							</div>
							<div className="flex items-center space-x-4 text-green-100">
								<div className="bg-white/20 p-3 rounded-xl">
									<BarChart3 className="h-6 w-6" />
								</div>
								<div>
									<p className="font-semibold">
										Performance Analytics
									</p>
									<p className="text-green-200 text-sm">
										Track resolution metrics
									</p>
								</div>
							</div>
						</div>

						{/* Security notice */}
						<div className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
							<h3 className="text-white font-semibold mb-4 flex items-center">
								<Lock className="h-5 w-5 mr-2 text-yellow-300" />
								Security Notice
							</h3>
							<div className="space-y-3">
								<div className="flex items-center space-x-3">
									<CheckCircle className="h-4 w-4 text-green-300" />
									<span className="text-green-100 text-sm">
										Authorized personnel only
									</span>
								</div>
								<div className="flex items-center space-x-3">
									<CheckCircle className="h-4 w-4 text-green-300" />
									<span className="text-green-100 text-sm">
										Secure government credentials
									</span>
								</div>
								<div className="flex items-center space-x-3">
									<CheckCircle className="h-4 w-4 text-green-300" />
									<span className="text-green-100 text-sm">
										Activity monitoring enabled
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Right side - Enhanced Admin Login Form */}
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
								<div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6">
									<Shield className="h-8 w-8 text-white" />
								</div>
								<CardTitle className="text-3xl text-gray-900 font-bold">
									Admin Login
								</CardTitle>
								<CardDescription className="text-gray-600 text-lg font-medium">
									Access the Nigerian government
									administrative dashboard
								</CardDescription>
							</CardHeader>
							<CardContent className="px-8 pb-8">
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

								{/* Security indicators */}
								<div className="mt-8 pt-6 border-t border-gray-200">
									<div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
										<div className="flex items-center space-x-2">
											<Shield className="h-4 w-4 text-green-600" />
											<span>Secure</span>
										</div>
										<div className="flex items-center space-x-2">
											<CheckCircle className="h-4 w-4 text-green-600" />
											<span>Authorized</span>
										</div>
										<div className="flex items-center space-x-2">
											<AlertTriangle className="h-4 w-4 text-orange-600" />
											<span>Monitored</span>
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

export default AdminLogin;
