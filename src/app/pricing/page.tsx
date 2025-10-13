import React from 'react';

import Background from '@/components/layout/background';
import { Pricing } from '@/components/sections/pricing';
import Pricing2 from '@/components/sections/pricing2';
const Page = () => {
  return (
    <Background>
      <Pricing className="py-28 text-center lg:pt-44 lg:pb-32" />
      <Pricing2 />
    </Background>
  );
};

export default Page;
