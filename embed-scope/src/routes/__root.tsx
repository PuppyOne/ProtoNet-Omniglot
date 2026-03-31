import { Toast } from '@heroui/react';
import { createRootRoute, Outlet, useLocation } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { useAtom } from 'jotai';
import { AnimatePresence } from 'motion/react';
import { rpc } from 'pyloid-js';
import { useEffect } from 'react';

import { supportsAtom } from '@/atoms/support';
import NavBar from '@/components/NavBar';
import type { Supports } from '@/types/support';


export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const location = useLocation();
  const [supports, setSupports] = useAtom(supportsAtom);

  const fetchSupports = async () => {
    setSupports(await rpc.call<undefined, Supports>('get_supports'));
  };

  useEffect(() => {
    if (!supports) fetchSupports();
  }, []);

  return (
    <>
      <Toast.Provider />
      <div className='grid h-full w-full grid-rows-[3rem_1fr] items-stretch justify-stretch'>
        <NavBar />
        <div className='overflow-hidden'>
          <AnimatePresence mode='wait' initial={false}>
            <Outlet key={location.pathname} />
          </AnimatePresence>
        </div>
      </div>
      <TanStackRouterDevtools position='bottom-right' />
    </>
  );
}
