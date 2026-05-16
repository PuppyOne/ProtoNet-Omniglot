import { Separator } from '@heroui/react';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';


export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className='grid size-full place-items-center-safe'>
      <div className='flex flex-col gap-4'>
        <div className='flex gap-12'>
          <div className='text-end'>404</div>
          <Separator variant='secondary' orientation='vertical' />
          <div className='text-start'>{t('common.notFound')}</div>
        </div>
        <Separator />
        <Link className='transition-colors' to='/'>
          {t('common.goHome')}
        </Link>
      </div>
    </div>
  );
}
