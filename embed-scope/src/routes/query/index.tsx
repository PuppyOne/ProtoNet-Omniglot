import { toast } from '@heroui/react';
import { createFileRoute } from '@tanstack/react-router';
import { rpc } from 'pyloid-js';
import { useState } from 'react';

import ImagePicker from '@/components/ImagePicker';
import type { RPCErrorObject } from '@/types/rpc-error-object';
import { RPCErrorType } from '@/types/rpc-error-type';
import { isRPCError } from '@/utils/is-rpc-error';


export const Route = createFileRoute('/query/')({
  component: Query,
});

function Query() {
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const handleChange = async (path: string | null) => {
    if (path) {
      const base64 = await rpc.call<
        { path: string | null },
        string | RPCErrorObject
      >('read_image', { path });

      if (isRPCError(base64)) {
        switch (base64.error) {
          case RPCErrorType.UNSUPPORTED_FILE_TYPE:
            toast.danger('不支持的文件类型');
            break;

          default:
            toast.danger('未知错误');
        }
        return;
      }

      setImagePath(path);
      setImageBase64(base64);

      const supportDir = '../omniglot/python/images_evaluation/Angelic';

      const result_promise = rpc.call<
        { support_dir: string; query_strs: string[] },
        string
      >('infer', { support_dir: supportDir, query_strs: [path] });

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
        {imageBase64 ? <img src={imageBase64} /> : '请选择图片'}
      </div>
    </>
  );
}
