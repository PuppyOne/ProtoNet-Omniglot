import { Toast, toast } from '@heroui/react';
import { createRootRoute, Outlet, useLocation } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { useAtom } from 'jotai';
import { AnimatePresence } from 'motion/react';
import { useEffect } from 'react';

import { isEngineReadyAtom } from '@/atoms/engine';
import { modelsAtom } from '@/atoms/model';
import { characterSupportsAtom } from '@/atoms/support';
import { getModels, getSupports, preload } from '@/client/apiClient';
import NavBar from '@/components/NavBar';
import NotFound from '@/components/NotFound';


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

  useEffect(() => {
    if (!characterSupports) fetchSupports();

    fetchModels();

    toast.promise(loadEngine, {
      loading: '正在初始化引擎...',
      success: '就绪',
      error: error => `引擎初始化失败: ${error.message}`,
    });
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
