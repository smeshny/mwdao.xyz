import { Features } from '@/components/sections/features';
import Hero from '@/components/sections/hero';
import Logos from '@/components/sections/logos';
import { Pricing } from '@/components/sections/pricing';
import { ResourceAllocation } from '@/components/sections/resource-allocation';
import { Testimonials } from '@/components/sections/testimonials';

export default function Home() {
  return (
    <>
      <div className="relative mx-2.5 mt-2.5 rounded-b-2xl rounded-t-[36px] bg-gradient-to-b from-[#F8F4E7] via-muted to-muted/80 lg:mx-4">
        <Hero />
        <Logos />
        <Features />
        <ResourceAllocation />
      </div>
      <Testimonials />
      <Pricing />
    </>
  );
}
