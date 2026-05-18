import { Modal } from '@heroui/react';
import { convertFileSrc } from '@tauri-apps/api/core';
import { useEffect, useState } from 'react';

import { resolveModelPath } from '@/client/apiClient';
import type { OverrideProps } from '@/types/override-props';


export default function ModelImage({
  modelFolderName,
  imageName,
  alt,
  ...props
}: OverrideProps<
  React.ComponentProps<'img'>,
  { modelFolderName: string; imageName?: string | null }
>) {
  const [src, setSrc] = useState<string | undefined>(undefined);

  if (!imageName) return null;

  const fetchSrc = async () => {
    const src = convertFileSrc(
      await resolveModelPath({ modelFolderName, fileName: imageName })
    );

    setSrc(src);
  };

  useEffect(() => {
    void fetchSrc();
  }, []);

  return (
    <div className='flex flex-col gap-2'>
      <span className='font-semibold'>{alt}</span>
      <Modal>
        <Modal.Trigger className='size-full'>
          <img
            {...props}
            src={src}
            alt={alt}
            className='size-full object-contain'
          />
        </Modal.Trigger>
        <Modal.Backdrop variant='blur'>
          <Modal.Container size='cover'>
            <Modal.Dialog>
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading>
                  <header className='text-3xl font-semibold'>{alt}</header>
                </Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                <img
                  {...props}
                  src={src}
                  alt={alt}
                  className='size-full object-contain'
                />
              </Modal.Body>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}
