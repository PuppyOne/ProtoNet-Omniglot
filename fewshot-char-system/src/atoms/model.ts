import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { Model, ModelsOutput } from '@/client/_apiTypes';


export const modelsAtom = atom<ModelsOutput | undefined>();
export const selectedModelAtom = atomWithStorage<Model | null>(
  'selectedModel',
  null
);
