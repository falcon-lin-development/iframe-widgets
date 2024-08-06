export const shakeAnimation = {
  shake: {
    // x: [0, -1, 1, -1, 1, 0],
    // y: [0, -2, 2, -2, 2, 0],
    rotate: [0, -2, 2, -2, 2, 0],
    // rotate: [0, -1, 1, -1, 1, 0],
    transition: {
      duration: 0.5,
      // repeat: Infinity,
      repeat: 1,
      // repeatType: "loop" as const,
      ease: 'easeInOut',
    },
  },
};
export const popOutAnimation = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.3 } },
};
