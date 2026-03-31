import { Separator } from '@heroui/react';
import { Link } from '@tanstack/react-router';


export default function NotFound() {
  return (
    <div className='grid size-full place-items-center-safe'>
      <div className='flex flex-col gap-4'>
        <div className='flex gap-12'>
          <div className='text-end'>404</div>
          <Separator variant='secondary' orientation='vertical' />
          <div className='text-start'>Not found</div>
        </div>
        <Separator />
        <Link className='transition-colors' to='/'>
          Go home
        </Link>
      </div>
    </div>
  );
}
