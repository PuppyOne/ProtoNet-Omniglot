import { createFileRoute } from '@tanstack/react-router';

import ModelRadioGroup from '@/components/ModelRadioGroup';


export const Route = createFileRoute('/model/')({
  component: Model,
});

function Model() {
  return (
    <div className='size-full overflow-auto p-4'>
      <ModelRadioGroup />
    </div>
  );
}
