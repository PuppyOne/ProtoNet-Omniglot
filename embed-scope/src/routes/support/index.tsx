import { createFileRoute } from '@tanstack/react-router';
import { motion } from 'motion/react';

import SupportAlbum from '@/components/SupportAlbum';
import { childVariants, containerVariants } from '@/motions/stagger';


export const Route = createFileRoute('/support/')({
  component: Support,
});

function Support() {
  return (
    <div className='size-full overflow-auto p-4'>
      <motion.div
        variants={containerVariants}
        initial='hidden'
        animate='show'
        exit='exit'
        className='grid min-h-full grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4'
      >
        <motion.div key={1} variants={childVariants}>
          <SupportAlbum />
        </motion.div>
        <motion.div key={2} variants={childVariants}>
          <SupportAlbum />
        </motion.div>
        <motion.div key={3} variants={childVariants}>
          <SupportAlbum />
        </motion.div>
        <motion.div key={4} variants={childVariants}>
          <SupportAlbum />
        </motion.div>
        <motion.div key={5} variants={childVariants}>
          <SupportAlbum />
        </motion.div>
        <motion.div key={6} variants={childVariants}>
          <SupportAlbum />
        </motion.div>
        <motion.div key={7} variants={childVariants}>
          <SupportAlbum />
        </motion.div>
        <motion.div key={8} variants={childVariants}>
          <SupportAlbum />
        </motion.div>
      </motion.div>
    </div>
  );
}
