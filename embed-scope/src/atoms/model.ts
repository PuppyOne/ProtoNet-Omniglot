import { atom } from 'jotai';

import { Model, ModelsOutput } from '@/client/_apiTypes';


export const modelsAtom = atom<ModelsOutput | undefined>();
export const selectedModelAtom = atom<Model | null>(null);
