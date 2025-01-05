import About from '@/components/sections/about';
import { AboutHero } from '@/components/sections/about-hero';

export default function AboutPage() {
  return (
    <div className="relative mx-2.5 mt-2.5 rounded-b-2xl rounded-t-[36px] bg-gradient-to-b from-[#F8F4E7] via-background to-background lg:mx-4">
      <div className="py-28 lg:py-32 lg:pt-44">
        <AboutHero />

        <About />
      </div>
    </div>
  );
}
