import { DashedLine } from '@/components/dashed-line';
import { Button } from '@/components/ui/button';

const stats = [
  {
    value: '$150M',
    label: 'Raised',
  },
  {
    value: '20K',
    label: 'Companies',
  },
  {
    value: '1.3B',
    label: 'Monthly transactions',
  },
  {
    value: '1.5K',
    label: 'Connections per minute',
  },
];

export function AboutHero() {
  return (
    <section className="">
      <div className="container flex flex-col justify-between gap-8 md:gap-14 lg:flex-row">
        <div className="flex-1">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            Mainline your product.
          </h1>

          <p className="mt-5 text-2xl text-muted-foreground lg:text-3xl">
            Mainline is the fit-for-purpose tool for planning and building
            modern software products.
          </p>

          <Button size="lg" className="mt-8">
            Get started
          </Button>
        </div>

        <div
          className={`relative flex flex-1 flex-col justify-center gap-3 space-y-5 max-lg:pt-10 lg:ps-10`}
        >
          <DashedLine
            orientation="vertical"
            className="absolute left-0 top-0 max-lg:hidden"
          />
          <DashedLine
            orientation="horizontal"
            className="absolute top-0 lg:hidden"
          />
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <div className="font-sans text-5xl font-medium tracking-wide">
                {stat.value}
              </div>
              <div className="font-medium text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
