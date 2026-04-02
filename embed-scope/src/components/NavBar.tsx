import { useCanGoBack } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'motion/react';

import { fadeVariants } from '@/motions/fade';

import BackButton from './BackButton';
import NavLinks from './NavLinks';


export default function NavBar() {
  const canGoBack = useCanGoBack();

  return (
    <div
      data-tauri-drag-region
      className='bg-accent grid grid-cols-[4rem_1fr_4rem]'
    >
      <div className='pointer-events-none grid size-full place-items-center-safe'>
        <AnimatePresence>
          {canGoBack && (
            <motion.div
              variants={fadeVariants}
              initial={false}
              animate='show'
              exit='exit'
            >
              <BackButton className='pointer-events-auto' />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className='pointer-events-none flex items-center-safe justify-center-safe gap-2'>
        <NavLinks />
      </div>
    </div>
  );
}
