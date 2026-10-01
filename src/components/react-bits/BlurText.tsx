import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface AnimatedTitleProps {
  text: string;
  className?: string;
  delay?: number;
  direction?: 'top' | 'bottom';
  duration?: number;
}

const AnimatedTitle = ({
  text,
  className = '',
  delay = 0,
  direction = 'top',
  duration = 0.8,
}: AnimatedTitleProps) => {
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px' });

  const yOffset = direction === 'top' ? -40 : 40;

  return (
    <motion.h1
      ref={ref}
      className={className}
      initial={{ filter: 'blur(12px)', opacity: 0, y: yOffset }}
      animate={isInView ? { filter: 'blur(0px)', opacity: 1, y: 0 } : { filter: 'blur(12px)', opacity: 0, y: yOffset }}
      transition={{
        duration,
        delay: delay / 1000,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {text}
    </motion.h1>
  );
};

export default AnimatedTitle;
