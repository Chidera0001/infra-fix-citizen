import { useEffect } from "react";
import ProblemsCards from "@/components/shared/ProblemsCarousel";
import SolutionSection from "@/components/sections/SolutionSection";
import FadeInWhenVisible from "@/components/shared/FadeInWhenVisible";
import { HeroSection, FeaturesSection, FooterSection, ReportNowSection } from "@/components/sections";

const Index = () => {
	useEffect(() => {
		document.title = "Citizn";
	}, []);

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
			{/* Hero Section with video background and stats */}
			<HeroSection />

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

			{/* Instant Report Section */}
			<section id="instant-report">
				<FadeInWhenVisible>
					<ReportNowSection />
				</FadeInWhenVisible>
			</section>

			{/* Features Section - How Citizn Works */}
			<FeaturesSection />

			{/* Footer Section */}
			<FooterSection />
		</div>
	);
};

export default Index;
