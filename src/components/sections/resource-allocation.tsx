import Image from 'next/image';

import { DashedLine } from '../dashed-line';

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
  },
  {
    title: 'Simplify your stack.',
    description: 'No more Confluence, SharePoint, or Microsoft Word.',
    images: [
      { src: '/logos/jira.svg', alt: 'Jira logo', width: 65, height: 65 },
      { src: '/logos/excel.svg', alt: 'Excel logo', width: 65, height: 65 },
      {
        src: '/logos/notion.svg',
        alt: 'Notion logo',
        width: 65,
        height: 65,
      },
      { src: '/logos/word.svg', alt: 'Word logo', width: 65, height: 65 },
      {
        src: '/logos/google-docs.svg',
        alt: 'Google Docs logo',
        width: 65,
        height: 65,
      },
      {
        src: '/logos/drive.svg',
        alt: 'Google Drive logo',
        width: 65,
        height: 65,
      },
      {
        src: '/logos/azure.svg',
        alt: 'Azure DevOps logo',
        width: 65,
        height: 65,
      },
      { src: '/logos/asana.svg', alt: 'Asana logo', width: 65, height: 65 },
    ],
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
  },
];

export const ResourceAllocation = () => {
  return (
    <section className="pb-28 lg:pb-32">
      <div className="container">
        <h2 className="text-balance text-center text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
          Mainline your resource allocation and execution
        </h2>

        <div className="mt-8 md:mt-12 lg:mt-20">
          <DashedLine orientation="horizontal" />

          {/* Top Features Grid - 2 items */}
          <div className="relative grid md:grid-cols-2">
            {topItems.map((item, i) => (
              <div key={i} className="relative p-8 md:p-10">
                <div className="mb-5 md:mb-8">
                  <h3 className="inline font-semibold">{item.title} </h3>
                  <span className="font-medium text-muted-foreground">
                    {' '}
                    {item.description}
                  </span>
                </div>

                <div
                  className={`mt-5 grid gap-4 md:mt-8 ${
                    item.images.length > 4
                      ? 'grid-cols-2 sm:grid-cols-4'
                      : 'grid-cols-1'
                  }`}
                >
                  {item.images.map((image, j) => (
                    <Image
                      key={j}
                      src={image.src}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      className="object-contain"
                    />
                  ))}
                </div>

                {i == 0 && (
                  <DashedLine
                    orientation="vertical"
                    className="absolute right-0 top-0 max-md:hidden"
                  />
                )}
                {i == 0 && (
                  <DashedLine
                    orientation="horizontal"
                    className="absolute inset-x-0 bottom-0 md:hidden"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Horizontal dashed line between top and bottom sections */}
          <DashedLine orientation="horizontal" />

          {/* Bottom Features Grid - 3 items */}
          <div className="relative grid md:grid-cols-3">
            {bottomItems.map((item, i) => (
              <div key={i} className="relative p-8 md:p-10">
                <div className="mb-5 md:mb-8">
                  <h3 className="inline font-semibold">{item.title} </h3>
                  <span className="font-medium text-muted-foreground">
                    {' '}
                    {item.description}
                  </span>
                </div>

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

                {i !== 2 && (
                  <DashedLine
                    orientation="vertical"
                    className="absolute right-0 top-0 max-md:hidden"
                  />
                )}
                {i !== 2 && (
                  <DashedLine
                    orientation="horizontal"
                    className="absolute inset-x-0 bottom-0 md:hidden"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
