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
        <BadgeAnchor className='relative aspect-square w-full'>
          {supports[0] && (
            <Avatar className='absolute z-2 size-[80%] rounded-xl shadow-sm'>
              <Avatar.Image src={supports[0].src}></Avatar.Image>
            </Avatar>
          )}
          {supports[1] && (
            <Avatar className='absolute top-5 left-5 z-1 size-[80%] rounded-xl shadow-sm'>
              <Avatar.Image src={supports[1].src}></Avatar.Image>
            </Avatar>
          )}
          {supports[2] && (
            <Avatar className='absolute top-10 left-10 z-0 size-[80%] rounded-xl shadow-sm'>
              <Avatar.Image src={supports[2].src}></Avatar.Image>
            </Avatar>
          )}
          <Badge color='accent' placement='top-left' className='z-10'>
            {supports.length}
          </Badge>
        </BadgeAnchor>
      </Card.Header>
      <Card.Content>
        <div className='truncate'>{characterName}</div>
      </Card.Content>
    </Card>
  );
}
