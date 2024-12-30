import Image from 'next/image';
import Link from 'next/link';

import {
  ArrowRight,
  Blend,
  ChartNoAxesColumn,
  CircleDot,
  Diamond,
} from 'lucide-react';

import { Button } from './ui/button';

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
    <section
      className="relative m-2.5 rounded-[36px] py-28 lg:mx-4 lg:py-44"
      style={{
        background:
          'linear-gradient(180deg, #F8F4E7 0%, #F8F8F8 53.5%, rgba(248, 248, 248, 0.00) 100%)',
      }}
    >
      <div className="container flex flex-col items-start justify-between gap-14 lg:flex-row">
        {/* Left side - Main content */}
        <div className="flex-1">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            Mainline your product.
          </h1>

          <p className="mt-5 text-2xl text-muted-foreground lg:text-3xl">
            Mainline is the fit-for-purpose tool for planning and building
            modern software products.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button>Get started</Button>
            <Link href="#">
              <Button variant="outline" className="h-auto">
                <span className="flex items-center gap-2 whitespace-pre-wrap text-start">
                  Mainline raises $12M from Roba Ventures <ArrowRight />
                </span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Right side - Features */}
        <div className="flex-1 space-y-5 border-dashed border-primary/40 max-lg:border-t max-lg:pt-10 lg:border-s lg:ps-10">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="flex flex-col gap-0.5">
                <div className="flex gap-5">
                  <Icon className="mt-1 size-5" />
                  <div>
                    <h2 className="font-semibold">{feature.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="lg:container max-lg:ml-6 max-lg:h-[550px] max-lg:overflow-hidden">
        <div className="relative mt-12 h-[793px] w-full md:mt-20 lg:mt-24">
          <Image
            src="/hero.webp"
            alt="hero"
            fill
            className="rounded-3xl object-cover object-left shadow-lg max-lg:rounded-tr-none"
          />
        </div>
      </div>
    </section>
  );
}
