import { stagger, type Variants } from 'motion/react';


export const containerVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      delayChildren: stagger(0.1),
    },
  },
  exit: {
    opacity: 1,
    transition: {
      delayChildren: stagger(0.05),
    },
  },
} as const satisfies Variants;

export const childVariants = {
  hidden: { opacity: 0, y: -20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.2 } },
} as const satisfies Variants;
