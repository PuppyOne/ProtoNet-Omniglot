import { motion } from 'motion/react';

import { childVariants } from '@/motions/stagger';
import LineMdFileRemove from '~icons/line-md/file-remove';


export default function EmptySupport() {
  return (
    <div className='flex size-full flex-col items-center-safe justify-center-safe gap-4 select-none'>
      <LineMdFileRemove className='text-field-placeholder text-4xl' />
      <motion.div
        variants={childVariants}
        initial='hidden'
        animate='show'
        exit='exit'
        className='text-field-placeholder'
      >
        字库为空
      </motion.div>
    </div>
  );
}
