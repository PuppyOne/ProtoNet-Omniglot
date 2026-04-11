import { Button, Input } from '@heroui/react';
import { open } from '@tauri-apps/plugin-dialog';
import { motion } from 'motion/react';

import type { OverrideProps } from '@/types/override-props';


export default function ImagePicker({
  placeholder = '选择图片',
  value,
  onChange,
  ...props
}: OverrideProps<
  React.ComponentPropsWithoutRef<typeof motion.div>,
  {
    placeholder?: string;
    value: string | null;
    onChange?: (path: string | null) => void;
  }
>) {
  const handleExplore = async () => {
    const path = await open();

    onChange?.(path);
  };

  return (
    <motion.div {...props} className='p-4'>
      <div className='gap-none flex justify-center-safe'>
        <Input
          className='rounded-l-full rounded-r-none shadow-none'
          readOnly
          value={value ?? ''}
          placeholder={placeholder}
          onClick={handleExplore}
        />
        <Button
          className='rounded-l-none rounded-r-full'
          onPress={handleExplore}
        >
          浏览
        </Button>
      </div>
    </motion.div>
  );
}
