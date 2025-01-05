import { DashedLine } from '@/components/dashed-line';
import About from '@/components/sections/about';
import { AboutHero } from '@/components/sections/about-hero';
import { Investors } from '@/components/sections/investors';

export default function AboutPage() {
  return (
    <div className="from-cream relative mx-2.5 mt-2.5 rounded-b-2xl rounded-t-[36px] bg-gradient-to-b via-background to-background lg:mx-4">
      <div className="py-28 lg:py-32 lg:pt-44">
        <AboutHero />

        <About />
        <div className="pt-28 lg:pt-32">
          <DashedLine />
          <Investors />
        </div>
      </div>
    </div>
  );
}
