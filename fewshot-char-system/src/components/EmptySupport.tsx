import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

import { childVariants } from '@/motions/stagger';
import LineMdFileRemove from '~icons/line-md/file-remove';


export default function EmptySupport() {
  const { t } = useTranslation();

  return (
    <div className='flex size-full flex-col items-center-safe justify-center-safe gap-4 select-none'>
      <LineMdFileRemove className='text-field-placeholder text-4xl' />
      <motion.div
        variants={childVariants}
        initial='hidden'
        animate='show'
        exit='exit'
        className='text-field-placeholder'
      >
        {t('support.empty')}
      </motion.div>
    </div>
  );
}
