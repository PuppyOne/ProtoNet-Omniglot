import { Avatar, Card } from '@heroui/react';
import { createFileRoute, notFound } from '@tanstack/react-router';
import { useAtom } from 'jotai';

import { characterSupportsAtom } from '@/atoms/support';


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
      <h2 className='w-min text-4xl'>{characterName}</h2>
      <div className='grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 overflow-auto'>
        {supports.map((support, i) => (
          <Card key={i} className='h-min w-full'>
            <Card.Header className='aspect-square'>
              <Avatar className='size-full rounded-xl shadow-sm'>
                <Avatar.Image src={support.src} />
              </Avatar>
            </Card.Header>
            <Card.Content>{support.name}</Card.Content>
            <Card.Footer className='text-field-placeholder justify-end-safe text-sm'>
              .{support.ext}
            </Card.Footer>
          </Card>
        ))}
      </div>
    </div>
  );
}
