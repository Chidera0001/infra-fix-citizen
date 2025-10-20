import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import FadeInWhenVisible from "@/components/shared/FadeInWhenVisible";
import { useNavigate } from "react-router-dom";
import StatsSection from "./StatsSection";

const HeroSection = () => {
	const { user } = useAuth();
	const navigate = useNavigate();

	const handleGetStarted = () => {
		if (user) {
			navigate("/citizen");
		} else {
			navigate("/auth");
		}
	};

	return (
		<section className="py-4 sm:py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden min-h-screen flex flex-col">
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

			<div className="max-w-7xl mx-auto relative z-10 flex-1 flex items-center">
				{/* Single column centered layout for better video background experience */}
				<FadeInWhenVisible>
					<div className="text-center max-w-4xl mx-auto px-4">
						<h1 className="mt-4  text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-white mb-4 sm:mb-6 tracking-tight leading-tight drop-shadow-lg">
							Empowering Nigerians to
							<span className="block bg-gradient-to-r from-green-300 via-green-200 to-blue-300 bg-clip-text text-transparent mt-1">
								Build Better Communities
							</span>
						</h1>
						<p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 sm:mb-8 leading-relaxed font-medium drop-shadow-md max-w-3xl mx-auto">
							Connect with local government and report infrastructure issues to build better communities.
						</p>

						{/* Call-to-Action Button */}
						<Button
							onClick={handleGetStarted}
							className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0 text-sm sm:text-base w-full sm:w-auto"
							size="lg"
						>
							Start Reporting Now
							<ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
						</Button>

						{/* Stats Section - Below button on mobile, separate on desktop */}
						<StatsSection />
					</div>
				</FadeInWhenVisible>
			</div>
		</section>
	);
};

export default HeroSection;
