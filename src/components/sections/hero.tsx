import Image from 'next/image';
import Link from 'next/link';

import {
  ArrowRight,
  Blend,
  ChartNoAxesColumn,
  CircleDot,
  Diamond,
} from 'lucide-react';

import { DashedLine } from '../dashed-line';
import { Button } from '../ui/button';

const features = [
  {
    title: 'Tailored workflows',
    description: 'Track progress across custom issue flows for your team.',
    icon: CircleDot,
  },
  {
    title: 'Cross-team projects',
    description: 'Collaborate across teams and departments.',
    icon: Blend,
  },
  {
    title: 'Milestones',
    description: 'Break projects down into concrete phases.',
    icon: Diamond,
  },
  {
    title: 'Progress insights',
    description: 'Track scope, velocity, and progress over time.',
    icon: ChartNoAxesColumn,
  },
];

export default function Hero() {
  return (
    <section className="py-28 lg:py-32 lg:pt-44">
      <div className="container flex flex-col justify-between gap-8 md:gap-14 lg:flex-row">
        {/* Left side - Main content */}
        <div className="flex-1">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            Mainline your product.
          </h1>

          <p className="text-muted-foreground mt-5 text-2xl lg:text-3xl">
            Mainline is the fit-for-purpose tool for planning and building
            modern software products.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button>Get started</Button>
            <Link href="#">
              <Button variant="outline" className="h-auto">
                <span className="flex items-center gap-2 text-start whitespace-pre-wrap">
                  Mainline raises $12M from Roba Ventures <ArrowRight />
                </span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Right side - Features */}
        <div className="relative flex flex-1 flex-col justify-center space-y-5 max-lg:pt-10 lg:ps-10">
          <DashedLine
            orientation="vertical"
            className="absolute top-0 left-0 max-lg:hidden"
          />
          <DashedLine
            orientation="horizontal"
            className="absolute top-0 lg:hidden"
          />
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="flex gap-2.5 lg:gap-5">
                <Icon className="mt-1 size-4 shrink-0 lg:size-5" />
                <div>
                  <h2 className="font-semibold">{feature.title}</h2>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-12 max-lg:ml-6 max-lg:h-[550px] max-lg:overflow-hidden md:mt-20 lg:container lg:mt-24">
        <div className="relative h-[793px] w-full">
          <Image
            src="/hero.webp"
            alt="hero"
            fill
            className="rounded-3xl object-cover object-left-top shadow-lg max-lg:rounded-tr-none"
          />
        </div>
      </div>
    </section>
  );
}
