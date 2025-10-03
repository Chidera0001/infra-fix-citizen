import React from "react";
import { CheckCircle, ArrowRight, Shield, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const SolutionSection: React.FC = () => {
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
					<Badge className="mb-6 sm:mb-8 bg-green-100 text-green-700 border-green-200 px-4 py-2 text-sm font-medium">
						<CheckCircle className="h-4 w-4 mr-2" />
						Our Solution
					</Badge>
					<h3 className="text-l sm:text-2xl md:text-3xl lg:text-4xl font-normal text-gray-900 mb-6 sm:mb-8 px-4">
						Citizn: Bridging Citizens & Government
					</h3>
				</div>

				{/* Main Content - Two Column Layout */}
				<div className="grid grid-cols-1 lg:grid-cols-5 gap-8 sm:gap-12 lg:gap-16 items-center">
					{/* Left Column - Text Content */}
					<div className="lg:col-span-2 space-y-4 sm:space-y-6">
						{/* Digital Reporting Platform */}
						<div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-green-200/30 shadow-lg">
							<div className="flex items-center mb-3 sm:mb-4">
								<div className="bg-green-500 p-2 rounded-xl mr-3">
									<Shield className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
								</div>
								<h4 className="text-lg sm:text-xl font-normal text-gray-900">
									Digital Reporting Platform
								</h4>
							</div>
							<p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4">
								Citizn provides an intuitive mobile and web
								platform where citizens can easily report
								infrastructure issues with photos, precise
								location data, and detailed descriptions.
							</p>
							<div className="space-y-2">
								<div className="flex items-center space-x-3">
									<div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full flex-shrink-0"></div>
									<span className="text-gray-700 text-xs sm:text-sm">
										Easy photo and location capture
									</span>
								</div>
								<div className="flex items-center space-x-3">
									<div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full flex-shrink-0"></div>
									<span className="text-gray-700 text-xs sm:text-sm">
										Real-time issue tracking
									</span>
								</div>
								<div className="flex items-center space-x-3">
									<div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full flex-shrink-0"></div>
									<span className="text-gray-700 text-xs sm:text-sm">
										Direct communication with authorities
									</span>
								</div>
							</div>
						</div>

						{/* Efficient Resolution Process */}
						<div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-green-200/30 shadow-lg">
							<div className="flex items-center mb-3 sm:mb-4">
								<div className="bg-green-500 p-2 rounded-xl mr-3">
									<Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
								</div>
								<h4 className="text-lg sm:text-xl font-normal text-gray-900">
									Efficient Resolution Process
								</h4>
							</div>
							<p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4">
								Our platform streamlines the resolution process
								by connecting citizens directly with the right
								government departments for faster response
								times.
							</p>
							<div className="space-y-2">
								<div className="flex items-center space-x-3">
									<div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full flex-shrink-0"></div>
									<span className="text-gray-700 text-xs sm:text-sm">
										Direct routing to appropriate
										departments
									</span>
								</div>
								<div className="flex items-center space-x-3">
									<div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full flex-shrink-0"></div>
									<span className="text-gray-700 text-xs sm:text-sm">
										Progress tracking and updates
									</span>
								</div>
								<div className="flex items-center space-x-3">
									<div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full flex-shrink-0"></div>
									<span className="text-gray-700 text-xs sm:text-sm">
										Accountability and transparency
									</span>
								</div>
							</div>
						</div>

						{/* Call to Action */}
						<div className="text-center pt-2 sm:pt-4">
							<Button
								className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-normal py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base transform hover:-translate-y-1 w-full sm:w-auto"
								size="lg"
							>
								Explore Our Platform
								<ArrowRight className="h-4 w-4 ml-2" />
							</Button>
						</div>
					</div>

					{/* Right Column - Image Background */}
					<div className="lg:col-span-3 relative mt-8 lg:mt-0">
						<div className="relative w-full h-[300px] sm:h-[400px] lg:h-[600px] rounded-2xl shadow-xl">
							{/* Background Image */}
							<img
								src="/Assets/Images/Platform.png"
								alt="Citizn platform interface and resolution process"
								className="w-full h-full object-contain"
							/>
							{/* Dark overlay for better content readability */}
							<div className="absolute inset-0 bg-black/10 rounded-2xl"></div>
							{/* Subtle gradient overlay */}
							<div className="rounded-2xl absolute inset-0 bg-gradient-to-r from-green-900/20 via-transparent to-blue-900/20"></div>

							{/* Floating Stats */}
							<div className="absolute -bottom-3 -left-3 sm:-bottom-6 sm:-left-6 bg-white p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-lg border border-green-200">
								<div className="text-center">
									<div className="text-sm sm:text-lg font-normal text-green-600">
										2,847
									</div>
									<div className="text-xs text-gray-600">
										Issues Resolved
									</div>
								</div>
							</div>
							<div className="absolute -top-3 -right-3 sm:-top-6 sm:-right-6 bg-white p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-lg border border-green-200">
								<div className="text-center">
									<div className="text-sm sm:text-lg font-normal text-green-600">
										15,632
									</div>
									<div className="text-xs text-gray-600">
										Active Users
									</div>
								</div>
							</div>
						</div>

						{/* Decorative Elements */}
						<div className="absolute top-4 sm:top-8 -left-2 sm:-left-3 w-4 h-4 sm:w-6 sm:h-6 bg-green-300 rounded-full opacity-40"></div>
						<div className="absolute bottom-8 sm:bottom-16 -right-2 sm:-right-3 w-3 h-3 sm:w-5 sm:h-5 bg-blue-300 rounded-full opacity-40"></div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default SolutionSection;
