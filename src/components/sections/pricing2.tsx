'use client';

import { Check } from 'lucide-react';

import { Button } from '../ui/button';

interface FeatureSection {
  category: string;
  features: {
    name: string;
    free: string | boolean;
    startup: string | boolean;
    enterprise: string | boolean;
  }[];
}

const pricingPlans = [
  {
    name: 'Free',
    button: {
      text: 'Get started',
      variant: 'outline' as const,
    },
  },
  {
    name: 'Startup',
    button: {
      text: 'Get started',
      variant: 'outline' as const,
    },
  },
  {
    name: 'Enterprise',
    button: {
      text: 'Get a demo',
      variant: 'outline' as const,
    },
  },
];

const comparisonFeatures: FeatureSection[] = [
  {
    category: 'Usage',
    features: [
      {
        name: 'Members',
        free: 'Unlimited',
        startup: 'Unlimited',
        enterprise: 'Unlimited',
      },
      {
        name: 'Transactions',
        free: '250',
        startup: 'Unlimited',
        enterprise: 'Unlimited',
      },
      {
        name: 'Teams',
        free: '2',
        startup: 'Unlimited',
        enterprise: 'Unlimited',
      },
    ],
  },
  {
    category: 'Features',
    features: [
      {
        name: 'Reporting',
        free: true,
        startup: true,
        enterprise: true,
      },
      {
        name: 'Analytics',
        free: true,
        startup: true,
        enterprise: true,
      },
      {
        name: 'Import and export',
        free: true,
        startup: true,
        enterprise: true,
      },
      {
        name: 'Integrations',
        free: true,
        startup: true,
        enterprise: true,
      },
      {
        name: 'Mainline AI',
        free: false,
        startup: true,
        enterprise: true,
      },
      {
        name: 'Admin roles',
        free: false,
        startup: false,
        enterprise: false,
      },
      {
        name: 'Audit log',
        free: false,
        startup: false,
        enterprise: false,
      },
    ],
  },
  {
    category: 'Support',
    features: [
      {
        name: 'Priority Support',
        free: true,
        startup: true,
        enterprise: true,
      },
      {
        name: 'Account Manager',
        free: false,
        startup: false,
        enterprise: true,
      },
      {
        name: 'Uptime SLA',
        free: false,
        startup: false,
        enterprise: true,
      },
    ],
  },
];

const Pricing2 = () => {
  return (
    <section className="pb-28 lg:py-32">
      <div className="container">
        <PlanHeaders />
        <FeatureSections />
      </div>
    </section>
  );
};

const PlanHeaders = () => (
  <div className="grid grid-cols-4">
    <div className="col-span-1 max-md:hidden"></div>
    <div className="col-span-4 grid gap-4 md:col-span-3 md:grid-cols-3">
      {pricingPlans.map((plan, index) => (
        <div
          key={index}
          className="flex items-center justify-between border-b py-4 md:block md:border-none"
        >
          <h3 className="text-2xl font-semibold md:mb-3">{plan.name}</h3>
          <Button variant={plan.button.variant} className="w-fit">
            {plan.button.text}
          </Button>
        </div>
      ))}
    </div>
  </div>
);

const FeatureSections = () => (
  <>
    {comparisonFeatures.map((section, sectionIndex) => (
      <div key={sectionIndex} className="">
        <div className="border-b border-primary/40 py-4">
          <h3 className="text-lg font-semibold">{section.category}</h3>
        </div>
        {section.features.map((feature, featureIndex) => (
          <div
            key={featureIndex}
            className="grid font-medium text-primary max-md:grid-rows-[auto_1fr] md:grid-cols-4"
          >
            <span className="inline-flex items-center py-4">
              {feature.name}
            </span>
            <div className="col-span-3 grid grid-cols-3 gap-4">
              {[feature.free, feature.startup, feature.enterprise].map(
                (value, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1 border-b py-4"
                  >
                    {typeof value === 'boolean' ? (
                      value ? (
                        <Check className="size-5" />
                      ) : null
                    ) : (
                      <div className="flex items-center gap-1">
                        <Check className="size-4" />
                        <span className="">{value}</span>
                      </div>
                    )}
                  </div>
                ),
              )}
            </div>
          </div>
        ))}
      </div>
    ))}
  </>
);

export default Pricing2;
