import { Toast } from '@heroui/react';
import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';


export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Toast.Provider />
      <div className='grid h-full w-full grid-rows-[4rem_1fr] items-stretch justify-stretch'>
        <div className='flex justify-center gap-2'>
          <Link
            to='/'
            activeProps={{
              className: 'font-bold',
            }}
          >
            PlaceHold
          </Link>
          <Link
            to='/support'
            activeProps={{
              className: 'font-bold',
            }}
          >
            Support
          </Link>
          <Link
            to='/query'
            activeProps={{
              className: 'font-bold',
            }}
          >
            Query
          </Link>
          <Link
            to='/'
            activeProps={{
              className: 'font-bold',
            }}
          >
            PlaceHold
          </Link>
        </div>
        <div className='overflow-hidden'>
          <Outlet />
        </div>
      </div>
      <TanStackRouterDevtools position='bottom-right' />
    </>
  );
}
