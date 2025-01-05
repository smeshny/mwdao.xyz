import React from 'react';

import CreamContainer from '@/components/cream-container';
import { DashedLine } from '@/components/dashed-line';
import { FAQ } from '@/components/sections/faq';
import { Testimonials } from '@/components/sections/testimonials';

const Page = () => {
  return (
    <CreamContainer>
      <FAQ
        className="py-28 text-center lg:pb-32 lg:pt-44"
        className2="max-w-xl lg:grid-cols-1"
      />
      <DashedLine className="mx-auto max-w-xl" />
      <Testimonials dashedLineClassName="hidden" />
    </CreamContainer>
  );
};

export default Page;
