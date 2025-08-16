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
import ProblemsCards from "@/components/ProblemsCarousel";
import SolutionSection from "@/components/SolutionSection";
import Navbar from "@/components/Navbar";
import FadeInWhenVisible from "@/components/FadeInWhenVisible";
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
			{/* Enhanced Hero Section with Nigerian cultural elements */}
			<section className="py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
				{/* Video Background */}
				<div className="absolute inset-0 w-full h-full">
					<video
						src="/Assets/Videos/Hero-2.mp4"
						autoPlay
						loop
						muted
						playsInline
						className="w-full h-full object-cover"
					>
						Your browser does not support the video tag.
					</video>
					{/* Dark overlay for better text readability */}
					<div className="absolute inset-0 bg-black/40"></div>
					{/* Subtle gradient overlay */}
					<div className="absolute inset-0 bg-gradient-to-r from-green-900/30 via-transparent to-blue-900/30"></div>
				</div>

				{/* Navbar positioned inside hero section */}
				<Navbar />

				<div className="max-w-7xl mx-auto relative z-10">
					{/* Single column centered layout for better video background experience */}
					<FadeInWhenVisible>
						<div className="text-center max-w-4xl mx-auto mt-20">
							<h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-tight drop-shadow-lg">
								Empowering Nigerians to
								<span className="block bg-gradient-to-r from-green-300 via-green-200 to-blue-300 bg-clip-text text-transparent mt-1">
									Build Better Communities
								</span>
							</h1>
							<p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed font-medium drop-shadow-md">
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
					</FadeInWhenVisible>
					{/* Stats Section - Separate horizontal line below text and video */}
					<FadeInWhenVisible delay={0.2}>
						<div className="mt-16">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<FadeInWhenVisible delay={0.3}>
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
								</FadeInWhenVisible>
								<FadeInWhenVisible delay={0.4}>
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
								</FadeInWhenVisible>
								<FadeInWhenVisible delay={0.5}>
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
								</FadeInWhenVisible>
							</div>
						</div>
					</FadeInWhenVisible>
				</div>
			</section>

			{/* Problems Cards Section */}
			<section id="problems">
				<FadeInWhenVisible>
					<ProblemsCards />
				</FadeInWhenVisible>
			</section>

			{/* Solution Section */}
			<section id="solution">
				<FadeInWhenVisible>
					<SolutionSection />
				</FadeInWhenVisible>
			</section>

			{/* Enhanced Features Section with Nigerian context */}
			<section className="py-24 bg-white/60 backdrop-blur-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<FadeInWhenVisible>
						<div className="text-center mb-20">
							<Badge className="mb-8 bg-green-50 text-green-700 border-green-200 px-4 py-2 text-sm font-medium">
								How Citizn Works
							</Badge>
							<h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
								Simple, Effective, Transparent
							</h3>
							<p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium">
								Our streamlined process ensures every
								infrastructure issue gets the attention it
								deserves in Nigerian communities
							</p>
						</div>
					</FadeInWhenVisible>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-12">
						<FadeInWhenVisible delay={0.2}>
							<div className="text-center group">
								<div className="bg-gradient-to-r from-green-400 to-green-500 p-8 rounded-3xl w-24 h-24 flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-xl">
									<Camera className="h-12 w-12 text-white" />
								</div>
								<h4 className="text-2xl font-bold text-gray-900 mb-4">
									Report
								</h4>
								<p className="text-gray-700 leading-relaxed text-lg">
									Capture infrastructure issues with photos
									and precise location data using our
									intuitive interface designed for Nigerian
									users
								</p>
							</div>
						</FadeInWhenVisible>
						<FadeInWhenVisible delay={0.4}>
							<div className="text-center group">
								<div className="bg-gradient-to-r from-green-500 to-green-600 p-8 rounded-3xl w-24 h-24 flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-xl">
									<AlertTriangle className="h-12 w-12 text-white" />
								</div>
								<h4 className="text-2xl font-bold text-gray-900 mb-4">
									Track
								</h4>
								<p className="text-gray-700 leading-relaxed text-lg">
									Monitor real-time progress with automated
									updates as Nigerian authorities work to
									resolve reported issues
								</p>
							</div>
						</FadeInWhenVisible>
						<FadeInWhenVisible delay={0.6}>
							<div className="text-center group">
								<div className="bg-gradient-to-r from-green-600 to-green-700 p-8 rounded-3xl w-24 h-24 flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-xl">
									<CheckCircle className="h-12 w-12 text-white" />
								</div>
								<h4 className="text-2xl font-bold text-gray-900 mb-4">
									Resolve
								</h4>
								<p className="text-gray-700 leading-relaxed text-lg">
									Receive instant notifications when issues
									are fixed and see tangible improvements in
									your Nigerian community
								</p>
							</div>
						</FadeInWhenVisible>
					</div>
				</div>
			</section>

			{/* Enhanced Footer with Nigerian cultural elements */}
			<footer className="bg-gradient-to-r from-green-900 to-blue-900 text-white py-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<FadeInWhenVisible>
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
								© 2024 Citizn. Building better Nigerian
								communities together.
							</p>
						</div>
					</FadeInWhenVisible>
				</div>
			</footer>
		</div>
	);
};

export default Index;
