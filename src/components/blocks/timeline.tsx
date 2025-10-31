import Image from "next/image";
import Link from "next/link";

interface User {
  name: string;
  avatar?: string;
  initials?: string;
  url?: string;
}

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  users?: User[];
  projectUrl?: string;
}

const timelineData: TimelineEvent[] = [
  {
    id: "1",
    date: "October, 2024",
    title: "Berachain faucet",
    description: "Community faucet for Berachain testnet tokens",
    icon: <span>🐻⛓</span>,
    projectUrl:
      "https://docs.mwdao.xyz/web3-side-projects/berachain-faucet-sunsetted",
    users: [
      {
        name: "smeshny",
        avatar:
          "https://pbs.twimg.com/profile_images/1446761872884215808/i3_UWN1L_400x400.jpg",
        url: "https://x.com/smeshny",
      },
    ],
  },
  {
    id: "2",
    date: "March, 2025",
    title: "Bridge for Monad testnet tokens",
    description:
      "Simple exchange for Monad testnet tokens. Over 35K transactions was made.",
    icon: <span>😈</span>,
    projectUrl: "https://bridge.mwdao.xyz/",
    users: [
      {
        name: "smeshny",
        avatar:
          "https://pbs.twimg.com/profile_images/1446761872884215808/i3_UWN1L_400x400.jpg",
        url: "https://x.com/smeshny",
      },
      {
        name: "loowl.eth",
        avatar:
          "https://pbs.twimg.com/profile_images/1647529458193125377/1QI6bT8R_400x400.jpg",
        url: "https://twitter.com/loowl_eth",
      },
    ],
  },
  {
    id: "3",
    date: "April, 2025",
    title: "Bullas gampepass analytics",
    description: "Analytics of Bullas gampepass to find best strategies",
    icon: <span>🐂</span>,
    projectUrl:
      "https://docs.mwdao.xyz/web3-side-projects/bullas-game-analytics",
    users: [
      {
        name: "smeshny",
        avatar:
          "https://pbs.twimg.com/profile_images/1446761872884215808/i3_UWN1L_400x400.jpg",
        url: "https://x.com/smeshny",
      },
    ],
  },
  {
    id: "4",
    date: "October, 2025",
    title: "Lighter accounts monitoring",
    description:
      "Monitoring of Lighter accounts, their positions and money burned",
    icon: <span>🕯️</span>,
    projectUrl: "https://mwdao.xyz/lighter-accounts-watching",
    users: [
      {
        name: "smeshny",
        avatar:
          "https://pbs.twimg.com/profile_images/1446761872884215808/i3_UWN1L_400x400.jpg",
        url: "https://x.com/smeshny",
      },
    ],
  },
];

export const Timeline = () => {
  // Sort events by ID in descending order (higher ID first)
  const sortedEvents = [...timelineData].sort((a, b) => {
    // Convert string IDs to numbers for proper sorting
    const idA = parseInt(a.id);
    const idB = parseInt(b.id);
    return idB - idA; // Descending order (higher ID first)
  });

  // Group sorted events by date
  const groupedEvents = sortedEvents.reduce(
    (acc, event) => {
      if (!acc[event.date]) {
        acc[event.date] = [];
      }
      acc[event.date].push(event);
      return acc;
    },
    {} as Record<string, TimelineEvent[]>,
  );

  // Sort dates by the highest ID in each group (descending)
  const sortedDates = Object.keys(groupedEvents).sort((a, b) => {
    const maxIdA = Math.max(...groupedEvents[a].map((e) => parseInt(e.id)));
    const maxIdB = Math.max(...groupedEvents[b].map((e) => parseInt(e.id)));
    return maxIdB - maxIdA; // Descending order (date with higher ID first)
  });

  return (
    <section id="timeline" className="py-14">
      <div className="container max-w-4xl">
        <h2 className="text-center text-3xl tracking-tight text-balance sm:text-4xl md:text-4xl lg:text-4xl">
          Tools development timeline
        </h2>

        <div className="mx-auto mt-16 max-w-2xl">
          {sortedDates.map((date) => (
            <div key={date} className="relative">
              {/* Date Heading */}
              <div className="mb-4 ps-2 first:mt-0">
                <h3 className="text-muted-foreground text-xs font-medium uppercase">
                  {date}
                </h3>
              </div>

              {/* Timeline Items */}
              <div className="space-y-1">
                {groupedEvents[date].map((event) => (
                  <TimelineItem key={event.id} event={event} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

interface TimelineItemProps {
  event: TimelineEvent;
}

const TimelineItem = ({ event }: TimelineItemProps) => {
  return (
    <div className="group relative flex cursor-pointer gap-x-3 rounded-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/50">
      <div className="absolute inset-0 z-[1]" />

      {/* Timeline connector */}
      <div className="relative after:absolute after:start-3.5 after:top-0 after:bottom-0 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 last:after:hidden dark:after:bg-gray-700">
        <div className="relative z-10 flex size-7 items-center justify-center">
          <div className="size-2 rounded-full border-2 border-gray-300 bg-white transition-colors group-hover:border-gray-600 dark:border-gray-600 dark:bg-gray-950 dark:group-hover:border-gray-400" />
        </div>
      </div>

      {/* Content */}
      <div className="grow p-2 pb-8">
        {event.projectUrl ? (
          <Link
            href={event.projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 inline-flex items-center gap-x-1.5 rounded-lg border border-transparent p-1 font-semibold text-gray-800 transition-all duration-200 hover:bg-white hover:shadow-sm dark:text-gray-200 dark:hover:bg-gray-800"
            title={`Open ${event.title} in new tab`}
          >
            <div className="shrink-0 leading-none text-gray-500 dark:text-gray-400">
              {event.icon}
            </div>
            {event.title}
          </Link>
        ) : (
          <div className="flex items-start gap-x-1.5">
            <div className="mt-1 shrink-0 leading-none text-gray-500 dark:text-gray-400">
              {event.icon}
            </div>
            <h3 className="relative z-10 font-semibold text-gray-800 dark:text-gray-200">
              {event.title}
            </h3>
          </div>
        )}

        {event.description && (
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {event.description}
          </p>
        )}

        {event.users && event.users.length > 0 && (
          <div className="-ms-1 mt-1 flex flex-wrap gap-1">
            {event.users.map((user, userIndex) => (
              <a
                key={userIndex}
                href={user.url || "#"}
                target={user.url ? "_blank" : "_self"}
                rel={user.url ? "noopener noreferrer" : undefined}
                className="relative z-10 inline-flex items-center gap-x-1.5 rounded-lg border border-transparent p-1 text-xs text-gray-500 transition-all duration-200 hover:bg-white hover:shadow-sm dark:text-gray-400 dark:hover:bg-gray-800"
                title={
                  user.url ? `Open ${user.name} profile in new tab` : user.name
                }
              >
                {user.avatar ? (
                  <Image
                    className="size-4 shrink-0 rounded-full"
                    src={user.avatar}
                    alt={user.name}
                    width={16}
                    height={16}
                  />
                ) : (
                  <span className="flex size-4 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-[10px] font-semibold text-gray-600 uppercase dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    {user.initials}
                  </span>
                )}
                {user.name}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
