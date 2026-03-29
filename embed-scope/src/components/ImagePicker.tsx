import { Button, Input } from '@heroui/react';
import { rpc } from 'pyloid-js';


export default function ImagePicker({
  placeholder = '选择图片',
  value,
  onChange,
}: {
  placeholder?: string;
  value: string | null;
  onChange?: (path: string | null) => void;
}) {
  const handleExplore = async () => {
    const path = await rpc.call<undefined, string | null>('select_file');

    onChange?.(path);
  };

  return (
    <div className='p-4'>
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
    </div>
  );
}
