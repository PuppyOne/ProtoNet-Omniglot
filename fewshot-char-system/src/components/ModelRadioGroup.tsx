import {
  Button,
  Chip,
  Description,
  Label,
  Radio,
  RadioGroup,
} from '@heroui/react';
import { useNavigate } from '@tanstack/react-router';
import dayjs from 'dayjs';
import { useAtom } from 'jotai';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

import { modelsAtom, selectedModelAtom } from '@/atoms/model';
import { childVariants } from '@/motions/stagger';
import MdiInformationSlabCircleOutline from '~icons/mdi/information-slab-circle-outline';

import MotionContainer from './MotionContainer';


export default function ModelRadioGroup(
  props: React.ComponentProps<typeof RadioGroup>
) {
  const { t } = useTranslation();

  const [models] = useAtom(modelsAtom);
  const [selectedModel, setSelectedModel] = useAtom(selectedModelAtom);

  const navigate = useNavigate();

  return (
    <RadioGroup
      {...props}
      value={selectedModel?.folder.name ?? null}
      variant='secondary'
    >
      <MotionContainer className='grid min-h-full grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-4'>
        {models?.map(model => (
          <motion.div
            key={model.folder.name}
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
                  <div className='text-muted text-[0.8rem]'>
                    {t('model.accuracy')}
                  </div>
                </div>
                <div className='flex justify-between'>
                  <Chip variant='tertiary' className='border'>
                    v{model.meta.version.join('.')}
                  </Chip>
                  <div className='relative w-1/2 text-sm'>
                    <div className='absolute top-1/2 right-0 -translate-y-1/2 text-sm transition-all duration-300 group-hover:opacity-0'>
                      {dayjs(model.meta.train.timestamp).format('YYYY-M-D')}
                    </div>
                    <div className='absolute top-1/2 right-0 flex -translate-y-1/2 text-sm opacity-0 transition-all duration-300 group-hover:opacity-100'>
                      <Button
                        variant='primary'
                        onPress={() =>
                          navigate({
                            to: '$modelFolderName',
                            params: { modelFolderName: model.folder.name },
                          })
                        }
                      >
                        <MdiInformationSlabCircleOutline />
                        {t('model.details')}
                      </Button>
                    </div>
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
