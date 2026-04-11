import { atom } from 'jotai';

import type { SupportsOutput } from '@/client/_apiTypes';


export const characterSupportsAtom = atom<SupportsOutput | undefined>();
