import React from "react";
import { CheckCircle, ArrowRight, Shield, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const SolutionSection: React.FC = () => {
	const navigate = useNavigate();

	const handleExplorePlatform = () => {
		navigate('/auth');
	};

	return (
		<section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 relative overflow-hidden">
			{/* Background Pattern */}
			<div className="absolute inset-0 opacity-20">
				<div className="absolute top-20 left-10 w-32 h-32 bg-green-300 rounded-full blur-3xl"></div>
				<div className="absolute bottom-20 right-10 w-24 h-24 bg-blue-300 rounded-full blur-3xl"></div>
				<div className="absolute top-1/2 left-1/3 w-16 h-16 bg-green-200 rounded-full blur-2xl"></div>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
				{/* Header */}
				<div className="text-center mb-12 sm:mb-16 lg:mb-20">
					<Badge className="mb-6 gap-2 sm:mb-8 bg-green-100 text-green-700 border-green-200 px-4 py-2 text-sm font-medium">
						<div 
							className="h-4 w-4 bg-[#0A6E2A] mask-[url('/Assets/icons/Tick.svg')] mask-no-repeat mask-center mask-contain"
							style={{ WebkitMask: "url('/Assets/icons/Tick.svg') no-repeat center / contain" }}
						/>
						Our Solution
					</Badge>
					<h3 className="text-l sm:text-2xl md:text-3xl lg:text-3xl font-semibold text-gray-900 mb-6 sm:mb-8 px-4">
						Citizn: Bridging Citizens & Government
					</h3>
				</div>

				{/* Main Content - Two Column Layout */}
				<div className="grid grid-cols-1 lg:grid-cols-5 gap-8 sm:gap-12 lg:gap-16 items-start">
					{/* Left Column - Text Content */}
					<div className="lg:col-span-2 space-y-4 sm:space-y-6">
						{/* Digital Reporting Platform */}
						<div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-green-200/30 shadow-lg">
							{/* Icon at the top */}
							<div className="flex justify-start mb-4">
								<div className="bg-[#A6E6C1] p-2 rounded-xl">
								<div 
									className="h-6 w-6 bg-[#0A6E2A] mask-[url('/Assets/icons/Shield.svg')] mask-no-repeat mask-center mask-contain"
									style={{ WebkitMask: "url('/Assets/icons/Shield.svg') no-repeat center / contain" }}
								/>
								</div>
							</div>
							<h4 className="text-[14px] font-semibold text-gray-900 text-left mb-3 sm:mb-4">
								Digital Reporting Platform
							</h4>
							<p className="text-black text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
								Citizn provides an intuitive mobile and web
								platform where citizens can easily report
								infrastructure issues with photos, precise
								location data, and detailed descriptions.
							</p>
							<div className="space-y-2">
								<div className="flex items-center space-x-3">
									<div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full flex-shrink-0"></div>
									<span className="text-black text-xs sm:text-sm">
										Easy photo and location capture
									</span>
								</div>
								<div className="flex items-center space-x-3">
									<div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full flex-shrink-0"></div>
									<span className="text-black text-xs sm:text-sm">
										Real-time issue tracking
									</span>
								</div>
								<div className="flex items-center space-x-3">
									<div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full flex-shrink-0"></div>
									<span className="text-black text-xs sm:text-sm">
										Direct communication with authorities
									</span>
								</div>
							</div>
						</div>

						{/* Efficient Resolution Process */}
						<div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-green-200/30 shadow-lg">
							{/* Icon at the top */}
							<div className="flex justify-start mb-4">
								<div className="bg-[#A6E6C1] p-2 rounded-xl">
									<div 
										className="h-6 w-6 bg-[#0A6E2A] mask-[url('/Assets/icons/People.svg')] mask-no-repeat mask-center mask-contain"
										style={{ WebkitMask: "url('/Assets/icons/People.svg') no-repeat center / contain" }}
									/>
								</div>
							</div>
							<h4 className="text-[14px] font-semibold text-gray-900 text-left mb-3 sm:mb-4">
								Efficient Resolution Process
							</h4>
							<p className="text-black text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
								Our platform streamlines the resolution process
								by connecting citizens directly with the right
								government departments for faster response
								times.
							</p>
							<div className="space-y-2">
								<div className="flex items-center space-x-3">
									<div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full flex-shrink-0"></div>
									<span className="text-black text-xs sm:text-sm">
										Direct routing to appropriate
										departments
									</span>
								</div>
								<div className="flex items-center space-x-3">
									<div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full flex-shrink-0"></div>
									<span className="text-black text-xs sm:text-sm">
										Progress tracking and updates
									</span>
								</div>
								<div className="flex items-center space-x-3">
									<div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full flex-shrink-0"></div>
									<span className="text-black text-xs sm:text-sm">
										Accountability and transparency
									</span>
								</div>
							</div>
						</div>

						{/* Call to Action - Left aligned */}
						<div className="pt-2 sm:pt-4">
							<Button
								onClick={handleExplorePlatform}
								className="text-[14px] font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white  py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base transform hover:-translate-y-1 w-fit"
								size="lg"
							>
								Explore Our Platform
								<ArrowRight className="h-4 w-4 ml-2" />
							</Button>
						</div>
					</div>

					{/* Right Column - Image Background */}
					<div className="lg:col-span-3 relative">
						<div className="relative w-full h-[300px] sm:h-[400px] lg:h-[600px] rounded-2xl shadow-xl">
							{/* Background Image */}
							<img
								src="/Assets/Images/LoginSignUp.jpg"
								alt="Citizn platform interface and resolution process"
								className="w-full h-full object-contain"
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default SolutionSection;
