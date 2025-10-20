import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Zap, MapPin, Clock, WifiOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { useCreateOnlineIssue, useCreateOfflineIssue } from "@/hooks/use-separate-issues";
import FadeInWhenVisible from "@/components/shared/FadeInWhenVisible";
import ReportNowBackground from "@/components/backgrounds/ReportNowBackground";

const ReportNowSection = () => {
	const navigate = useNavigate();
	const { user, isOfflineMode } = useAuth();
	const { isOnline } = useOnlineStatus();
	
	// Use separate hooks for online/offline reporting
	const createOnlineIssue = useCreateOnlineIssue();
	const createOfflineIssue = useCreateOfflineIssue();

	const handleReportNow = () => {
		if (user) {
			navigate("/report-now");
		} else {
			navigate("/auth");
		}
	};

	const handleOfflineReport = () => {
		navigate("/offline-report");
	};

	const features = [
		{
			icon: MapPin,
			svgIcon: "/Assets/icons/Location.svg",
			title: "Auto-detect Location",
			description: "GPS data extracted from your photo"
		},
		{
			icon: Clock,
			svgIcon: "/Assets/icons/Clock.svg",
			title: "Submit in Seconds",
			description: "Report issues faster than ever"
		},
		{
			icon: Zap,
			svgIcon: "/Assets/icons/Flash.svg",
			title: "No Complex Forms",
			description: "Just snap and report"
		}
	];

	return (
		<section className="py-12 sm:py-16 lg:py-24 relative overflow-hidden">
			{/* Custom Background Component */}
			<ReportNowBackground />

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
				<FadeInWhenVisible delay={0.1}>
					<div className="text-center mb-12 sm:mb-16">
						<Badge className="mb-4 sm:mb-6 gap-2 bg-green-100 text-green-700 border-green-200 px-4 py-1.5 text-sm font-medium">
							<Zap className="h-4 w-4 fill-green-700" />
							Instant Reporting
						</Badge>
						<div className="text-l sm:text-2xl md:text-3xl lg:text-3xl font-semibold text-gray-900 mb-2 sm:mb-4">
							Report Issues Instantly
						</div>
						<p className="text-black text-sm sm:text-base lg:text-base max-w-3xl mx-auto">
							Snap a photo, and we'll handle the rest. No complicated forms, 
							just quick action when you see infrastructure problems.
						</p>
					</div>
				</FadeInWhenVisible>

				{/* Central Radial Layout */}
				<div className="relative max-w-4xl mx-auto">
					{/* Central Camera Visual */}
					<FadeInWhenVisible delay={0.2}>
						<div className="flex justify-center mb-16">
							<div className="relative">
								{/* Animated pulse rings - Always green */}
								<div className="absolute inset-0 rounded-full opacity-20 animate-ping scale-150 bg-green-400"></div>
								<div className="absolute inset-0 rounded-full opacity-30 animate-pulse scale-125 bg-green-300"></div>
								
								{/* Camera Icon Container - Always green */}
								<div 
									className="relative w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-all duration-500 shadow-2xl hover:shadow-3xl bg-gradient-to-r from-green-500 to-green-600"
									onClick={isOnline ? handleReportNow : handleOfflineReport}
								>
									<img 
										src="/Assets/icons/camera.svg" 
										alt="Camera" 
										className="h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28 brightness-0 invert"
									/>
								</div>
							</div>
						</div>
					</FadeInWhenVisible>

					{/* Feature Steps - Horizontal Flow with Dotted Lines */}
					<FadeInWhenVisible delay={0.4}>
						<div className="relative">
							{/* Desktop: Horizontal layout with dotted connections */}
							<div className="hidden md:flex items-center justify-center space-x-8 max-w-4xl mx-auto">
								{features.map((feature, index) => {
									const Icon = feature.icon;
									const isLast = index === features.length - 1;
									
									return (
										<div key={index} className="flex items-center">
											{/* Feature Step */}
											<div className="flex flex-col items-center group hover:scale-105 transition-all duration-300">
												{/* Step Badge */}
												<div className="relative mb-4">
													<div className="w-24 h-24 bg-white rounded-2xl shadow-lg border border-green-200 flex items-center justify-center group-hover:shadow-xl transition-all duration-300">
														<div className="p-4 bg-green-200 rounded-xl group-hover:bg-green-200 transition-colors">
															{feature.svgIcon ? (
																<img 
																	src={feature.svgIcon} 
																	alt={feature.title} 
																	className="h-8 w-8"
																	style={{
																		filter: 'brightness(0) saturate(100%) invert(40%) sepia(76%) saturate(1339%) hue-rotate(90deg) brightness(95%) contrast(91%)'
																	}}
																/>
															) : (
																<Icon className="h-8 w-8 text-green-600" />
															)}
														</div>
													</div>
													
													{/* Step Number */}
													<div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
														{index + 1}
													</div>
												</div>
												
												{/* Feature Text */}
												<div className="text-center max-w-40">
													<h4 className="font-bold text-gray-900 text-base mb-2 group-hover:text-green-700 transition-colors">
														{feature.title}
													</h4>
													<p className="text-sm text-gray-600 leading-relaxed">
														{feature.description}
													</p>
												</div>
											</div>
											
											{/* Dotted Connection Line */}
											{!isLast && (
												<div className="flex items-center mx-4 mb-[3rem]">
													<div className="w-12 h-0.5 border-t-2 border-dotted border-green-400"></div>
													<div className="w-2 h-2 bg-green-400 rounded-full mx-1"></div>
													<div className="w-2 h-2 bg-green-400 rounded-full mx-1"></div>
													<div className="w-12 h-0.5 border-t-2 border-dotted border-green-400"></div>
												</div>
											)}
										</div>
									);
								})}
							</div>

							{/* Mobile: Horizontal scrollable cards */}
							<div className="md:hidden">
								<div className="flex space-x-8 overflow-x-auto pb-4 px-8 snap-x snap-mandatory">
									{features.map((feature, index) => {
										const Icon = feature.icon;
										const isLast = index === features.length - 1;
										
										return (
											<div key={index} className="flex items-center flex-shrink-0 snap-center">
												{/* Feature Card */}
												<div className="bg-white rounded-2xl shadow-lg border border-green-200 p-6 w-[320px] flex-shrink-0 group hover:shadow-xl transition-all duration-300">
													{/* Step Number */}
													<div className="flex justify-center mb-4">
														<div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg">
															{index + 1}
														</div>
													</div>
													
													{/* Feature Text */}
													<div className="text-center">
														<h4 className="font-semibold text-gray-900 text-sm mb-2 group-hover:text-green-700 transition-colors">
															{feature.title}
														</h4>
														<p className="text-xs text-gray-600 leading-relaxed">
															{feature.description}
														</p>
													</div>
												</div>
												
											</div>
										);
									})}
								</div>
								
								{/* Mobile Progress Indicator */}
								<div className="flex justify-center mt-6 space-x-2">
									{features.map((_, index) => (
										<div
											key={index}
											className="w-2 h-2 bg-green-400 rounded-full opacity-60"
										></div>
									))}
								</div>
							</div>
						</div>
					</FadeInWhenVisible>

					{/* Centered CTA Button */}
					<FadeInWhenVisible delay={0.6}>
						<div className="flex flex-col items-center mt-12 space-y-4">
							{/* Show appropriate button based on online status */}
							{isOnline ? (
								<Button
									onClick={handleReportNow}
									className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-5 px-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-base hover:scale-105"
									size="lg"
								>
									<img src="/Assets/icons/camera.svg" alt="Camera" className="h-4 w-4 mr-2 brightness-0 invert" />
									Report Now
								</Button>
							) : (
								<Button
									onClick={handleOfflineReport}
									variant="outline"
									className="border-orange-300 text-orange-700 hover:bg-orange-50 hover:border-orange-400 font-bold py-5 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-base hover:scale-105"
									size="lg"
								>
									<WifiOff className="h-4 w-4 mr-2" />
									Report Offline
								</Button>
							)}

							{/* Subtle footer text */}
							<p className="text-sm text-black text-center max-w-md">
								{isOnline ? (
									<>
										Perfect for quick reports. For complex issues, use our{" "}
										<button
											onClick={() => navigate(user ? "/citizen" : "/auth")}
											className="text-green-600 hover:text-green-700 font-medium underline underline-offset-2 hover:underline-offset-4 transition-all"
										>
											detailed report form
										</button>
									</>
								) : (
									"Your report will be saved locally and synced when you're back online."
								)}
							</p>
						</div>
					</FadeInWhenVisible>
				</div>
			</div>
		</section>
	);
};

export default ReportNowSection;

