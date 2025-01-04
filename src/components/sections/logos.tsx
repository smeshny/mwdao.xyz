import Image from 'next/image';

const Logos = () => {
  const topRowCompanies = [
    { name: 'Mercury', logo: '/logos/mercury.svg', width: 143, height: 26 },
    { name: 'Watershed', logo: '/logos/watershed.svg', width: 154, height: 31 },
    { name: 'Retool', logo: '/logos/retool.svg', width: 113, height: 22 },
    { name: 'Descript', logo: '/logos/descript.svg', width: 112, height: 27 },
  ];

  const bottomRowCompanies = [
    {
      name: 'Perplexity',
      logo: '/logos/perplexity.svg',
      width: 141,
      height: 32,
    },
    { name: 'Monzo', logo: '/logos/monzo.svg', width: 104, height: 18 },
    { name: 'Ramp', logo: '/logos/ramp.svg', width: 105, height: 28 },
    { name: 'Raycast', logo: '/logos/raycast.svg', width: 128, height: 33 },
    { name: 'Arc', logo: '/logos/arc.svg', width: 90, height: 28 },
  ];

  return (
    <section className="mx-2.5 pb-28 lg:mx-4 lg:pb-32">
      <div className="container space-y-10 lg:space-y-16">
        <div className="text-center">
          <h2 className="mb-4 text-balance text-xl font-bold md:text-2xl lg:text-3xl">
            Powering the world's best product teams.
            <br className="max-md:hidden" />
            <span className="text-muted-foreground">
              From next-gen startups to established enterprises.
            </span>
          </h2>
        </div>

        <div className="flex w-full flex-col items-center gap-8">
          {/* Top row - 4 logos */}
          <div className="grid grid-cols-2 items-center justify-items-center gap-x-12 gap-y-8 max-md:w-full sm:grid-cols-4 md:gap-x-20 lg:gap-x-28">
            {topRowCompanies.map((company, index) => (
              <Image
                key={index}
                src={company.logo}
                alt={`${company.name} logo`}
                width={company.width}
                height={company.height}
                className="object-contain"
              />
            ))}
          </div>

          {/* Bottom row - 5 logos */}
          <div className="grid grid-cols-2 items-center justify-items-center gap-x-12 gap-y-8 max-md:w-full sm:grid-cols-5 md:gap-x-20 lg:gap-x-28">
            {bottomRowCompanies.map((company, index) => (
              <Image
                key={index}
                src={company.logo}
                alt={`${company.name} logo`}
                width={company.width}
                height={company.height}
                className="object-contain"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Logos;
