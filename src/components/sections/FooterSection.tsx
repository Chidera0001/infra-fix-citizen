import { Shield, Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import CitiznLogo from "@/components/CitiznLogo";
import FadeInWhenVisible from "@/components/FadeInWhenVisible";

const FooterSection = () => {
	return (
		<footer className="bg-gradient-to-r from-green-900 to-blue-900 text-white py-12 sm:py-16 lg:py-20">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<FadeInWhenVisible>
					<div className="text-center">
						<CitiznLogo
							size="lg"
							className="justify-center mb-6 sm:mb-8 text-white"
						/>
						<p className="text-green-100 mb-8 sm:mb-10 text-base sm:text-lg lg:text-xl font-medium px-4">
							Empowering Nigerian citizens to build better
							communities.
						</p>
						<div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10">
							<Badge
								variant="secondary"
								className="bg-white/10 text-green-100 border-green-300/30 px-3 sm:px-4 py-2 text-xs sm:text-sm"
							>
								<Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
								Enterprise Security
							</Badge>
							<Badge
								variant="secondary"
								className="bg-white/10 text-green-100 border-green-300/30 px-3 sm:px-4 py-2 text-xs sm:text-sm"
							>
								<Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
								24/7 Monitoring
							</Badge>
							<Badge
								variant="secondary"
								className="bg-white/10 text-green-100 border-green-300/30 px-3 sm:px-4 py-2 text-xs sm:text-sm"
							>
								<Users className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
								Community Driven
							</Badge>
						</div>
						<p className="text-green-200 font-medium text-sm sm:text-base px-4">
							© 2024 Citizn. Building better Nigerian
							communities together.
						</p>
					</div>
				</FadeInWhenVisible>
			</div>
		</footer>
	);
};

export default FooterSection;
