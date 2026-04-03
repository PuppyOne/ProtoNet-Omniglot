import { Chip, Description, Label, Radio, RadioGroup } from '@heroui/react';
import { createFileRoute } from '@tanstack/react-router';
import { motion } from 'motion/react';

import { childVariants, containerVariants } from '@/motions/stagger';


export const Route = createFileRoute('/model/')({
  component: Model,
});

function Model() {
  return (
    <div className='size-full overflow-auto p-4'>
      <RadioGroup variant='secondary'>
        <motion.div
          variants={containerVariants}
          initial='hidden'
          animate='show'
          exit='exit'
          className='grid min-h-full grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4'
        >
          <motion.div variants={childVariants}>
            <Radio
              className='bg-surface data-[selected=true]:border-accent data-[selected=true]:bg-accent/10 data-[focus-visible=true]:border-accent data-[focus-visible=true]:bg-accent/10 relative flex rounded-xl border px-5 py-4 transition-all'
              value='0'
            >
              <Radio.Control className='absolute top-3 right-4 size-5'>
                <Radio.Indicator />
              </Radio.Control>
              <Radio.Content className='flex size-full flex-col gap-6'>
                <div className='flex w-[calc(100%-1.25rem)] flex-col items-start gap-1'>
                  <Label className='max-w-full truncate'>原型网络</Label>
                  <Description>96%</Description>
                </div>
                <Chip
                  variant='tertiary'
                  className='self-end text-sm font-semibold'
                >
                  ProtoNet
                </Chip>
              </Radio.Content>
            </Radio>
          </motion.div>
        </motion.div>
      </RadioGroup>
    </div>
  );
}
