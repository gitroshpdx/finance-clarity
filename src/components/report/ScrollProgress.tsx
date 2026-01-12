import { motion, useScroll, useSpring } from 'framer-motion';

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-primary z-50 origin-left"
      style={{ scaleX }}
    >
      {/* Glow effect at the leading edge */}
      <motion.div
        className="absolute right-0 top-0 w-8 h-full bg-primary-glow blur-sm opacity-80"
        style={{ opacity: scrollYProgress }}
      />
    </motion.div>
  );
};

export default ScrollProgress;
