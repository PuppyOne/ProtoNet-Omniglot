import { Toast } from '@heroui/react';
import { createRootRoute, Outlet, useLocation } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { useAtom } from 'jotai';
import { AnimatePresence } from 'motion/react';
import { rpc } from 'pyloid-js';
import { useEffect } from 'react';

import { characterSupportsAtom } from '@/atoms/support';
import NavBar from '@/components/NavBar';
import NotFound from '@/components/NotFound';
import type { CharacterSupports } from '@/types/support';


export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFound,
});

function RootComponent() {
  const location = useLocation();
  const [characterSupports, setCharacterSupports] = useAtom(
    characterSupportsAtom
  );

  const fetchSupports = async () => {
    setCharacterSupports(
      await rpc.call<undefined, CharacterSupports>('get_supports')
    );
  };

  useEffect(() => {
    if (!characterSupports) fetchSupports();
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
