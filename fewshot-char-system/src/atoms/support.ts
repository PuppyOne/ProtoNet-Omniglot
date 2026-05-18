import { atom } from 'jotai';

import type { SupportsOutput } from '@/client/_apiTypes';
import { getSupports } from '@/client/apiClient';


export const characterSupportsAtom = atom<SupportsOutput | undefined>();

export const fetchSupportsAtom = atom(null, async (_get, set) => {
  const supports = await getSupports();

  set(characterSupportsAtom, supports);
});
