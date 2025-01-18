import Image from 'next/image';

import { DashedLine } from '../dashed-line';

import { cn } from '@/lib/utils';

const topItems = [
  {
    title: 'Reusable issue templates.',
    description:
      'Draft lightning-fast documents with our Smart Instructions and Templates.',
    images: [
      {
        src: '/resource-allocation/templates.webp',
        alt: 'Issue template interface',
        width: 495,
        height: 186,
      },
    ],
    className: '',
    fade: [''],
  },
  {
    title: 'Simplify your stack.',
    description: 'No more Confluence, SharePoint, or Microsoft Word.',
    images: [
      { src: '/logos/jira.svg', alt: 'Jira logo', width: 48, height: 48 },
      { src: '/logos/excel.svg', alt: 'Excel logo', width: 48, height: 48 },
      {
        src: '/logos/notion.svg',
        alt: 'Notion logo',
        width: 48,
        height: 48,
      },
      { src: '/logos/word.svg', alt: 'Word logo', width: 48, height: 48 },
      {
        src: '/logos/monday.svg',
        alt: 'Monday logo',
        width: 48,
        height: 48,
      },
      {
        src: '/logos/drive.svg',
        alt: 'Google Drive logo',
        width: 48,
        height: 48,
      },
      {
        src: '/logos/jira.svg',
        alt: 'Jira logo',
        width: 48,
        height: 48,
      },
      { src: '/logos/asana.svg', alt: 'Asana logo', width: 48, height: 48 },
    ],
    className: '',
    fade: [],
  },
];

const bottomItems = [
  {
    title: 'Graveyard it.',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do.',
    images: [
      {
        src: '/resource-allocation/graveyard.webp',
        alt: 'Graveyard interface',
        width: 305,
        height: 280,
      },
    ],
    className: '',
    fade: ['bottom'],
  },
  {
    title: 'Task discussions.',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod.',
    images: [
      {
        src: '/resource-allocation/discussions.webp',
        alt: 'Task discussions interface',
        width: 320,
        height: 103,
      },
    ],
    className: 'justify-normal md:[&>.image]:mt-10',
    fade: [''],
  },
  {
    title: 'Notifications.',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod.',
    images: [
      {
        src: '/resource-allocation/notifications.webp',
        alt: 'Notifications interface',
        width: 326,
        height: 280,
      },
    ],
    className: '',
    fade: ['bottom'],
  },
];

export const ResourceAllocation = () => {
  return (
    <section id="resource-allocation" className="pb-28 lg:pb-32">
      <div className="container">
        <h2 className="text-center text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl lg:text-6xl">
          Mainline your resource allocation and execution
        </h2>

        <div className="mt-8 md:mt-12 lg:mt-20">
          <DashedLine orientation="horizontal" />

          {/* Top Features Grid - 2 items */}
          <div className="relative flex max-md:flex-col">
            {topItems.map((item, i) => (
              <Item key={i} item={item} isLast={i === topItems.length - 1} />
            ))}
          </div>
          <DashedLine orientation="horizontal" />

          {/* Bottom Features Grid - 3 items */}
          <div className="relative grid md:grid-cols-3">
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
        <DashedLine orientation="horizontal" />
      </div>
    </section>
  );
};

interface ItemProps {
  item: (typeof topItems)[number] | (typeof bottomItems)[number];
  isLast?: boolean;
  className?: string;
}

const Item = ({ item, isLast, className }: ItemProps) => {
  return (
    <div
      className={cn(
        'relative flex flex-col justify-between px-0 py-6 md:p-8',
        className,
        item.className,
      )}
    >
      <div className="mb-5 md:mb-8">
        <h3 className="inline font-semibold">{item.title} </h3>
        <span className="text-muted-foreground font-medium">
          {' '}
          {item.description}
        </span>
      </div>

      {item.fade.includes('bottom') && (
        <div className="from-background absolute inset-0 z-10 bg-linear-to-t via-transparent to-transparent md:hidden" />
      )}
      {item.images.length > 4 ? (
        <div className="relative overflow-hidden">
          <div className="from-background/80 to-background/20 absolute inset-y-0 left-0 z-10 w-[100px] bg-linear-to-r" />
          <div className="from-background/80 to-background/20 absolute inset-y-0 right-0 z-10 w-[100px] bg-linear-to-l" />
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
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="image grid grid-cols-1 gap-4">
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
  );
};
