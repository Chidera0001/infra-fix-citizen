import { Shield, Clock, Users, Circle } from "lucide-react";

const FooterSection = () => {
	return (
		<footer 
			className="py-12 sm:py-16 lg:py-20 flex items-center justify-center"
			style={{
				background: 'linear-gradient(180deg, #0F3A2A 0%, #0F3A2A 33.33%, #1A4D2E 66.67%)'
			}}
		>
			<div className="text-center space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
				{/* Logo and Brand Name */}
				<div className="flex items-center justify-center space-x-3">
					<div className="bg-[#1A4D2E] p-2 sm:p-3 rounded-md">
						{/* White Diamond Icon */}
						<div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-sm transform rotate-45 flex items-center justify-center">
							<Circle className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-green-900 fill-current" />
						</div>
					</div>
				</div>

				{/* Tagline */}
				<p className="text-[#D9D9D9] text-sm sm:text-[15px] font-normal px-4">
					Empowering Nigerian citizens to build better communities.
				</p>

				{/* Feature Pills */}
				<div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
					<div className="bg-[#0F3A2A] border border-[#1A4D2E] text-gray-300 px-3 sm:px-4 py-2 rounded-full flex items-center space-x-2">
						<Circle className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
						<span className="text-xs sm:text-sm">Enterprise Security</span>
					</div>
					<div className="bg-[#0F3A2A] border border-[#1A4D2E] text-gray-300 px-3 sm:px-4 py-2 rounded-full flex items-center space-x-2">
						<Clock className="w-3 h-3 sm:w-4 sm:h-4" />
						<span className="text-xs sm:text-sm">24/7 Monitoring</span>
					</div>
					<div className="bg-[#0F3A2A] border border-[#1A4D2E] text-gray-300 px-3 sm:px-4 py-2 rounded-full flex items-center space-x-2">
						<Users className="w-3 h-3 sm:w-4 sm:h-4" />
						<span className="text-xs sm:text-sm">Community Driven</span>
					</div>
				</div>

				{/* Copyright */}
				<p className="text-[#D9D9D9] text-xs sm:text-sm px-4">
					© 2024 Citizn. Building better Nigerian communities together.
				</p>
			</div>
		</footer>
	);
};

export default FooterSection;
