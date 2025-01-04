import React from 'react';

import { DashedLine } from '@/components/dashed-line';
import { FAQ } from '@/components/sections/faq';
import { Testimonials } from '@/components/sections/testimonials';

const Page = () => {
  return (
    <div className="relative mx-2.5 mt-2.5 rounded-b-2xl rounded-t-[36px] bg-gradient-to-b from-[#F8F4E7] via-background to-background lg:mx-4">
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
