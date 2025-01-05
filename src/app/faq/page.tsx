import React from 'react';

import { DashedLine } from '@/components/dashed-line';
import { FAQ } from '@/components/sections/faq';
import { Testimonials } from '@/components/sections/testimonials';

const Page = () => {
  return (
    <div className="from-cream relative mx-2.5 mt-2.5 rounded-b-2xl rounded-t-[36px] bg-gradient-to-b via-background to-background lg:mx-4">
      <FAQ
        className="py-28 text-center lg:pb-32 lg:pt-44"
        className2="max-w-xl lg:grid-cols-1"
      />
      <DashedLine className="mx-auto max-w-xl" />
      <Testimonials dashedLineClassName="hidden" />
    </div>
  );
};

export default Page;
