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
		<section className="py-24 bg-white/60 backdrop-blur-sm overflow-hidden w-full relative">
			<div className="w-full px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-20">
					<Badge className="mb-8 bg-green-50 text-green-700 border-green-200 px-4 py-2 text-sm font-medium">
						<AlertTriangle className="h-4 w-4 mr-2" />
						The Problem We Solve
					</Badge>
					<h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
						Infrastructure Issues Affecting Nigerian Communities
					</h3>
				</div>

				{/* Cards Container */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
					{problems.map((problem) => (
						<div
							key={problem.id}
							className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-green-200/30 hover:shadow-3xl transition-all duration-500 hover:-translate-y-2"
						>
							{/* Card Header with Background Image */}
							<div className="relative h-64 overflow-hidden">
								<img
									src={problem.image}
									alt={problem.title}
									className="w-full h-full object-cover"
								/>
								{/* Dark overlay for text readability */}
								<div className="absolute inset-0 bg-black/40"></div>
								{/* Gradient overlay */}
								<div className="absolute inset-0 bg-gradient-to-r from-green-900/40 via-transparent to-blue-900/40"></div>

								{/* Icon Badge */}
								<div className="absolute top-6 right-6 bg-white/90 p-3 rounded-2xl shadow-lg backdrop-blur-sm">
									{problem.icon}
								</div>
							</div>

							{/* Card Content */}
							<div className="p-8">
								<div className="mb-6">
									<h4 className="text-2xl font-bold text-gray-900 mb-4">
										{problem.title}
									</h4>
									<p className="text-gray-700 text-base leading-relaxed">
										{problem.description}
									</p>
								</div>

								{/* Impact Points */}
								<div className="space-y-3">
									{problem.impacts.map(
										(impact, impactIndex) => (
											<div
												key={impactIndex}
												className="bg-green-50 p-3 rounded-xl border border-green-200 hover:bg-green-100 transition-all duration-300"
											>
												<div className="flex items-center space-x-2">
													<div className="w-2 h-2 bg-green-500 rounded-full"></div>
													<span className="text-gray-700 font-medium text-sm">
														{impact}
													</span>
												</div>
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
