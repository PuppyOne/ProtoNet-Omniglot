import { Avatar, Badge, BadgeAnchor, Card } from '@heroui/react';

import type { Support } from '@/types/support';


export default function SupportAlbum({
  characterName,
  supports,
}: {
  characterName: string;
  supports: Support[];
}) {
  return (
    <Card className='w-full' title='Support Album'>
      <Card.Header>
        <div className='grid aspect-square w-full place-items-center'>
          <BadgeAnchor className='relative size-[80%]'>
            {supports[0] && (
              <Avatar className='absolute right-0 bottom-0 z-3 size-full rounded-xl shadow-sm'>
                <Avatar.Image src={supports[0].src}></Avatar.Image>
              </Avatar>
            )}
            {supports[1] && (
              <Avatar className='absolute right-0 bottom-0 z-2 size-full origin-bottom-right rotate-5 rounded-xl shadow-sm'>
                <Avatar.Image src={supports[1].src}></Avatar.Image>
              </Avatar>
            )}
            {supports[2] && (
              <Avatar className='absolute right-0 bottom-0 z-1 size-full origin-bottom-right rotate-8 rounded-xl shadow-sm'>
                <Avatar.Image src={supports[2].src}></Avatar.Image>
              </Avatar>
            )}
            {supports[3] && (
              <Avatar className='absolute right-0 bottom-0 z-0 size-full origin-bottom-right rotate-10 rounded-xl shadow-sm'>
                <Avatar.Image src={supports[3].src}></Avatar.Image>
              </Avatar>
            )}
            <Badge color='accent' placement='bottom-right' className='z-10'>
              {supports.length}
            </Badge>
          </BadgeAnchor>
        </div>
      </Card.Header>
      <Card.Content>
        <div className='truncate'>{characterName}</div>
      </Card.Content>
    </Card>
  );
}
