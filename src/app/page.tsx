import { Features } from '@/components/sections/features';
import Hero from '@/components/sections/hero';
import Logos from '@/components/sections/logos';
import { ResourceAllocation } from '@/components/sections/resource-allocation';

export default function Home() {
  return (
    <>
      <div className="relative mx-2.5 mt-2.5 rounded-[36px] bg-gradient-to-b from-[#F8F4E7] via-muted to-muted/0 lg:mx-4">
        <Hero />
        <Logos />
        <Features />
        <ResourceAllocation />
      </div>
    </>
  );
}
