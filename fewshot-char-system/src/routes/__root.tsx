import { Toast } from '@heroui/react';
import { createRootRoute, Outlet, useLocation } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import type { UnlistenFn } from '@tauri-apps/api/event';
import { getCurrentWindow, type Theme } from '@tauri-apps/api/window';
import { useAtom } from 'jotai';
import { AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';

import { isEngineReadyAtom } from '@/atoms/engine';
import { modelsAtom } from '@/atoms/model';
import { characterSupportsAtom } from '@/atoms/support';
import { getModels, getSupports, preload } from '@/client/apiClient';
import NavBar from '@/components/NavBar';
import NotFound from '@/components/NotFound';
import { isWin11 } from '@/utils/is-win11';


export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFound,
});

function RootComponent() {
  const location = useLocation();
  const [characterSupports, setCharacterSupports] = useAtom(
    characterSupportsAtom
  );
  const [, setModels] = useAtom(modelsAtom);
  const [isEngineReady, setIsEngineReady] = useAtom(isEngineReadyAtom);

  const [theme, setTheme] = useState<Theme | null>(null);

  const fetchSupports = async () => {
    setCharacterSupports(await getSupports());
  };

  const fetchModels = async () => {
    const models = await getModels();

    setModels(models);
  };

  const loadEngine = async () => {
    if (isEngineReady) return;

    await preload();

    setIsEngineReady(true);
  };

  const syncTheme = async () => {
    const theme = await getCurrentWindow().theme();

    setTheme(theme);
  };

  useEffect(() => {
    if (!characterSupports) fetchSupports();

    fetchModels();

    loadEngine();
  }, []);

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
  }, []);

  useEffect(() => {
    syncTheme();

    let cleanup: UnlistenFn | null = null;

    const setupListener = async () => {
      cleanup = await getCurrentWindow().onThemeChanged(
        ({ payload: theme }) => {
          setTheme(theme);
        }
      );
    };

    setupListener();

    return () => cleanup?.();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

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
