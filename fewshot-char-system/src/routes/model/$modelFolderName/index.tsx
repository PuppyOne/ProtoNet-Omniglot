import { AlertDialog, Button, ButtonGroup, Chip, toast } from '@heroui/react';
import { createFileRoute, notFound, useNavigate } from '@tanstack/react-router';
import { useAtom } from 'jotai';
import { motion } from 'motion/react';

import { modelsAtom, selectedModelAtom } from '@/atoms/model';
import { getModels, moveModelToTrash } from '@/client/apiClient';
import ModelImage from '@/components/ModelImage';
import MotionContainer from '@/components/MotionContainer';
import Section from '@/components/Section';
import { childVariants } from '@/motions/stagger';
import MdiTrashCanOutline from '~icons/mdi/trash-can-outline';


export const Route = createFileRoute('/model/$modelFolderName/')({
  component: ModelInfo,
});

function ModelInfo() {
  const { modelFolderName } = Route.useParams();

  const navigate = useNavigate();

  const [models, setModels] = useAtom(modelsAtom);
  const [selectedModel, setSelectedModel] = useAtom(selectedModelAtom);

  const model = models?.find(model => model.folder.name === modelFolderName);

  if (!model) throw notFound();

  const handleSelect = () => {
    setSelectedModel(model);
  };

  const handleSelectAndQuery = () => {
    handleSelect();

    navigate({ to: '/query' });
  };

  const fetchModels = async () => {
    const models = await getModels();

    setModels(models);
  };

  const handleMoveToTrash = () => {
    toast.promise(
      async () => {
        await moveModelToTrash({ modelFolderName });

        await fetchModels();

        await navigate({ to: '../' });
      },
      {
        loading: `正在移动 ${model.meta.name} 至回收站`,
        success: `已将 ${model.meta.name} 移动至回收站`,
        error: `移动 ${model.meta.name} 至回收站失败`,
      }
    );
  };

  return (
    <MotionContainer className='flex size-full flex-col gap-4 overflow-auto p-4 select-text'>
      <motion.section variants={childVariants} className='sticky top-0 z-10'>
        <Section className='flex items-center justify-between px-4 py-6 shadow-md'>
          <div className='flex items-baseline gap-2'>
            <h1 className='text-4xl font-semibold'>{modelFolderName}</h1>
            <Chip>v{model.meta.version.join('.')}</Chip>
          </div>
          <span className='flex items-center gap-3'>
            <ButtonGroup>
              <Button
                variant='secondary'
                isDisabled={selectedModel?.folder.name === modelFolderName}
                onPress={handleSelect}
              >
                {selectedModel?.folder.name === modelFolderName
                  ? '已选'
                  : '选择'}
              </Button>
              <Button onPress={handleSelectAndQuery}>
                <ButtonGroup.Separator />
                推理
              </Button>
            </ButtonGroup>
            <AlertDialog>
              <Button isIconOnly variant='danger'>
                <MdiTrashCanOutline className='text-lg' />
              </Button>
              <AlertDialog.Backdrop className='bg-red-950/60'>
                <AlertDialog.Container>
                  <AlertDialog.Dialog>
                    <AlertDialog.Header>
                      <AlertDialog.Icon />
                      <AlertDialog.Heading>
                        确认删除 {model.meta.name}
                      </AlertDialog.Heading>
                    </AlertDialog.Header>
                    <AlertDialog.Body>
                      此操作将移动 {model.folder.name} 至回收站。
                    </AlertDialog.Body>
                    <AlertDialog.Footer>
                      <Button slot='close' variant='tertiary'>
                        取消
                      </Button>
                      <Button
                        slot='close'
                        variant='danger'
                        onPress={handleMoveToTrash}
                      >
                        确定
                      </Button>
                    </AlertDialog.Footer>
                  </AlertDialog.Dialog>
                </AlertDialog.Container>
              </AlertDialog.Backdrop>
            </AlertDialog>
          </span>
        </Section>
      </motion.section>
      <motion.section>
        <MotionContainer className='grid grid-cols-2 justify-between gap-4'>
          <motion.section variants={childVariants}>
            <Section className='flex flex-col items-start gap-6 p-4'>
              <h2 className='text-accent text-3xl font-semibold'>模型信息</h2>
              <div className='flex flex-col items-start gap-3'>
                <div>
                  <span className='font-semibold'>结构: </span>
                  {model.meta.architecture}
                </div>

                <div>
                  <span className='font-semibold'>编码器: </span>
                  {model.meta.encoder}
                </div>

                <div>
                  <span className='font-semibold'>数据集: </span>
                  {model.meta.dataset}
                </div>

                <div>
                  <span className='font-semibold'>嵌入维度: </span>
                  {model.meta.embeddingDim}
                </div>

                <div>
                  <span className='font-semibold'>训练设置: </span>
                  {model.meta.train.nWay}-way {model.meta.train.kShot}-shot{' '}
                  {model.meta.train.qQuery}-query
                </div>

                <div>
                  <span className='font-semibold'>早停耐心值: </span>
                  {model.meta.train.earlyStopPatience ?? '未启用'}
                </div>

                <div>
                  <span className='font-semibold'>训练时间: </span>
                  {new Date(model.meta.train.timestamp).toLocaleString()}
                </div>
              </div>
            </Section>
          </motion.section>
          <motion.section variants={childVariants}>
            <Section className='flex flex-col items-start gap-6 p-4'>
              <h2 className='text-accent text-3xl font-semibold'>模型指标</h2>
              <div className='flex flex-col items-start gap-3'>
                <div>
                  <span className='font-semibold'>测试准确率: </span>
                  {(model.meta.metrics.testAccuracy * 100).toFixed(2)}%
                </div>
                {model.meta.metrics.testLoss != null && (
                  <div>
                    <span className='font-semibold'>测试损失: </span>
                    {model.meta.metrics.testLoss.toFixed(4)}
                  </div>
                )}
                <div>
                  <span className='font-semibold'>训练批次: </span>
                  {model.meta.train.trainBatches}
                </div>
                <div>
                  <span className='font-semibold'>验证批次: </span>
                  {model.meta.train.valBatches}
                </div>
                <div>
                  <span className='font-semibold'>测试批次: </span>
                  {model.meta.metrics.testBatches}
                </div>
              </div>
            </Section>
          </motion.section>
        </MotionContainer>
      </motion.section>
      {model.meta.files.images && (
        <motion.section variants={childVariants}>
          <Section className='flex flex-col items-start gap-6 p-4'>
            <div className='flex items-baseline gap-4'>
              <h2 className='text-accent text-3xl font-semibold'>可视化</h2>
              <span className='text-muted'>(点击放大)</span>
            </div>
            <div className='grid w-full grid-cols-2 gap-4 lg:grid-cols-3'>
              <ModelImage
                alt='损失曲线'
                modelFolderName={modelFolderName}
                imageName={
                  model.meta.files.images.lossCurveSvg ??
                  model.meta.files.images.lossCurve
                }
              />

              <ModelImage
                alt='准确率曲线'
                modelFolderName={modelFolderName}
                imageName={
                  model.meta.files.images.accuracyCurveSvg ??
                  model.meta.files.images.accuracyCurve
                }
              />

              <ModelImage
                alt='t-SNE 可视化'
                modelFolderName={modelFolderName}
                imageName={
                  model.meta.files.images.tSneSvg ??
                  model.meta.files.images.tSne
                }
              />
            </div>
          </Section>
        </motion.section>
      )}
    </MotionContainer>
  );
}
