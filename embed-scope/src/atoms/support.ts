import { atom } from 'jotai';

import { CharacterSupports } from '@/types/support';


export const characterSupportsAtom = atom<CharacterSupports | undefined>();
