import React from 'react';

import { cn } from '@/lib/utils';

type CreamContainerProps = {
  children: React.ReactNode;
  variant?: 'top' | 'bottom';
  className?: string;
};

const CreamContainer = ({
  children,
  variant = 'top',
  className,
}: CreamContainerProps) => {
  return (
    <div
      className={cn(
        'relative mx-2.5 mt-2.5 lg:mx-4',
        variant === 'top' &&
          'rounded-b-2xl rounded-t-[36px] bg-gradient-to-b from-cream via-background to-background/80',
        variant === 'bottom' &&
          'rounded-b-[36px] rounded-t-2xl bg-gradient-to-b from-background via-background to-cream',
        className,
      )}
    >
      {children}
    </div>
  );
};

export default CreamContainer;
