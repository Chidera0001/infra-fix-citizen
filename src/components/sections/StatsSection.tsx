import { CheckCircle, Users, Clock, TrendingUp, Heart, Target } from "lucide-react";
import FadeInWhenVisible from "@/components/FadeInWhenVisible";
import CountUp from "@/components/ui/CountUp";
import { useStats } from "@/hooks/use-stats";
import { Skeleton } from "@/components/ui/skeleton";

const StatsSection = () => {
	const { data: stats, isLoading, error } = useStats();

	if (isLoading) {
		return (
			<FadeInWhenVisible delay={0.2}>
				<div className="mt-8 sm:mt-16 px-4">
					<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
						{/* Loading skeletons */}
						<div className="contents">
							<FadeInWhenVisible delay={0.3}>
								<div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-xl border border-green-200/50">
									<Skeleton className="h-8 sm:h-12 w-20 mx-auto mb-2" />
									<Skeleton className="h-4 w-24 mx-auto" />
								</div>
							</FadeInWhenVisible>
							<FadeInWhenVisible delay={0.4}>
								<div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-xl border border-green-200/50">
									<Skeleton className="h-8 sm:h-12 w-20 mx-auto mb-2" />
									<Skeleton className="h-4 w-24 mx-auto" />
								</div>
							</FadeInWhenVisible>
						</div>
						<div className="col-span-2 sm:col-span-2 lg:col-span-1 flex justify-center">
							<div className="w-full max-w-sm lg:max-w-none">
								<FadeInWhenVisible delay={0.5}>
									<div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-xl border border-green-200/50">
										<Skeleton className="h-8 sm:h-12 w-20 mx-auto mb-2" />
										<Skeleton className="h-4 w-24 mx-auto" />
									</div>
								</FadeInWhenVisible>
							</div>
						</div>
					</div>
				</div>
			</FadeInWhenVisible>
		);
	}

	if (error) {
		console.error('Stats loading error:', error);
		// Fallback to default values if there's an error
	}

	return (
		<FadeInWhenVisible delay={0.2}>
			<div className="mt-8 sm:mt-16 px-4">
				<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
					{/* First two cards */}
					<div className="contents">
						<FadeInWhenVisible delay={0.3}>
							<div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-xl border border-green-200/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
								<div className="flex items-center justify-center mb-3 sm:mb-4">
									<div className="bg-green-100 p-2 sm:p-3 rounded-xl">
										<CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
									</div>
								</div>
								<h3 className="text-xl sm:text-3xl font-normal text-center text-gray-900 mb-2">
									<CountUp 
										end={stats?.issuesResolved || 0} 
										duration={2000}
										className="text-xl sm:text-3xl font-normal"
									/>
								</h3>
								<p className="text-gray-700 font-semibold text-sm sm:text-base text-center">
									Issues fixed
								</p>
							</div>
						</FadeInWhenVisible>
						<FadeInWhenVisible delay={0.4}>
							<div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-xl border border-green-200/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
								<div className="flex items-center justify-center mb-3 sm:mb-4">
									<div className="bg-green-100 p-2 sm:p-3 rounded-xl">
										<Users className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
									</div>
								</div>
								<h3 className="text-xl sm:text-3xl font-normal text-center text-gray-900 mb-2">
									<CountUp 
										end={stats?.activeCitizens || 0} 
										duration={2000}
										className="text-xl sm:text-3xl font-normal"
									/>
								</h3>
								<p className="text-gray-700 font-semibold text-sm sm:text-base text-center">
									Active Citizens
								</p>
							</div>
						</FadeInWhenVisible>
					</div>
					
					{/* Third card - centered on mobile */}
					<div className="col-span-2 sm:col-span-2 lg:col-span-1 flex justify-center">
						<div className="w-full max-w-sm lg:max-w-none">
							<FadeInWhenVisible delay={0.5}>
								<div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-xl border border-green-200/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
									<div className="flex items-center justify-center mb-3 sm:mb-4">
										<div className="bg-green-100 p-2 sm:p-3 rounded-xl">
											<Clock className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
										</div>
									</div>
									<h3 className="text-xl sm:text-3xl font-normal text-center text-gray-900 mb-2">
										<CountUp 
											end={stats?.avgResponseTime || 0} 
											duration={2000}
											decimals={1}
											suffix=" hrs"
											className="text-xl sm:text-3xl font-normal"
										/>
									</h3>
									<p className="text-gray-700 font-semibold text-sm sm:text-base text-center">
										Avg Response Time
									</p>
								</div>
							</FadeInWhenVisible>
						</div>
					</div>
				</div>
			</div>
		</FadeInWhenVisible>
	);
};

export default StatsSection;
