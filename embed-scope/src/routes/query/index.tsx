import { toast } from '@heroui/react';
import { createFileRoute } from '@tanstack/react-router';
import { convertFileSrc } from '@tauri-apps/api/core';
import { useState } from 'react';

import { infer } from '@/client/apiClient';
import ImagePicker from '@/components/ImagePicker';


export const Route = createFileRoute('/query/')({
  component: Query,
});

function Query() {
  const [imagePath, setImagePath] = useState<string | null>(null);

  const handleChange = async (path: string | null) => {
    if (path) {
      setImagePath(path);

      const supportDir = '../omniglot/python/images_evaluation/Angelic';

      const result_promise = infer({ supportDir, queryStrs: [path] });

      toast.promise(result_promise, {
        loading: '正在推理',
        success: result => `结果: ${result}`,
        error: error => `未知错误 ${error.message}`,
      });
    }
  };

  return (
    <>
      <ImagePicker value={imagePath} onChange={handleChange} />
      <div className='aspect-square'>
        {imagePath ? <img src={convertFileSrc(imagePath)} /> : '请选择图片'}
      </div>
    </>
  );
}
