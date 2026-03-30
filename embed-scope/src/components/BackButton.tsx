import { Button } from '@heroui/react';
import { useCanGoBack, useRouter } from '@tanstack/react-router';

import IconArrowLeft from '~icons/line-md/arrow-left';


export default function BackButton(props: React.ComponentProps<typeof Button>) {
  const router = useRouter();
  const canGoBack = useCanGoBack();

  const handleBack = (): void => canGoBack && router.history.back();

  return (
    <Button {...props} onPress={handleBack}>
      <IconArrowLeft className='size-6' />
    </Button>
  );
}
