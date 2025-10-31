import {
  ArrowRight,
  Brain,
  ChartNoAxesColumn,
  Github,
  Users,
} from "lucide-react";

import { DashedLine } from "@/components/dashed-line";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "Open-source tools",
    description: "All our tools are open-source and free to use",
    icon: Github,
  },
  {
    title: "Tools for everyone",
    description: "Tools for everyone, from beginners to experts",
    icon: Users,
  },
  {
    title: "AI-powered tools",
    description: "Make better decisions",
    icon: Brain,
  },
  {
    title: "Grow your wealth",
    description: "Grow your wealth with our tools",
    icon: ChartNoAxesColumn,
  },
];

export const Hero = () => {
  return (
    <section className="py-28 lg:py-32 lg:pt-44">
      <div className="container flex flex-col justify-between gap-8 md:gap-14 lg:flex-row lg:gap-20">
        {/* Left side - Main content */}
        <div className="flex-1">
          <h1 className="text-foreground max-w-160 text-3xl tracking-tight md:text-4xl lg:text-5xl xl:whitespace-nowrap">
            MWDAO open-source tools
          </h1>

          <p className="text-muted-foreground text-1xl mt-5 md:text-3xl">
            Tools that can help you make better decisions
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 lg:flex-nowrap">
            <Button
              className="from-primary/90 to-primary/80 hover:from-primary hover:to-primary/90 dark:shadow-primary/20 dark:hover:shadow-primary/30 border-primary/20 dark:border-primary/30 h-auto gap-2 border bg-gradient-to-r shadow-lg transition-all duration-200 hover:shadow-2xl dark:shadow-2xl"
              asChild
            >
              <a
                href="https://docs.mwdao.xyz/dao/treasury"
                target="_blank"
                rel="noopener noreferrer"
              >
                Donate to MWDAO
              </a>
            </Button>
            <Button
              variant="outline"
              className="from-background/80 to-background/60 hover:from-background hover:to-background/80 border-border/50 dark:from-muted/50 dark:to-muted/30 dark:border-muted-foreground/20 h-auto gap-2 bg-gradient-to-r shadow-lg backdrop-blur-sm transition-all duration-200 hover:shadow-2xl dark:bg-gradient-to-br dark:shadow-lg dark:hover:shadow-2xl"
              asChild
            >
              <a
                href="#tools"
                className="max-w-56 truncate text-start md:max-w-none"
              >
                Explore available tools
                <ArrowRight className="stroke-3" />
              </a>
            </Button>
          </div>
        </div>

        {/* Right side - Features */}
        <div className="relative flex flex-1 flex-col justify-center space-y-5 max-lg:pt-10 lg:pl-10">
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
                <Icon className="text-foreground mt-1 size-4 shrink-0 lg:size-5" />
                <div>
                  <h2 className="font-text text-foreground font-semibold">
                    {feature.title}
                  </h2>
                  <p className="text-muted-foreground max-w-76 text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
