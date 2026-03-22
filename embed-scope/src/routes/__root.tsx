import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';


export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
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
            to='/'
            activeProps={{
              className: 'font-bold',
            }}
          >
            PlaceHold
          </Link>
          <Link
            to='/'
            activeProps={{
              className: 'font-bold',
            }}
          >
            PlaceHold
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
        <div>
          <Outlet />
        </div>
      </div>
      <TanStackRouterDevtools position='bottom-right' />
    </>
  );
}
