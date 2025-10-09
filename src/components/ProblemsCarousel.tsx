import React from "react";
import { AlertTriangle, Navigation, Lightbulb, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Problem {
	id: number;
	title: string;
	description: string;
	image: string;
	icon: React.ReactNode;
	impacts: string[];
}

const problems: Problem[] = [
	{
		id: 1,
		title: "Broken Roads & Potholes",
		description:
			"Major roads across Nigeria suffer from severe potholes, broken surfaces, and inadequate maintenance, causing vehicle damage, accidents, and traffic congestion that affects daily commutes and economic activities.",
		image: "/Assets/Images/Bad-road.jpg",
		icon: <Navigation className="h-8 w-8 text-green-600" />,
		impacts: [
			"Vehicle damage and increased repair costs",
			"Traffic congestion and longer commute times",
			"Safety risks for motorists and pedestrians",
		],
	},
	{
		id: 2,
		title: "Broken Street Lights",
		description:
			"Non-functional street lights create safety hazards and security concerns in Nigerian communities, leading to increased crime rates, limited nighttime activities, and pedestrian safety issues that affect the overall quality of life.",
		image: "/Assets/Images/Street-light.jpg",
		icon: <Lightbulb className="h-8 w-8 text-green-600" />,
		impacts: [
			"Increased crime rates in dark areas",
			"Limited nighttime business activities",
			"Pedestrian safety concerns",
		],
	},
	{
		id: 3,
		title: "Poor Drainage Systems",
		description:
			"Inadequate drainage infrastructure leads to flooding during rainy seasons, property damage, and health risks from stagnant water, affecting the quality of life in many Nigerian communities.",
		image: "/Assets/Images/Drainnage.jpg",
		icon: <Wrench className="h-8 w-8 text-green-600" />,
		impacts: [
			"Flooding during rainy seasons",
			"Health risks from stagnant water",
			"Property damage and economic losses",
		],
	},
];

const ProblemsCards: React.FC = () => {
	return (
		<section className="py-12 sm:py-16 lg:py-24 bg-white/60 backdrop-blur-sm overflow-hidden w-full relative">
			<div className="w-full px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-12 sm:mb-16 lg:mb-20">
					<Badge className="mb-6 sm:mb-8 bg-green-50 text-green-700 border-green-200 px-4 py-2 text-sm font-medium">
						<AlertTriangle className="h-4 w-4 mr-2" />
						The Problems We Face
					</Badge>
					<h3 className="text-l sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900 mb-6 sm:mb-8 px-4">
						Infrastructure Issues Affecting Nigerian Communities
					</h3>
				</div>

				{/* Cards Container */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
					{problems.map((problem) => (
						<div
							key={problem.id}
							className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 flex flex-col"
						>
							{/* Card Header with Background Image - Matching padding */}
							<div className="relative h-48 overflow-hidden m-6 mb-4">
								<img
									src={problem.image}
									alt={problem.title}
									className="w-full h-full object-cover rounded-lg"
								/>
							</div>

							{/* Card Content - Matching padding */}
							<div className="px-6 pb-6 flex flex-col flex-grow">
								<div className="mb-6 flex-grow">
									<h4 className="text-lg font-bold text-gray-900 mb-3">
										{problem.title}
									</h4>
									<p className="text-black text-sm leading-relaxed">
										{problem.description}
									</p>
								</div>

								{/* Impact Points - Aligned at bottom */}
								<div className="space-y-2 mt-auto">
									{problem.impacts.map(
										(impact, impactIndex) => (
											<div
												key={impactIndex}
												className="flex items-center space-x-3 bg-green-50 p-2 sm:p-2 rounded-lg sm:rounded-xl 
                                                border border-green-200 hover:bg-green-100 transition-all 
                                                duration-300"
											>
												<div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
												<span className="text-black text-sm">
													{impact}
												</span>
											</div>
										)
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default ProblemsCards;
