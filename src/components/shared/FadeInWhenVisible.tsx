'use client';

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface FadeInWhenVisibleProps {
	children: React.ReactNode;
	delay?: number;
	duration?: number;
	className?: string;
	direction?: "up" | "left" | "right";
}

const FadeInWhenVisible = ({
	children,
	delay = 0,
	duration = 0.6,
	className = "",
	direction = "up",
}: FadeInWhenVisibleProps) => {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });

	const getInitialState = () => {
		switch (direction) {
			case "left":
				return { opacity: 0, x: -40 };
			case "right":
				return { opacity: 0, x: 40 };
			case "up":
			default:
				return { opacity: 0, y: 40 };
		}
	};

	const getAnimateState = () => {
		switch (direction) {
			case "left":
				return { opacity: 1, x: 0 };
			case "right":
				return { opacity: 1, x: 0 };
			case "up":
			default:
				return { opacity: 1, y: 0 };
		}
	};

	return (
		<motion.div
			ref={ref}
			initial={getInitialState()}
			animate={isInView ? getAnimateState() : getInitialState()}
			transition={{
				duration: duration,
				delay: delay,
				ease: [0.25, 0.46, 0.45, 0.94],
			}}
			className={className}
		>
			{children}
		</motion.div>
	);
};

export default FadeInWhenVisible;
