import { useCanGoBack } from '@tanstack/react-router';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { useEffect, useState } from 'react';

import { fadeVariants } from '@/motions/fade';

import BackButton from './BackButton';
import NavLinks from './NavLinks';
import WindowControls from './WindowControls';


export default function NavBar() {
  const canGoBack = useCanGoBack();
  const [title, setTitle] = useState('');

  const getTitle = async () => {
    const title = await getCurrentWindow().title();

    setTitle(title);
  };

  useEffect(() => {
    getTitle();
  }, []);

  return (
    <motion.div
      variants={fadeVariants}
      initial='hidden'
      animate='show'
      data-tauri-drag-region
      className='bg-accent grid grid-cols-[8rem_1fr_8rem] p-1.5 shadow-md'
    >
      <div className='pointer-events-none flex size-full items-center-safe'>
        <LayoutGroup>
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
          <motion.span
            layout
            className='text-accent-foreground pl-2 text-lg font-semibold select-none'
          >
            {title}
          </motion.span>
        </LayoutGroup>
      </div>
      <div className='pointer-events-none flex items-center-safe justify-center-safe gap-2'>
        <NavLinks />
      </div>
      <div className='pointer-events-none flex items-center-safe justify-end'>
        <WindowControls />
      </div>
    </motion.div>
  );
}
