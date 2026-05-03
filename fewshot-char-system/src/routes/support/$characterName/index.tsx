import { Avatar, Button, Card } from '@heroui/react';
import { createFileRoute, notFound } from '@tanstack/react-router';
import { convertFileSrc } from '@tauri-apps/api/core';
import { openPath } from '@tauri-apps/plugin-opener';
import { useAtom } from 'jotai';
import { motion } from 'motion/react';

import { characterSupportsAtom } from '@/atoms/support';
import MotionContainer from '@/components/MotionContainer';
import { childVariants } from '@/motions/stagger';


export const Route = createFileRoute('/support/$characterName/')({
  component: CharacterSupport,
});

function CharacterSupport() {
  const { characterName } = Route.useParams();
  const [characterSupports] = useAtom(characterSupportsAtom);
  const supports = characterSupports?.[characterName];

  if (!supports) throw notFound();

  return (
    <div className='grid size-full grid-rows-[min-content_1fr] gap-4 p-4'>
      <div className='flex justify-between'>
        <h2 className='w-min text-4xl'>{characterName}</h2>
        <Button
          variant='primary'
          onPress={() => openPath(`support/${characterName}`)}
        >
          打开文件夹
        </Button>
      </div>
      <MotionContainer className='grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 overflow-auto'>
        {supports.map(support => (
          <motion.div
            layout
            key={support.filename}
            variants={childVariants}
            className='h-min w-full'
          >
            <Card>
              <Card.Header className='aspect-square'>
                <Avatar className='size-full rounded-xl shadow-sm'>
                  <Avatar.Image src={convertFileSrc(support.filepath)} />
                </Avatar>
              </Card.Header>
              <Card.Content>{support.name}</Card.Content>
              <Card.Footer className='text-field-placeholder justify-end-safe text-sm'>
                .{support.ext}
              </Card.Footer>
            </Card>
          </motion.div>
        ))}
      </MotionContainer>
    </div>
  );
}
