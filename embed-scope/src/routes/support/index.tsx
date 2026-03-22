import { createFileRoute } from '@tanstack/react-router';

import SupportAlbum from '@/components/SupportAlbum';


export const Route = createFileRoute('/support/')({
  component: Support,
});

function Support() {
  return (
    <div className='m-4 grid h-full grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 overflow-auto scroll-auto'>
      <SupportAlbum />1
    </div>
  );
}
