import { createFileRoute } from '@tanstack/react-router';

import SupportAlbum from '@/components/SupportAlbum';


export const Route = createFileRoute('/support/')({
  component: Support,
});

function Support() {
  return (
    <div className='size-full overflow-auto p-4'>
      <div className='grid min-h-full grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4'>
        <SupportAlbum />
        <SupportAlbum />
        <SupportAlbum />
        <SupportAlbum />
        <SupportAlbum />
        <SupportAlbum />
        <SupportAlbum />
        <SupportAlbum />
      </div>
    </div>
  );
}
