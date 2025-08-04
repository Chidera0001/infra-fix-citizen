import { useUser, SignInButton } from "@clerk/clerk-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	MapPin,
	Camera,
	BarChart3,
	Users,
	CheckCircle,
	AlertTriangle,
	ArrowRight,
	Star,
	Shield,
	Clock,
	UserPlus,
	TrendingUp,
	Heart,
	Target,
	Wrench,
	Lightbulb,
	Navigation,
} from "lucide-react";
import CitiznLogo from "@/components/CitiznLogo";
import { useNavigate } from "react-router-dom";

const Index = () => {
	const { isSignedIn, user } = useUser();
	const navigate = useNavigate();

	useEffect(() => {
		document.title = "Citizn";
	}, []);

	const handleGetStarted = () => {
		if (isSignedIn) {
			navigate("/citizen");
		} else {
			navigate("/auth");
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
			{/* Enhanced Header with Nigerian-inspired styling */}
			<header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-green-200/50 sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center justify-between">
						<CitiznLogo size="md" />
						<div className="flex items-center space-x-4">
							{isSignedIn ? (
								<div className="flex items-center space-x-3">
									<span className="text-sm text-gray-700 font-medium">
										Welcome back, {user?.firstName}
									</span>
									<Button
										onClick={() => navigate("/citizen")}
										variant="outline"
										size="sm"
										className="border-green-300 text-green-700 hover:bg-green-50"
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
											className="border-green-300 text-green-700 hover:bg-green-50"
										>
											Sign In
										</Button>
									</SignInButton>
									<Button
										onClick={() => navigate("/auth")}
										className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold shadow-lg"
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
			</header>

			{/* Enhanced Hero Section with Nigerian cultural elements */}
			<section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
				{/* Nigerian flag-inspired gradient background */}
				<div className="absolute inset-0 bg-gradient-to-r from-green-600/5 via-white/10 to-green-600/5 transform -skew-y-1"></div>
				<div className="max-w-7xl mx-auto relative">
					{/* Two-column hero layout */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
						{/* Left Column - Text Content */}
						<div className="text-left">
							<Badge className="mb-6 bg-green-50 text-green-700 border-green-200 hover:bg-green-100 px-3 py-1 text-xs font-medium">
								<Shield className="h-3 w-3 mr-1" />
								Trusted by Nigerian Communities
							</Badge>
							<h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
								Empowering Nigerians to
								<span className="block bg-gradient-to-r from-green-600 via-green-500 to-blue-600 bg-clip-text text-transparent mt-1">
									Build Better Communities
								</span>
							</h1>
							<p className="text-l md:text-m text-gray-700 mb-8 leading-relaxed font-medium">
								Citizn connects engaged Nigerian citizens with
								responsive local government through our
								professional-grade infrastructure reporting
								platform. Make your voice heard and see real
								change happen in your community.
							</p>

							{/* Call-to-Action Button */}
							<Button
								onClick={handleGetStarted}
								className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-base"
								size="lg"
							>
								Start Reporting Now
								<ArrowRight className="h-5 w-5 ml-2" />
							</Button>
						</div>

						{/* Right Column - Video */}
						<div className="relative">
							<div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 p-6 rounded-2xl">
								<video
									src="/Assets/Videos/Hero-video.mp4"
									autoPlay
									loop
									muted
									playsInline
									className="w-full h-80 object-cover rounded-xl shadow-xl"
								>
									Your browser does not support the video tag.
								</video>
							</div>
							{/* Floating elements for visual appeal */}
							<div className="absolute -top-3 -right-3 bg-white p-3 rounded-xl shadow-lg">
								<Camera className="h-6 w-6 text-green-600" />
							</div>
							<div className="absolute -bottom-3 -left-3 bg-white p-3 rounded-xl shadow-lg">
								<CheckCircle className="h-6 w-6 text-blue-600" />
							</div>
						</div>
					</div>

					{/* Stats Section - Separate horizontal line below text and video */}
					<div className="mt-16">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-green-200/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
								<div className="flex items-center justify-center mb-4">
									<div className="bg-green-100 p-3 rounded-xl">
										<CheckCircle className="h-8 w-8 text-green-600" />
									</div>
								</div>
								<h3 className="text-3xl font-bold text-center text-gray-900 mb-2">
									2,847
								</h3>
								<p className="text-gray-700 font-semibold text-base text-center">
									Issues Resolved
								</p>
								<div className="mt-2 text-sm text-green-600 font-medium flex items-center justify-center">
									<TrendingUp className="h-4 w-4 mr-1" />
									+34% this month
								</div>
							</div>
							<div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-green-200/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
								<div className="flex items-center justify-center mb-4">
									<div className="bg-green-100 p-3 rounded-xl">
										<Users className="h-8 w-8 text-green-600" />
									</div>
								</div>
								<h3 className="text-3xl font-bold text-center text-gray-900 mb-2">
									15,632
								</h3>
								<p className="text-gray-700 font-semibold text-base text-center">
									Active Citizens
								</p>
								<div className="mt-2 text-sm text-green-600 font-medium flex items-center justify-center">
									<Heart className="h-4 w-4 mr-1" />
									Growing community
								</div>
							</div>
							<div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-green-200/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
								<div className="flex items-center justify-center mb-4">
									<div className="bg-green-100 p-3 rounded-xl">
										<Clock className="h-8 w-8 text-green-600" />
									</div>
								</div>
								<h3 className="text-3xl font-bold text-center text-gray-900 mb-2">
									1.8 hrs
								</h3>
								<p className="text-gray-700 font-semibold text-base text-center">
									Avg Response Time
								</p>
								<div className="mt-2 text-sm text-green-600 font-medium flex items-center justify-center">
									<Target className="h-4 w-4 mr-1" />
									Industry leading
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Problem Statement Section with Realistic Images */}
			<section className="py-24 bg-white/60 backdrop-blur-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-20">
						<Badge className="mb-8 bg-green-50 text-green-700 border-green-200 px-4 py-2 text-sm font-medium">
							<AlertTriangle className="h-4 w-4 mr-2" />
							The Problem We Solve
						</Badge>
						<h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
							Infrastructure Issues Affecting Nigerian Communities
						</h3>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
						<div>
							<h4 className="text-3xl font-bold text-gray-900 mb-6">
								Broken Roads & Potholes
							</h4>
							<p className="text-gray-700 text-lg leading-relaxed mb-6">
								Major roads across Nigeria suffer from severe
								potholes, broken surfaces, and inadequate
								maintenance, causing vehicle damage, accidents,
								and traffic congestion that affects daily
								commutes and economic activities.
							</p>
							<div className="space-y-4">
								<div className="flex items-center space-x-3">
									<div className="w-2 h-2 bg-green-500 rounded-full"></div>
									<span className="text-gray-700">
										Vehicle damage and increased repair
										costs
									</span>
								</div>
								<div className="flex items-center space-x-3">
									<div className="w-2 h-2 bg-green-500 rounded-full"></div>
									<span className="text-gray-700">
										Traffic congestion and longer commute
										times
									</span>
								</div>
								<div className="flex items-center space-x-3">
									<div className="w-2 h-2 bg-green-500 rounded-full"></div>
									<span className="text-gray-700">
										Safety risks for motorists and
										pedestrians
									</span>
								</div>
							</div>
						</div>
						<div className="relative">
							<div className="bg-gradient-to-br from-green-500/10 to-green-600/10 p-8 rounded-3xl">
								<img
									src="/Assets/Images/Bad-road.jpg"
									alt="Nigerian road with potholes"
									className="w-full h-80 object-cover rounded-2xl shadow-2xl"
								/>
							</div>
							<div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-2xl shadow-lg">
								<Navigation className="h-8 w-8 text-green-600" />
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
						<div className="relative">
							<div className="bg-gradient-to-br from-green-500/10 to-green-600/10 p-8 rounded-3xl">
								<img
									src="/Assets/Images/Street-light.jpg"
									alt="Broken streetlights in Nigerian community"
									className="w-full h-80 object-cover rounded-2xl shadow-2xl"
								/>
							</div>
							<div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-2xl shadow-lg">
								<Lightbulb className="h-8 w-8 text-green-600" />
							</div>
						</div>
						<div>
							<h4 className="text-3xl font-bold text-gray-900 mb-6">
								Broken Street Lights
							</h4>
							<p className="text-gray-700 text-lg leading-relaxed mb-6">
								Non-functional street lights create safety
								hazards and security concerns in Nigerian
								communities, leading to increased crime rates,
								limited nighttime activities, and pedestrian
								safety issues that affect the overall quality of
								life.
							</p>
							<div className="space-y-4">
								<div className="flex items-center space-x-3">
									<div className="w-2 h-2 bg-green-500 rounded-full"></div>
									<span className="text-gray-700">
										Increased crime rates in dark areas
									</span>
								</div>
								<div className="flex items-center space-x-3">
									<div className="w-2 h-2 bg-green-500 rounded-full"></div>
									<span className="text-gray-700">
										Limited nighttime business activities
									</span>
								</div>
								<div className="flex items-center space-x-3">
									<div className="w-2 h-2 bg-green-500 rounded-full"></div>
									<span className="text-gray-700">
										Pedestrian safety concerns
									</span>
								</div>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
						<div>
							<h4 className="text-3xl font-bold text-gray-900 mb-6">
								Poor Drainage Systems
							</h4>
							<p className="text-gray-700 text-lg leading-relaxed mb-6">
								Inadequate drainage infrastructure leads to
								flooding during rainy seasons, property damage,
								and health risks from stagnant water, affecting
								the quality of life in many Nigerian
								communities.
							</p>
							<div className="space-y-4">
								<div className="flex items-center space-x-3">
									<div className="w-2 h-2 bg-green-500 rounded-full"></div>
									<span className="text-gray-700">
										Flooding during rainy seasons
									</span>
								</div>
								<div className="flex items-center space-x-3">
									<div className="w-2 h-2 bg-green-500 rounded-full"></div>
									<span className="text-gray-700">
										Health risks from stagnant water
									</span>
								</div>
								<div className="flex items-center space-x-3">
									<div className="w-2 h-2 bg-green-500 rounded-full"></div>
									<span className="text-gray-700">
										Property damage and economic losses
									</span>
								</div>
							</div>
						</div>
						<div className="relative">
							<div className="bg-gradient-to-br from-green-500/10 to-green-600/10 p-8 rounded-3xl">
								<img
									src="/Assets/Images/Drainnage.jpg"
									alt="Poor drainage causing flooding in Nigerian community"
									className="w-full h-80 object-cover rounded-2xl shadow-2xl"
								/>
							</div>
							<div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-2xl shadow-lg">
								<Wrench className="h-8 w-8 text-green-600" />
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Solution Section with Impact Images */}
			<section className="py-24 bg-gradient-to-br from-green-50 to-blue-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-20">
						<Badge className="mb-8 bg-green-50 text-green-700 border-green-200 px-4 py-2 text-sm font-medium">
							<CheckCircle className="h-4 w-4 mr-2" />
							Our Solution
						</Badge>
						<h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
							Citizn: Bridging Citizens & Government
						</h3>
						<p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium">
							We provide a digital platform that connects Nigerian
							citizens with local authorities to report, track,
							and resolve infrastructure issues efficiently
						</p>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
						<div>
							<h4 className="text-3xl font-bold text-gray-900 mb-6">
								Digital Reporting Platform
							</h4>
							<p className="text-gray-700 text-lg leading-relaxed mb-6">
								Citizn provides an intuitive mobile and web
								platform where citizens can easily report
								infrastructure issues with photos, precise
								location data, and detailed descriptions,
								ensuring authorities receive comprehensive
								information for quick resolution.
							</p>
							<div className="space-y-4">
								<div className="flex items-center space-x-3">
									<div className="w-2 h-2 bg-green-500 rounded-full"></div>
									<span className="text-gray-700">
										Easy photo and location capture
									</span>
								</div>
								<div className="flex items-center space-x-3">
									<div className="w-2 h-2 bg-green-500 rounded-full"></div>
									<span className="text-gray-700">
										Real-time issue tracking
									</span>
								</div>
								<div className="flex items-center space-x-3">
									<div className="w-2 h-2 bg-green-500 rounded-full"></div>
									<span className="text-gray-700">
										Direct communication with authorities
									</span>
								</div>
							</div>
						</div>
						<div className="relative">
							<div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-8 rounded-3xl">
								<img
									src="/Assets/Images/Platform.png"
									alt="Digital reporting platform interface"
									className="w-full h-80 object-cover rounded-2xl shadow-2xl"
								/>
							</div>
							<div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-2xl shadow-lg">
								<Camera className="h-8 w-8 text-green-600" />
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
						<div className="order-2 lg:order-1 relative">
							<div className="bg-gradient-to-br from-green-500/10 to-green-600/10 p-8 rounded-3xl">
								<img
									src="/Assets/Images/Resolution process.jpg"
									alt="Efficient resolution process workflow"
									className="w-full h-80 object-cover rounded-2xl shadow-2xl"
								/>
							</div>
							<div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-2xl shadow-lg">
								<Wrench className="h-8 w-8 text-green-600" />
							</div>
						</div>
						<div className="order-1 lg:order-2">
							<h4 className="text-3xl font-bold text-gray-900 mb-6">
								Efficient Resolution Process
							</h4>
							<p className="text-gray-700 text-lg leading-relaxed mb-6">
								Our platform streamlines the resolution process
								by connecting citizens directly with the right
								government departments, ensuring faster response
								times and better accountability in
								infrastructure maintenance.
							</p>
							<div className="space-y-4">
								<div className="flex items-center space-x-3">
									<div className="w-2 h-2 bg-green-500 rounded-full"></div>
									<span className="text-gray-700">
										Direct routing to appropriate
										departments
									</span>
								</div>
								<div className="flex items-center space-x-3">
									<div className="w-2 h-2 bg-green-500 rounded-full"></div>
									<span className="text-gray-700">
										Progress tracking and updates
									</span>
								</div>
								<div className="flex items-center space-x-3">
									<div className="w-2 h-2 bg-green-500 rounded-full"></div>
									<span className="text-gray-700">
										Accountability and transparency
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Enhanced Features Section with Nigerian context */}
			<section className="py-24 bg-white/60 backdrop-blur-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-20">
						<Badge className="mb-8 bg-green-50 text-green-700 border-green-200 px-4 py-2 text-sm font-medium">
							How Citizn Works
						</Badge>
						<h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
							Simple, Effective, Transparent
						</h3>
						<p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium">
							Our streamlined process ensures every infrastructure
							issue gets the attention it deserves in Nigerian
							communities
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-12">
						<div className="text-center group">
							<div className="bg-gradient-to-r from-green-400 to-green-500 p-8 rounded-3xl w-24 h-24 flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-xl">
								<Camera className="h-12 w-12 text-white" />
							</div>
							<h4 className="text-2xl font-bold text-gray-900 mb-4">
								Report
							</h4>
							<p className="text-gray-700 leading-relaxed text-lg">
								Capture infrastructure issues with photos and
								precise location data using our intuitive
								interface designed for Nigerian users
							</p>
						</div>
						<div className="text-center group">
							<div className="bg-gradient-to-r from-green-500 to-green-600 p-8 rounded-3xl w-24 h-24 flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-xl">
								<AlertTriangle className="h-12 w-12 text-white" />
							</div>
							<h4 className="text-2xl font-bold text-gray-900 mb-4">
								Track
							</h4>
							<p className="text-gray-700 leading-relaxed text-lg">
								Monitor real-time progress with automated
								updates as Nigerian authorities work to resolve
								reported issues
							</p>
						</div>
						<div className="text-center group">
							<div className="bg-gradient-to-r from-green-600 to-green-700 p-8 rounded-3xl w-24 h-24 flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-xl">
								<CheckCircle className="h-12 w-12 text-white" />
							</div>
							<h4 className="text-2xl font-bold text-gray-900 mb-4">
								Resolve
							</h4>
							<p className="text-gray-700 leading-relaxed text-lg">
								Receive instant notifications when issues are
								fixed and see tangible improvements in your
								Nigerian community
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Enhanced Footer with Nigerian cultural elements */}
			<footer className="bg-gradient-to-r from-green-900 to-blue-900 text-white py-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center">
						<CitiznLogo
							size="lg"
							className="justify-center mb-8 text-white"
						/>
						<p className="text-green-100 mb-10 text-xl font-medium">
							Empowering Nigerian citizens to build better
							communities.
						</p>
						<div className="flex items-center justify-center space-x-8 mb-10">
							<Badge
								variant="secondary"
								className="bg-white/10 text-green-100 border-green-300/30 px-4 py-2"
							>
								<Shield className="h-4 w-4 mr-2" />
								Enterprise Security
							</Badge>
							<Badge
								variant="secondary"
								className="bg-white/10 text-green-100 border-green-300/30 px-4 py-2"
							>
								<Clock className="h-4 w-4 mr-2" />
								24/7 Monitoring
							</Badge>
							<Badge
								variant="secondary"
								className="bg-white/10 text-green-100 border-green-300/30 px-4 py-2"
							>
								<Users className="h-4 w-4 mr-2" />
								Community Driven
							</Badge>
						</div>
						<p className="text-green-200 font-medium">
							© 2024 Citizn. Building better Nigerian communities
							together.
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default Index;
