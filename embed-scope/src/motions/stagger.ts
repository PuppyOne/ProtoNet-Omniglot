import { stagger, type Variants } from 'motion/react';


export const containerVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      type: 'spring',
      delayChildren: stagger(0.04),
    },
  },
  exit: {
    opacity: 1,
    transition: {
      type: 'spring',
      delayChildren: stagger(0.02),
    },
  },
} as const satisfies Variants;

export const childVariants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      type: 'spring',
      duration: 0.2,
    },
  },
} as const satisfies Variants;
