import { Toast, useTheme } from '@heroui/react';
import { createRootRoute, Outlet, useLocation } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import type { UnlistenFn } from '@tauri-apps/api/event';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { useAtom } from 'jotai';
import { AnimatePresence } from 'motion/react';
import { useEffect } from 'react';

import { preloadEngineAtom } from '@/atoms/engine';
import { fetchModelsAtom } from '@/atoms/model';
import { fetchSupportsAtom } from '@/atoms/support';
import NavBar from '@/components/NavBar';
import NotFound from '@/components/NotFound';
import { isWin11 } from '@/utils/is-win11';


export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFound,
});

function RootComponent() {
  const location = useLocation();
  const [, fetchSupports] = useAtom(fetchSupportsAtom);
  const [, fetchModels] = useAtom(fetchModelsAtom);
  const [, preloadEngine] = useAtom(preloadEngineAtom);

  useTheme();

  useEffect(() => {
    fetchSupports();
    fetchModels();
    preloadEngine();
  }, [fetchSupports, fetchModels, preloadEngine]);

  useEffect(() => {
    let disposed = false;
    let cleanup: UnlistenFn | null = null;

    const setupFocusListener = async () => {
      const unlisten = await getCurrentWindow().onFocusChanged(
        ({ payload: focus }) => {
          if (focus) {
            fetchSupports();
            fetchModels();
          }
        }
      );

      if (disposed) unlisten();
      else cleanup = unlisten;
    };

    setupFocusListener();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [fetchSupports, fetchModels]);

  return (
    <>
      <Toast.Provider />
      <div
        className={`grid size-full grid-rows-[3rem_1fr] items-stretch justify-stretch select-none ${isWin11 ? '' : 'bg-background'}`}
      >
        <NavBar />
        <div className='overflow-hidden'>
          <AnimatePresence mode='wait'>
            <Outlet key={location.pathname} />
          </AnimatePresence>
        </div>
      </div>
      <TanStackRouterDevtools position='bottom-right' />
    </>
  );
}
