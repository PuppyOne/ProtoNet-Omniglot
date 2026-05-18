import { Accordion, Avatar, Label, Meter, toast } from '@heroui/react';
import { createFileRoute } from '@tanstack/react-router';
import { convertFileSrc } from '@tauri-apps/api/core';
import { useAtom } from 'jotai';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { isEngineReadyAtom } from '@/atoms/engine';
import { selectedModelAtom } from '@/atoms/model';
import { characterSupportsAtom } from '@/atoms/support';
import type { InferOutput } from '@/client/_apiTypes';
import { infer } from '@/client/apiClient';
import EmptyQuery from '@/components/EmptyQuery';
import ImagePicker from '@/components/ImagePicker';
import MotionContainer from '@/components/MotionContainer';
import Section from '@/components/Section';
import { fadeVariants } from '@/motions/fade';
import { childVariants } from '@/motions/stagger';
import { parseError } from '@/utils/parse-error';
import SvgSpinnersBlocksWave from '~icons/svg-spinners/blocks-wave';


export const Route = createFileRoute('/query/')({
  component: Query,
});

function Query() {
  const { t } = useTranslation();

  const [imagePath, setImagePath] = useState<string | null>(null);
  const [isEngineReady] = useAtom(isEngineReadyAtom);
  const [selectedModel] = useAtom(selectedModelAtom);
  const [characterSupports] = useAtom(characterSupportsAtom);

  const [result, setResult] = useState<InferOutput | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const isEngineReadyPromiseRef = useRef(Promise.withResolvers<void>());

  const handleChange = async (path: string | null) => {
    if (path) {
      setImagePath(path);

      if (!selectedModel) {
        toast.danger(t('query.pleaseSelectModel'));
        return;
      }

      await isEngineReadyPromiseRef.current.promise;

      try {
        const result = await infer({
          model: selectedModel,
          queryStrs: [path],
        });

        setResult(result);
        setError(null);
      } catch (e: unknown) {
        setResult(null);
        setError(parseError(e));
      }
    }
  };

  useEffect(() => {
    if (isEngineReady) isEngineReadyPromiseRef.current.resolve();
  }, [isEngineReady]);

  return (
    <MotionContainer className='grid size-full grid-rows-[min-content_1fr]'>
      <ImagePicker
        variants={childVariants}
        value={imagePath}
        onChange={handleChange}
      />
      <MotionContainer className='grid size-full grid-flow-col grid-cols-2 grid-rows-2 gap-4 overflow-hidden p-4 [@media(max-height:480px)]:grid-cols-3 [@media(max-height:480px)]:grid-rows-1'>
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
              <motion.section key='result'>
                <Section
                  variant='transparent'
                  className='border-border border-2 px-8 py-4 opacity-90'
                >
                  <MotionContainer className='flex size-full flex-col items-start gap-2 overflow-auto'>
                    <AnimatePresence>
                      {result ? (
                        <>
                          <motion.div
                            key={`prediction-${JSON.stringify(result.request)}`}
                            variants={childVariants}
                            className='text-accent text-2xl font-semibold 2xl:text-3xl'
                          >
                            {t('query.prediction', {
                              result: result.prediction[0],
                            })}
                          </motion.div>
                          <motion.div
                            key={`time-spent-${JSON.stringify(result.request)}`}
                            variants={childVariants}
                          >
                            {t('query.timeSpent', {
                              ms: Math.round(result.timeSpentS * 1000),
                            })}
                          </motion.div>
                        </>
                      ) : error ? (
                        <>
                          <motion.div
                            variants={childVariants}
                            className='text-danger'
                          >
                            {t('query.inferenceFailed')}
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
                          className='absolute inset-0 grid size-full grid-rows-[1fr_auto_1fr] place-items-center'
                        >
                          <SvgSpinnersBlocksWave className='row-start-2 text-4xl' />
                          <AnimatePresence>
                            {isEngineReady || (
                              <motion.div
                                variants={fadeVariants}
                                initial='hide'
                                animate='show'
                                exit='exit'
                                className='row-start-3 self-start text-nowrap'
                              >
                                {t('query.initializing')}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </MotionContainer>
                </Section>
              </motion.section>
              <motion.section
                key='confidences'
                variants={childVariants}
                className='row-span-full'
              >
                <Section>
                  <MotionContainer className='flex size-full flex-col gap-2 overflow-auto px-8 py-4'>
                    {result && (
                      <>
                        <motion.div
                          key='header'
                          layoutId='confidenceHeader'
                          variants={childVariants}
                          className='text-accent self-start text-2xl font-semibold 2xl:text-3xl'
                        >
                          {t('query.confidenceRanking')}
                        </motion.div>
                        <Accordion
                          allowsMultipleExpanded
                          hideSeparator
                          defaultExpandedKeys={[...Array(3)].map(
                            (_, i) => `${i}`
                          )}
                        >
                          {Object.entries(result.confidences[0])
                            .sort(
                              ([, confidenceA], [, confidenceB]) =>
                                confidenceB - confidenceA
                            )
                            .map(([characterName, confidence], i) => (
                              <Accordion.Item
                                key={characterName}
                                id={`${i}`}
                                className=' '
                              >
                                <motion.div
                                  layoutId={`confidence-${characterName}`}
                                  variants={childVariants}
                                >
                                  <Accordion.Heading>
                                    <Accordion.Trigger className='gap-4 rounded-3xl transition-all duration-100 aria-expanded:rounded-none'>
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
                                      <Accordion.Indicator />
                                    </Accordion.Trigger>
                                  </Accordion.Heading>
                                  <Accordion.Panel>
                                    <Accordion.Body className='pt-1'>
                                      <div className='text-start'>
                                        {t('query.supportSamples')}
                                      </div>
                                      <div className='flex size-full h-10 overflow-auto 2xl:h-20'>
                                        {characterSupports?.[characterName].map(
                                          ({ filepath }) => (
                                            <img
                                              key={filepath}
                                              src={convertFileSrc(filepath)}
                                            />
                                          )
                                        )}
                                      </div>
                                    </Accordion.Body>
                                  </Accordion.Panel>
                                </motion.div>
                              </Accordion.Item>
                            ))}
                        </Accordion>
                      </>
                    )}
                  </MotionContainer>
                </Section>
              </motion.section>
            </>
          ) : (
            <motion.div
              key='empty'
              className='pointer-events-none inset-0 col-span-full row-span-full grid place-content-center [@media(min-height:480px)]:fixed'
            >
              <EmptyQuery />
            </motion.div>
          )}
        </AnimatePresence>
      </MotionContainer>
    </MotionContainer>
  );
}
