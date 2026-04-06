import { Avatar, Label, Meter, Surface, toast } from '@heroui/react';
import { createFileRoute } from '@tanstack/react-router';
import { convertFileSrc } from '@tauri-apps/api/core';
import { useAtom } from 'jotai';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

import { selectedModelAtom } from '@/atoms/model';
import { InferOutput } from '@/client/_apiTypes';
import { infer } from '@/client/apiClient';
import EmptyQuery from '@/components/EmptyQuery';
import ImagePicker from '@/components/ImagePicker';
import { fadeVariants } from '@/motions/fade';
import { childVariants, containerVariants } from '@/motions/stagger';
import SvgSpinnersBlocksWave from '~icons/svg-spinners/blocks-wave';


export const Route = createFileRoute('/query/')({
  component: Query,
});

function Query() {
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [selectedModel] = useAtom(selectedModelAtom);

  const [result, setResult] = useState<InferOutput | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const handleChange = async (path: string | null) => {
    if (path) {
      setImagePath(path);

      if (!selectedModel) {
        toast.danger('请先选择模型');
        return;
      }

      try {
        const result = await infer({
          modelFolderName: selectedModel.folder.name,
          queryStrs: [path],
        });

        setResult(result);
      } catch (e: unknown) {
        setResult(null);
        if (e instanceof Error) setError(e);
        else setError(new Error('未知错误'));
      }
    }
  };

  return (
    <div className='grid size-full grid-rows-[min-content_1fr]'>
      <ImagePicker value={imagePath} onChange={handleChange} />
      <motion.div
        variants={containerVariants}
        initial='hidden'
        animate='show'
        exit='exit'
        className='grid size-full grid-cols-2 grid-rows-2 gap-4 overflow-hidden p-4'
      >
        <AnimatePresence mode='wait'>
          {imagePath ? (
            <>
              <motion.section key='image' variants={childVariants}>
                <Avatar className='grid size-full place-items-center-safe rounded-none bg-transparent'>
                  <Avatar.Image
                    className='object-contain'
                    src={convertFileSrc(imagePath)}
                  />
                </Avatar>
              </motion.section>
              <motion.section
                key='confidences'
                variants={childVariants}
                className='row-span-2'
              >
                <Surface className='size-full rounded-3xl'>
                  <motion.div
                    variants={containerVariants}
                    initial='hidden'
                    animate='show'
                    exit='exit'
                    className='flex size-full flex-col gap-6 overflow-auto px-8 py-4'
                  >
                    {result &&
                      Object.entries(result.confidences[0])
                        .sort(
                          ([, confidenceA], [, confidenceB]) =>
                            confidenceB - confidenceA
                        )
                        .map(([characterName, confidence]) => (
                          <motion.div
                            key={characterName}
                            layoutId={`confidence-${characterName}`}
                            variants={childVariants}
                          >
                            <Meter
                              formatOptions={{
                                style: 'percent',
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }}
                              maxValue={1}
                              value={confidence}
                            >
                              <Label>{characterName}</Label>
                              <Meter.Output />
                              <Meter.Track>
                                <Meter.Fill />
                              </Meter.Track>
                            </Meter>
                          </motion.div>
                        ))}
                  </motion.div>
                </Surface>
              </motion.section>
              <motion.section key='result'>
                <Surface
                  variant='transparent'
                  className='border-border size-full rounded-3xl border-2 px-8 py-4 opacity-90'
                >
                  <motion.div
                    variants={containerVariants}
                    initial='hidden'
                    animate='show'
                    exit='exit'
                    className='flex size-full flex-col items-start gap-2 overflow-auto'
                  >
                    <AnimatePresence mode='popLayout'>
                      {result ? (
                        <>
                          <motion.div variants={childVariants}>
                            预测结果: {result?.prediction[0]}
                          </motion.div>
                          <motion.div variants={childVariants}>
                            耗时: {Math.round(result?.timeSpentS * 1000)}ms
                          </motion.div>
                        </>
                      ) : error ? (
                        <>
                          <motion.div
                            variants={childVariants}
                            className='text-danger'
                          >
                            推理失败:
                          </motion.div>
                          <motion.div variants={childVariants} className='pl-8'>
                            {error.name}
                          </motion.div>
                          <motion.div variants={childVariants} className='pl-8'>
                            {error.message}
                          </motion.div>
                        </>
                      ) : (
                        <motion.div
                          key='spinner'
                          variants={fadeVariants}
                          initial='hidden'
                          animate='show'
                          exit='exit'
                          className='m-auto overflow-hidden'
                        >
                          <SvgSpinnersBlocksWave className='text-4xl' />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </Surface>
              </motion.section>
            </>
          ) : (
            <motion.div
              key='empty'
              className='pointer-events-none fixed inset-0 col-span-full row-span-full grid place-content-center'
            >
              <EmptyQuery />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
