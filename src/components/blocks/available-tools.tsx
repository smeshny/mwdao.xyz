import Image from "next/image";
import Link from "next/link";

import { DashedLine } from "../dashed-line";

import { cn } from "@/lib/utils";

interface ToolItem {
  title: string;
  description: string;
  images: Array<{
    src: string;
    alt: string;
    width: number;
    height: number;
  }>;
  className: string;
  fade: string[];
  href?: string;
  isComingSoon?: boolean;
}

const topItems: ToolItem[] = [
  {
    title: "Lighter Accounts Watching",
    description:
      "Monitor and track your Lighter accounts with real-time updates and comprehensive analytics.",
    images: [
      {
        src: "/logos/lighter.svg",
        alt: "Lighter Accounts Watching interface",
        width: 305,
        height: 280,
      },
    ],
    className:
      "flex-1 [&>.title-container]:mb-5 md:[&>.title-container]:mb-8 xl:[&>.image-container]:translate-x-6 [&>.image-container]:translate-x-2",
    fade: [""],
    href: "/lighter-accounts-watching",
  },
  {
    title: "Funding Arbitrage Lighter Pacifica",
    description:
      "Advanced arbitrage opportunities detection and funding rate optimization across multiple exchanges.",
    images: [
      {
        src: "/logos/pacifica.svg",
        alt: "Funding Arbitrage interface",
        width: 305,
        height: 280,
      },
    ],
    className:
      "flex-1 [&>.title-container]:mb-5 md:[&>.title-container]:mb-8 xl:[&>.image-container]:translate-x-6 [&>.image-container]:translate-x-2",
    fade: [""],
    href: "/funding-arbitrage-lighter-pacifica",
  },
];

const bottomItems: ToolItem[] = [
  {
    title: "Advanced Portfolio Analytics",
    description:
      "Coming Soon - Comprehensive portfolio analysis with advanced risk metrics and performance tracking.",
    images: [
      {
        src: "/logos/analytics.svg",
        alt: "Portfolio Analytics interface",
        width: 305,
        height: 280,
      },
    ],
    className:
      "[&>.title-container]:mb-5 md:[&>.title-container]:mb-8 xl:[&>.image-container]:translate-x-6 [&>.image-container]:translate-x-2",
    fade: ["bottom"],
    isComingSoon: true,
  },
  {
    title: "Automated Trading Bot",
    description:
      "Coming Soon - AI-powered trading automation with customizable strategies and risk management.",
    images: [
      {
        src: "/logos/trading-bot.svg",
        alt: "Trading Bot interface",
        width: 320,
        height: 103,
      },
    ],
    className:
      "justify-normal [&>.title-container]:mb-5 md:[&>.title-container]:mb-0 [&>.image-container]:flex-1 md:[&>.image-container]:place-items-center md:[&>.image-container]:-translate-y-3",
    fade: [""],
    isComingSoon: true,
  },
  {
    title: "Cross-Chain Bridge",
    description:
      "Coming Soon - Seamless cross-chain asset transfers with optimal routing and minimal fees.",
    images: [
      {
        src: "/logos/bridge.svg",
        alt: "Cross-Chain Bridge interface",
        width: 305,
        height: 280,
      },
    ],
    className:
      "[&>.title-container]:mb-5 md:[&>.title-container]:mb-8 xl:[&>.image-container]:translate-x-6 [&>.image-container]:translate-x-2",
    fade: ["bottom"],
    isComingSoon: true,
  },
];

export const AvailableTools = () => {
  return (
    <section
      id="resource-allocation"
      className="overflow-hidden pb-28 lg:pb-32"
    >
      <div className="">
        <h2 className="container text-center text-3xl tracking-tight text-balance sm:text-4xl md:text-4xl lg:text-4xl">
          Available tools
        </h2>

        <div className="mt-8 md:mt-12 lg:mt-20">
          <DashedLine
            orientation="horizontal"
            className="container scale-x-105"
          />

          {/* Top Features Grid - 2 items */}
          <div className="relative container flex max-md:flex-col">
            {topItems.map((item, i) => (
              <Item key={i} item={item} isLast={i === topItems.length - 1} />
            ))}
          </div>
          <DashedLine
            orientation="horizontal"
            className="container max-w-7xl scale-x-110"
          />

          {/* Bottom Features Grid - 3 items */}
          <div className="relative container grid max-w-7xl md:grid-cols-3">
            {bottomItems.map((item, i) => (
              <Item
                key={i}
                item={item}
                isLast={i === bottomItems.length - 1}
                className="md:pb-0"
              />
            ))}
          </div>
        </div>
        <DashedLine
          orientation="horizontal"
          className="container max-w-7xl scale-x-110"
        />
      </div>
    </section>
  );
};

interface ItemProps {
  item: ToolItem;
  isLast?: boolean;
  className?: string;
}

const Item = ({ item, isLast, className }: ItemProps) => {
  const ItemWrapper = ({ children }: { children: React.ReactNode }) => {
    if (item.href && !item.isComingSoon) {
      return (
        <Link
          href={item.href}
          className="block transition-opacity hover:opacity-90"
        >
          {children}
        </Link>
      );
    }
    return <div>{children}</div>;
  };

  return (
    <ItemWrapper>
      <div
        className={cn(
          "relative flex flex-col justify-between px-0 py-6 md:px-6 md:py-8",
          className,
          item.className,
          item.isComingSoon && "opacity-75",
        )}
      >
        <div className="title-container text-balance">
          <div className="mb-2 flex items-center gap-2">
            <h3 className="inline font-semibold">{item.title}</h3>
            {item.isComingSoon && (
              <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                Coming Soon
              </span>
            )}
          </div>
          <span className="text-muted-foreground"> {item.description}</span>
        </div>

        {item.fade.includes("bottom") && (
          <div className="from-muted/80 absolute inset-0 z-10 bg-linear-to-t via-transparent to-transparent md:hidden" />
        )}
        {item.images.length > 4 ? (
          <div className="relative overflow-hidden">
            <div className="flex flex-col gap-5">
              {/* First row - right aligned */}
              <div className="flex translate-x-4 justify-end gap-5">
                {item.images.slice(0, 4).map((image, j) => (
                  <div
                    key={j}
                    className="bg-background grid aspect-square size-16 place-items-center rounded-2xl p-2 lg:size-20"
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      className="object-contain object-left-top"
                    />
                    <div className="from-muted/80 absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l to-transparent" />
                  </div>
                ))}
              </div>
              {/* Second row - left aligned */}
              <div className="flex -translate-x-4 gap-5">
                {item.images.slice(4).map((image, j) => (
                  <div
                    key={j}
                    className="bg-background grid aspect-square size-16 place-items-center rounded-2xl lg:size-20"
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      className="object-contain object-left-top"
                    />
                    <div className="from-muted absolute inset-y-0 bottom-0 left-0 z-10 w-14 bg-linear-to-r to-transparent" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="image-container grid grid-cols-1 gap-4">
            {item.images.map((image, j) => (
              <Image
                key={j}
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                className="object-contain object-left-top"
              />
            ))}
          </div>
        )}

        {!isLast && (
          <>
            <DashedLine
              orientation="vertical"
              className="absolute top-0 right-0 max-md:hidden"
            />
            <DashedLine
              orientation="horizontal"
              className="absolute inset-x-0 bottom-0 md:hidden"
            />
          </>
        )}
      </div>
    </ItemWrapper>
  );
};
