import { Camera, AlertTriangle, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import FadeInWhenVisible from "@/components/FadeInWhenVisible";

const FeaturesSection = () => {
	return (
		<section className="py-12 sm:py-16 lg:py-24 bg-white/60 backdrop-blur-sm">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<FadeInWhenVisible>
					<div className="text-center mb-12 sm:mb-16 lg:mb-20">
						<Badge className="mb-6 sm:mb-8 bg-green-50 text-green-700 border-green-200 px-4 py-2 text-sm font-medium">
							How Citizn Works
						</Badge>
						<h3 className="text-l sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900 mb-4 sm:mb-6 lg:mb-8">
							Simple, Effective, Transparent
						</h3>
					</div>
				</FadeInWhenVisible>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
					<FadeInWhenVisible delay={0.2}>
						<div className="text-center group">
							<div className="bg-gradient-to-r from-green-400 to-green-500 p-6 sm:p-8 rounded-3xl w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mx-auto mb-6 sm:mb-8 group-hover:scale-110 transition-transform duration-300 shadow-xl">
								<Camera className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
							</div>
							<h4 className="text-[18px] font-semibold text-gray-900 mb-3 sm:mb-4">
								Report
							</h4>
							<p className="text-black leading-relaxed text-xs sm:text-sm px-4">
								Capture infrastructure issues with photos
								and precise location data using our
								intuitive interface designed for Nigerian
								users
							</p>
						</div>
					</FadeInWhenVisible>
					<FadeInWhenVisible delay={0.4}>
						<div className="text-center group">
							<div className="bg-gradient-to-r from-green-500 to-green-600 p-6 sm:p-8 rounded-3xl w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mx-auto mb-6 sm:mb-8 group-hover:scale-110 transition-transform duration-300 shadow-xl">
								<AlertTriangle className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
							</div>
							<h4 className="text-[18px] font-semibold text-gray-900 mb-3 sm:mb-4">
								Track
							</h4>
							<p className="text-black leading-relaxed text-xs sm:text-sm px-4">
								Monitor real-time progress with automated
								updates as Nigerian authorities work to
								resolve reported issues
							</p>
						</div>
					</FadeInWhenVisible>
					<FadeInWhenVisible delay={0.6}>
						<div className="text-center group">
							<div className="bg-gradient-to-r from-green-600 to-green-700 p-6 sm:p-8 rounded-3xl w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mx-auto mb-6 sm:mb-8 group-hover:scale-110 transition-transform duration-300 shadow-xl">
								<CheckCircle className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
							</div>
							<h4 className="text-[18px] font-semibold text-gray-900 mb-3 sm:mb-4">
								Resolve
							</h4>
							<p className="text-black leading-relaxed text-xs sm:text-sm px-4">
								Receive instant notifications when issues
								are fixed and see tangible improvements in
								your Nigerian community
							</p>
						</div>
					</FadeInWhenVisible>
				</div>
			</div>
		</section>
	);
};

export default FeaturesSection;
