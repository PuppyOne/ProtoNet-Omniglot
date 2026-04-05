import { Avatar, Label, Meter, Surface, toast } from '@heroui/react';
import { createFileRoute } from '@tanstack/react-router';
import { convertFileSrc } from '@tauri-apps/api/core';
import { useAtom } from 'jotai';
import { useState } from 'react';

import { selectedModelAtom } from '@/atoms/model';
import { InferOutput } from '@/client/_apiTypes';
import { infer } from '@/client/apiClient';
import ImagePicker from '@/components/ImagePicker';


export const Route = createFileRoute('/query/')({
  component: Query,
});

function Query() {
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [selectedModel] = useAtom(selectedModelAtom);

  const [result, setResult] = useState<InferOutput | null>(null);

  const handleChange = async (path: string | null) => {
    if (path) {
      setImagePath(path);

      if (!selectedModel) {
        toast.danger('请先选择模型');
        return;
      }

      const handleInfer = async (): Promise<InferOutput> => {
        const result = await infer({
          modelFolderName: selectedModel.folder.name,
          queryStrs: [path],
        });

        setResult(result);

        return result;
      };

      toast.promise(handleInfer, {
        loading: '正在推理',
        success: result =>
          `结果: ${result.prediction} 耗时: ${result.timeSpentS}`,
        error: error => `未知错误 ${error.message}`,
      });
    }
  };

  return (
    <div className='grid size-full grid-rows-[min-content_1fr]'>
      <ImagePicker value={imagePath} onChange={handleChange} />
      <div className='grid size-full grid-cols-2 grid-rows-2 gap-4 overflow-hidden p-4'>
        <Avatar className='grid size-full place-items-center-safe rounded-none bg-transparent'>
          {imagePath ? (
            <Avatar.Image
              className='object-contain'
              src={convertFileSrc(imagePath)}
            />
          ) : (
            '请选择图片'
          )}
        </Avatar>
        <Surface className='row-span-2 flex size-full flex-col gap-6 overflow-auto rounded-3xl px-8 py-4'>
          {result &&
            Object.entries(result.confidences[0])
              .sort(
                ([, confidenceA], [, confidenceB]) => confidenceB - confidenceA
              )
              .map(([characterName, confidence]) => (
                <Meter
                  key={characterName}
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
              ))}
        </Surface>
        <Surface
          variant='transparent'
          className='border-border row-span-2 flex size-full flex-col items-start gap-2 overflow-auto rounded-3xl border-2 px-8 py-4 opacity-90'
        >
          {result && (
            <>
              <div>预测结果: {result?.prediction[0]}</div>
              <div>耗时: {Math.round(result?.timeSpentS * 1000)}ms</div>
            </>
          )}
        </Surface>
      </div>
    </div>
  );
}
