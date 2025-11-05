import { useEffect, useState } from 'react';

interface CountUpProps {
  end: number;
  duration?: number;
  start?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
}

const CountUp = ({ 
  end, 
  duration = 2000, 
  start = 0, 
  suffix = '', 
  prefix = '', 
  decimals = 0,
  className = ''
}: CountUpProps) => {
  const [count, setCount] = useState(start);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(`countup-${end}`);
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [end, isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = start + (end - start) * easeOutQuart;
      
      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isVisible, end, start, duration]);

  const formatNumber = (num: number) => {
    if (decimals > 0) {
      const rounded = num.toFixed(decimals);
      // Remove trailing zeros after decimal point (e.g., "7.0" -> "7", "7.1" -> "7.1")
      const parts = rounded.split('.');
      if (parts[1] && parseFloat(parts[1]) === 0) {
        return parts[0]; // Return whole number without decimal
      }
      return rounded;
    }
    return Math.floor(num).toLocaleString();
  };

  return (
    <span id={`countup-${end}`} className={className}>
      {prefix}{formatNumber(count)}{suffix}
    </span>
  );
};

export default CountUp;
