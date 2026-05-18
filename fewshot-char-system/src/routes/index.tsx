import { Chip } from '@heroui/react';
import { createFileRoute } from '@tanstack/react-router';
import { useAtom } from 'jotai';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

import { isEngineReadyAtom } from '@/atoms/engine';
import { selectedModelAtom } from '@/atoms/model';
import { characterSupportsAtom } from '@/atoms/support';
import HomeLinkCard from '@/components/HomeLinkCard';
import MotionContainer from '@/components/MotionContainer';
import { childVariants } from '@/motions/stagger';
import LineMdConfirm from '~icons/line-md/confirm';
import LineMdLoadingAltLoop from '~icons/line-md/loading-alt-loop';


export const Route = createFileRoute('/')({ component: Home });

function Home() {
  const { t } = useTranslation();

  const [isEngineReady] = useAtom(isEngineReadyAtom);
  const [characterSupports] = useAtom(characterSupportsAtom);
  const [selectedModel] = useAtom(selectedModelAtom);

  return (
    <MotionContainer className='grid size-full grid-cols-2 grid-rows-[repeat(2,1fr)] gap-4 overflow-auto p-4'>
      <HomeLinkCard to='/'>
        <motion.h3 className='text-accent/90 pb-4 text-3xl font-semibold'>
          {t('home.engineTitle')}
        </motion.h3>
        {isEngineReady ? (
          <>
            <motion.span
              variants={childVariants}
              className='flex items-center gap-2 text-2xl font-semibold'
            >
              <LineMdConfirm />
              {t('home.ready')}
            </motion.span>
            <motion.span
              variants={childVariants}
              className='text-muted flex items-center text-sm'
            >
              {t('home.readyDesc')}
            </motion.span>
          </>
        ) : (
          <>
            <motion.span
              variants={childVariants}
              className='flex items-center gap-2 text-2xl font-semibold'
            >
              <LineMdLoadingAltLoop />
              {t('home.initializing')}
            </motion.span>

            <motion.span
              variants={childVariants}
              className='text-muted flex items-center text-sm'
            >
              {t('home.initializingDesc')}
            </motion.span>
          </>
        )}
      </HomeLinkCard>
      <HomeLinkCard to='/support'>
        <motion.h3 className='text-accent/90 pb-4 text-3xl font-semibold'>
          {t('nav.support')}
        </motion.h3>
        <motion.span
          variants={childVariants}
          className='flex items-center text-2xl font-semibold'
        >
          {characterSupports !== undefined ? (
            Object.keys(characterSupports).length
          ) : (
            <LineMdLoadingAltLoop />
          )}{' '}
          {t('home.characters')}
        </motion.span>
        <motion.span
          variants={childVariants}
          className='text-muted flex items-center text-sm'
        >
          {characterSupports ? (
            Object.values(characterSupports).reduce(
              (sum, arr) => sum + arr.length,
              0
            )
          ) : (
            <LineMdLoadingAltLoop />
          )}{' '}
          {t('home.samples')}
        </motion.span>
      </HomeLinkCard>
      <HomeLinkCard to='/model'>
        <motion.h3 className='text-accent/90 pb-4 text-3xl font-semibold'>
          {t('nav.model')}
        </motion.h3>
        {selectedModel ? (
          <>
            <motion.span
              variants={childVariants}
              className='flex items-center gap-4 text-2xl font-semibold'
            >
              {selectedModel.meta.name}{' '}
              <Chip color='accent' variant='soft'>
                v{selectedModel.meta.version.join('.')}
              </Chip>
            </motion.span>
            <motion.span
              variants={childVariants}
              className='text-muted flex items-center gap-2 text-sm'
            >
              {selectedModel.meta.metrics.nWay}-way{' '}
              {selectedModel.meta.metrics.kShot}
              -shot · Acc{' '}
              {(selectedModel.meta.metrics.testAccuracy * 100).toFixed(2)}%
            </motion.span>
          </>
        ) : (
          <motion.span
            variants={childVariants}
            className='flex items-center gap-4 text-2xl font-semibold'
          >
            {t('home.clickToSelect')}
          </motion.span>
        )}
      </HomeLinkCard>
      <HomeLinkCard to='/query'>
        <motion.h3 className='text-accent/90 pb-4 text-3xl font-semibold'>
          {t('common.inference')}
        </motion.h3>
        <motion.span
          variants={childVariants}
          className='flex items-center gap-4 text-2xl font-semibold'
        >
          {t('home.clickToEnter')}
        </motion.span>
        <motion.span
          variants={childVariants}
          className='text-muted flex items-center gap-2 text-sm'
        >
          {t('home.uploadImage')}
        </motion.span>
      </HomeLinkCard>
    </MotionContainer>
  );
}
