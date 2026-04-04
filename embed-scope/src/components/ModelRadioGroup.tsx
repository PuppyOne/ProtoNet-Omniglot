import { Chip, Description, Label, Radio, RadioGroup } from '@heroui/react';
import dayjs from 'dayjs';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

import { ModelsOutput } from '@/client/_apiTypes';
import { getModels } from '@/client/apiClient';
import { childVariants, containerVariants } from '@/motions/stagger';


export default function ModelRadioGroup(
  props: React.ComponentProps<typeof RadioGroup>
) {
  const [models, setModels] = useState<ModelsOutput | undefined>();

  const fetchModels = async () => {
    const models = await getModels();

    setModels(models);
  };

  useEffect(() => {
    fetchModels();
  }, []);
  return (
    <RadioGroup {...props} variant='secondary'>
      <motion.div
        variants={containerVariants}
        initial='hidden'
        animate='show'
        exit='exit'
        className='grid min-h-full grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-4'
      >
        {models?.map((model, i) => (
          <motion.div
            key={i}
            layout
            layoutId={`model-${model.folder.name}`}
            variants={childVariants}
          >
            <Radio
              className='data-[selected=true]:shadow-accent/10 group bg-surface data-[selected=true]:border-accent data-[selected=true]:bg-accent/10 data-[focus-visible=true]:border-accent data-[focus-visible=true]:bg-accent/10 relative flex rounded-xl border px-5 py-4 shadow-sm transition-all'
              value={model.folder.name}
            >
              <Radio.Control className='absolute top-3 right-4 size-5'>
                <Radio.Indicator />
              </Radio.Control>
              <Radio.Content className='flex size-full flex-col gap-6'>
                <div className='flex w-[calc(100%-1.25rem)] flex-col items-start gap-1'>
                  <Label className='max-w-full truncate text-2xl font-semibold group-data-[selected=true]:text-shadow-sm'>
                    {model.folder.name}
                  </Label>
                  <Description>
                    {model.meta.architecture} · {model.meta.dataset}
                  </Description>
                  <Chip variant='secondary' className='mt-1 self-start'>
                    {model.meta.encoder} Encoder
                  </Chip>
                </div>
                <div className='flex flex-col items-start'>
                  <div className='flex w-full items-center justify-between'>
                    <div className='font-bold'>
                      {(model.metrics.testAccuracy * 100).toFixed(2)}%
                    </div>
                    <div className='text-muted text-sm'>
                      {model.metrics.nWay}-way {model.metrics.kShot}-shot
                    </div>
                  </div>
                  <div className='text-muted text-[0.8rem]'>Accuracy</div>
                </div>
                <div className='flex justify-between'>
                  <Chip variant='tertiary' className='border'>
                    v{model.meta.version.join('.')}
                  </Chip>
                  <div className='text-sm'>
                    {dayjs(model.meta.train.timestamp).format('YYYY-M-D')}
                  </div>
                </div>
              </Radio.Content>
            </Radio>
          </motion.div>
        ))}
      </motion.div>
    </RadioGroup>
  );
}
