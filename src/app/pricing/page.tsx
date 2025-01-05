import React from 'react';

import { Pricing } from '@/components/sections/pricing';
import Pricing2 from '@/components/sections/pricing2';

const Page = () => {
  return (
    <div className="from-cream relative mx-2.5 mt-2.5 rounded-b-2xl rounded-t-[36px] bg-gradient-to-b via-background to-background lg:mx-4">
      <Pricing className="py-28 text-center lg:pb-32 lg:pt-44" />
      <Pricing2 />
    </div>
  );
};

export default Page;
