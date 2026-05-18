import { atom } from 'jotai';

import { preload } from '@/client/apiClient';


export const isEngineReadyAtom = atom(false);

export const preloadEngineAtom = atom(null, async (get, set) => {
  if (get(isEngineReadyAtom)) return;

  await preload();

  set(isEngineReadyAtom, true);
});
