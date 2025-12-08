import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EmojiAnimationProps {
  emojis: string[];
  duration?: number;
  onComplete?: () => void;
}

export const EmojiAnimation = ({
  emojis,
  duration = 3000,
  onComplete,
}: EmojiAnimationProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <div className='pointer-events-none fixed inset-0 z-50 flex items-center justify-center'>
          {emojis.map((emoji, index) => (
            <motion.div
              key={index}
              className='absolute text-6xl'
              initial={{
                opacity: 0,
                scale: 0,
                y: 0,
              }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0, 1.2, 1, 0.8],
                y: -200 - index * 50,
                x: (Math.random() - 0.5) * 200,
                rotate: (Math.random() - 0.5) * 360,
              }}
              exit={{
                opacity: 0,
                scale: 0,
              }}
              transition={{
                duration: duration / 1000,
                delay: index * 0.1,
                ease: 'easeOut',
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};
