import Background from '@/components/layout/background';
import { FAQ } from '@/components/sections/faq';
import { Features } from '@/components/sections/features';
import Hero from '@/components/sections/hero';
import Logos from '@/components/sections/logos';
import { Pricing } from '@/components/sections/pricing';
import { ResourceAllocation } from '@/components/sections/resource-allocation';
import { Testimonials } from '@/components/sections/testimonials';

export default function Home() {
  return (
    <>
      <Background className="via-muted to-muted/80">
        <Hero />
        <Logos />
        <Features />
        <ResourceAllocation />
      </Background>
      <Testimonials />
      <Background variant="bottom">
        <Pricing />
        <FAQ />
      </Background>
    </>
  );
}
