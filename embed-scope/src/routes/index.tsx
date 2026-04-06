import { Chip } from '@heroui/react';
import { createFileRoute } from '@tanstack/react-router';
import { useAtom } from 'jotai';
import { motion } from 'motion/react';

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
  const [isEngineReady] = useAtom(isEngineReadyAtom);
  const [characterSupports] = useAtom(characterSupportsAtom);
  const [selectedModel] = useAtom(selectedModelAtom);

  return (
    <MotionContainer className='grid size-full grid-cols-2 grid-rows-2 gap-4 p-4'>
      <HomeLinkCard to='/'>
        <motion.h3 className='text-accent/90 pb-4 text-3xl font-semibold'>
          推理引擎
        </motion.h3>
        <motion.span
          variants={childVariants}
          className='flex items-center gap-2'
        >
          <span className='flex items-center gap-2 text-2xl font-semibold'>
            {isEngineReady ? (
              <>
                <LineMdConfirm />
                就绪
              </>
            ) : (
              <>
                <LineMdLoadingAltLoop />
                初始化
              </>
            )}
          </span>
        </motion.span>
      </HomeLinkCard>
      <HomeLinkCard to='/support'>
        <motion.h3 className='text-accent/90 pb-4 text-3xl font-semibold'>
          字库
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
          字符
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
          样本
        </motion.span>
      </HomeLinkCard>
      <HomeLinkCard to='/model'>
        <motion.h3 className='text-accent/90 pb-4 text-3xl font-semibold'>
          模型
        </motion.h3>
        {selectedModel ? (
          <>
            {' '}
            <motion.span
              variants={childVariants}
              className='flex items-center gap-4 text-2xl font-semibold'
            >
              {selectedModel.meta.name}{' '}
              <Chip color='accent' variant='soft'>
                v{selectedModel?.meta.version.join('.')}
              </Chip>
            </motion.span>
            <motion.span
              variants={childVariants}
              className='text-muted flex items-center gap-2 text-sm'
            >
              {selectedModel.metrics.nWay}-way {selectedModel?.metrics.kShot}
              -shot · Acc{' '}
              {(selectedModel.metrics.testAccuracy * 100).toFixed(2)}%
            </motion.span>
          </>
        ) : (
          <motion.span
            variants={childVariants}
            className='flex items-center gap-4 text-2xl font-semibold'
          >
            点击选择
          </motion.span>
        )}
      </HomeLinkCard>
      <HomeLinkCard to='/model'>
        <motion.h3 className='text-accent/90 pb-4 text-3xl font-semibold'>
          推理
        </motion.h3>
        <motion.span
          variants={childVariants}
          className='flex items-center gap-4 text-2xl font-semibold'
        >
          点击进入
        </motion.span>{' '}
        <motion.span
          variants={childVariants}
          className='text-muted flex items-center gap-2 text-sm'
        >
          上传图像
        </motion.span>
      </HomeLinkCard>
    </MotionContainer>
  );
}
