import { Button } from '@heroui/react';
import { getCurrentWindow } from '@tauri-apps/api/window';

import LineMdClose from '~icons/line-md/close';
import LineMdMinus from '~icons/line-md/minus';
import LineMdSquare from '~icons/line-md/square';


export default function WindowControls(
  props: React.ComponentProps<typeof Button>
) {
  const window = getCurrentWindow();

  return (
    <>
      <Button
        {...props}
        isIconOnly
        className='pointer-events-auto'
        onPress={() => window.minimize()}
      >
        <LineMdMinus className='size-5.5' />
      </Button>
      <Button
        {...props}
        isIconOnly
        className='pointer-events-auto'
        onPress={() => window.toggleMaximize()}
      >
        <LineMdSquare className='size-5.5' />
      </Button>
      <Button
        {...props}
        isIconOnly
        className='pointer-events-auto'
        onPress={() => window.close()}
      >
        <LineMdClose className='size-5.5' />
      </Button>
    </>
  );
}
