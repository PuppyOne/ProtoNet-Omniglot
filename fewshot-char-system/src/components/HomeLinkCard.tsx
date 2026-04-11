import { Link } from '@tanstack/react-router';
import { motion } from 'motion/react';

import { childVariants } from '@/motions/stagger';
import LineMdNavigationRightUp from '~icons/line-md/navigation-right-up';

import MotionContainer from './MotionContainer';
import Section from './Section';


export default function HomeLinkCard({
  children,
  ...props
}: React.ComponentProps<typeof Link>) {
  return (
    <motion.section variants={childVariants}>
      <Link
        {...props}
        className={`group relative ${props.className ?? ''}`}
        activeProps={{ className: 'cursor-auto' }}
      >
        {state => (
          <>
            <Section className='transition-all duration-200 group-hover:-translate-y-0.5 group-hover:opacity-90 group-hover:shadow-sm'>
              <MotionContainer className='flex flex-col items-start gap-4 p-4'>
                {typeof children === 'function' ? children(state) : children}
              </MotionContainer>
            </Section>

            {state.isActive || (
              <LineMdNavigationRightUp className='absolute top-6 right-6 text-sm opacity-40 transition-all duration-200 ease-out group-hover:translate-x-3 group-hover:-translate-y-3 group-hover:text-xl group-hover:opacity-100' />
            )}
          </>
        )}
      </Link>
    </motion.section>
  );
}
