import CreamContainer from '@/components/layout/cream-container';
import { DashedLine } from '@/components/dashed-line';
import About from '@/components/sections/about';
import { AboutHero } from '@/components/sections/about-hero';
import { Investors } from '@/components/sections/investors';

export default function AboutPage() {
  return (
    <CreamContainer>
      <div className="py-28 lg:py-32 lg:pt-44">
        <AboutHero />

        <About />
        <div className="pt-28 lg:pt-32">
          <DashedLine />
          <Investors />
        </div>
      </div>
    </CreamContainer>
  );
}
