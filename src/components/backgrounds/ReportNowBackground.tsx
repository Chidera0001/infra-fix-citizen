import React from "react";

const ReportNowBackground: React.FC = () => {
	return (
		<div className="absolute inset-0 overflow-hidden">
			{/* Base gradient */}
			<div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-blue-50"></div>

			{/* Animated gradient orbs */}
			<div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-green-400/30 to-green-500/20 rounded-full blur-3xl animate-pulse"></div>
			<div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-blue-400/25 to-green-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
			<div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-br from-green-300/20 to-blue-300/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "2s" }}></div>

			{/* Grid pattern overlay */}
			<div 
				className="absolute inset-0 opacity-[0.02]"
				style={{
					backgroundImage: `
						linear-gradient(to right, #16a34a 1px, transparent 1px),
						linear-gradient(to bottom, #16a34a 1px, transparent 1px)
					`,
					backgroundSize: "60px 60px"
				}}
			></div>

			{/* Subtle dot pattern */}
			<div 
				className="absolute inset-0 opacity-[0.03]"
				style={{
					backgroundImage: `radial-gradient(circle, #16a34a 1px, transparent 1px)`,
					backgroundSize: "30px 30px"
				}}
			></div>

			{/* Floating camera icons (very subtle) */}
			<div className="absolute top-1/4 right-1/4 w-12 h-12 bg-green-200/10 rounded-lg rotate-12 blur-sm"></div>
			<div className="absolute bottom-1/3 left-1/4 w-16 h-16 bg-blue-200/10 rounded-lg -rotate-12 blur-sm"></div>
			<div className="absolute top-2/3 right-1/3 w-10 h-10 bg-green-300/10 rounded-lg rotate-45 blur-sm"></div>

			{/* Top gradient fade */}
			<div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/50 to-transparent"></div>

			{/* Bottom gradient fade */}
			<div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/50 to-transparent"></div>
		</div>
	);
};

export default ReportNowBackground;

