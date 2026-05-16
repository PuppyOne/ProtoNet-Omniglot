import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

import { fadeVariants } from '@/motions/fade';
import { childVariants } from '@/motions/stagger';
import LineMdFolderPlus from '~icons/line-md/folder-plus';


export default function EmptyQuery() {
  const { t } = useTranslation();

  return (
    <div className='flex size-full flex-col items-center-safe justify-center-safe gap-4 select-none'>
      <motion.div
        variants={fadeVariants}
        initial={false}
        animate='show'
        exit='exit'
      >
        <LineMdFolderPlus className='text-field-placeholder text-4xl' />
      </motion.div>
      <motion.div
        variants={childVariants}
        initial='hidden'
        animate='show'
        exit='exit'
        className='text-field-placeholder'
      >
        {t('common.pleaseSelectImage')}
      </motion.div>
    </div>
  );
}
