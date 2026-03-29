import { Toast } from '@heroui/react';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import { NavLink } from '@/components/NavLink';


export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Toast.Provider />
      <div className='grid h-full w-full grid-rows-[3rem_1fr] items-stretch justify-stretch'>
        <div className='bg-accent flex items-center-safe justify-center-safe gap-2'>
          <NavLink to='/'>PlaceHold</NavLink>
          <NavLink to='/support'>Support</NavLink>
          <NavLink to='/query'>Query</NavLink>
          <NavLink to='/'>PlaceHold</NavLink>
        </div>
        <div className='overflow-hidden'>
          <Outlet />
        </div>
      </div>
      <TanStackRouterDevtools position='bottom-right' />
    </>
  );
}
