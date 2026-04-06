import { motion } from 'motion/react';

import { containerVariants } from '@/motions/stagger';


export default function MotionContainer(
  props: React.ComponentProps<typeof motion.div>
) {
  return (
    <motion.div
      {...props}
      variants={containerVariants}
      initial='hidden'
      animate='show'
      exit='exit'
     />
  );
}
