import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import type { Model, ModelsOutput } from '@/client/_apiTypes';
import { getModels } from '@/client/apiClient';


export const modelsAtom = atom<ModelsOutput | undefined>();
export const selectedModelAtom = atomWithStorage<Model | null>(
  'selectedModel',
  null
);

export const fetchModelsAtom = atom(null, async (get, set) => {
  const models = await getModels();

  set(modelsAtom, models);

  if (
    !models.some(
      model => model.folder.name === get(selectedModelAtom)?.folder.name
    )
  )
    set(selectedModelAtom, null);
});
