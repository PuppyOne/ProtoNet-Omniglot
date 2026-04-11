import { createFileRoute } from '@tanstack/react-router';
import { useAtom } from 'jotai';
import { motion } from 'motion/react';

import { characterSupportsAtom } from '@/atoms/support';
import EmptySupport from '@/components/EmptySupport';
import MotionContainer from '@/components/MotionContainer';
import SupportAlbum from '@/components/SupportAlbum';
import { childVariants } from '@/motions/stagger';


export const Route = createFileRoute('/support/')({
  component: Support,
});

function Support() {
  const [characterSupports] = useAtom(characterSupportsAtom);
  const characterSupportsEntries = Object.entries(characterSupports ?? {});

  return (
    <div className='size-full overflow-auto p-4'>
      {characterSupportsEntries.length === 0 ? (
        <EmptySupport />
      ) : (
        <MotionContainer className='grid min-h-full grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4'>
          {characterSupportsEntries.map(([characterName, supports], i) => (
            <motion.div key={i} variants={childVariants}>
              <SupportAlbum characterName={characterName} supports={supports} />
            </motion.div>
          ))}
        </MotionContainer>
      )}
    </div>
  );
}
