import { createFileRoute } from '@tanstack/react-router';
import { useAtom } from 'jotai';
import { motion } from 'motion/react';

import { supportsAtom } from '@/atoms/support';
import SupportAlbum from '@/components/SupportAlbum';
import { childVariants, containerVariants } from '@/motions/stagger';


export const Route = createFileRoute('/support/')({
  component: Support,
});

function Support() {
  const [supports] = useAtom(supportsAtom);

  return (
    <div className='size-full overflow-auto p-4'>
      <motion.div
        variants={containerVariants}
        initial='hidden'
        animate='show'
        exit='exit'
        className='grid min-h-full grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4'
      >
        {supports &&
          Object.entries(supports).map(([characterName, supports], i) => (
            <motion.div key={i} variants={childVariants}>
              <SupportAlbum characterName={characterName} supports={supports} />
            </motion.div>
          ))}
      </motion.div>
    </div>
  );
}
