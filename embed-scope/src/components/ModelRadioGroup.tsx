import { Chip, Description, Label, Radio, RadioGroup } from '@heroui/react';
import dayjs from 'dayjs';
import { useAtom } from 'jotai';
import { motion } from 'motion/react';

import { modelsAtom, selectedModelAtom } from '@/atoms/model';
import { childVariants } from '@/motions/stagger';

import MotionContainer from './MotionContainer';


export default function ModelRadioGroup(
  props: React.ComponentProps<typeof RadioGroup>
) {
  const [models] = useAtom(modelsAtom);
  const [selectedModel, setSelectedModel] = useAtom(selectedModelAtom);

  return (
    <RadioGroup
      {...props}
      value={selectedModel?.folder.name ?? null}
      variant='secondary'
    >
      <MotionContainer className='grid min-h-full grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-4'>
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
              onClick={() => setSelectedModel(model)}
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
                      {(model.meta.metrics.testAccuracy * 100).toFixed(2)}%
                    </div>
                    <div className='text-muted text-sm'>
                      {model.meta.metrics.nWay}-way {model.meta.metrics.kShot}
                      -shot
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
      </MotionContainer>
    </RadioGroup>
  );
}
