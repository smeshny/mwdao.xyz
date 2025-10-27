import Image from "next/image";

interface User {
  name: string;
  avatar?: string;
  initials?: string;
}

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  users?: User[];
}

const timelineData: TimelineEvent[] = [
  {
    id: "1",
    date: "15 October, 2024",
    title: "Berachain faucet",
    description: "Community faucet for Berachain testnet tokens",
    icon: <span>🐻⛓</span>,
    users: [
      {
        name: "smeshny",
        avatar: "https://avatars.githubusercontent.com/u/14953852?v=4&size=64",
      },
    ],
  },
  {
    id: "2",
    date: "10 March, 2025",
    title: "Bridge for Monad testnet tokens",
    description: "Simple exchange for Monad testnet tokens",
    icon: <span>😈</span>,
    users: [
      {
        name: "smeshny",
        avatar: "https://avatars.githubusercontent.com/u/14953852?v=4&size=64",
      },
      {
        name: "loowl.eth",
        avatar:
          "https://pbs.twimg.com/profile_images/1647529458193125377/1QI6bT8R_400x400.jpg",
      },
    ],
  },
  {
    id: "3",
    date: "5 October, 2024",
    title: "Security audit passed ✅",
    description: "All security checks completed successfully",
    icon: <span>🛡️</span>,
    users: [
      {
        name: "security_team",
        initials: "ST",
      },
      {
        name: "auditor",
        initials: "AU",
      },
    ],
  },
  {
    id: "4",
    date: "1 October, 2024",
    title: "Mainnet deployment",
    description: "Smart contracts deployed to Berachain mainnet",
    icon: <span>🌐</span>,
    users: [
      {
        name: "deploy_bot",
        initials: "DB",
      },
      {
        name: "ops_team",
        initials: "OT",
      },
    ],
  },
  {
    id: "5",
    date: "25 September, 2024",
    title: "Project kickoff 🎉",
    description: "Started building the future of DeFi",
    icon: <span className="text-xl">🚀</span>,
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
          {sortedDates.map((date, dateIndex) => (
            <div key={date} className="relative">
              {/* Date Heading */}
              <div className="mb-4 ps-2 first:mt-0">
                <h3 className="text-muted-foreground text-xs font-medium uppercase">
                  {date}
                </h3>
              </div>

              {/* Timeline Items */}
              <div className="space-y-1">
                {groupedEvents[date].map((event, index) => (
                  <TimelineItem
                    key={event.id}
                    event={event}
                    isLast={
                      dateIndex === sortedDates.length - 1 &&
                      index === groupedEvents[date].length - 1
                    }
                  />
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
  isLast?: boolean;
}

const TimelineItem = ({ event, isLast }: TimelineItemProps) => {
  return (
    <div className="group relative flex gap-x-3 rounded-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/50">
      <a className="absolute inset-0 z-[1]" href="#" />

      {/* Timeline connector */}
      <div className="relative after:absolute after:start-3.5 after:top-0 after:bottom-0 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 last:after:hidden dark:after:bg-gray-700">
        <div className="relative z-10 flex size-7 items-center justify-center">
          <div className="size-2 rounded-full border-2 border-gray-300 bg-white transition-colors group-hover:border-gray-600 dark:border-gray-600 dark:bg-gray-950 dark:group-hover:border-gray-400" />
        </div>
      </div>

      {/* Content */}
      <div className="grow p-2 pb-8">
        <div className="flex items-start gap-x-1.5">
          <div className="mt-1 shrink-0 leading-none text-gray-500 dark:text-gray-400">
            {event.icon}
          </div>
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">
            {event.title}
          </h3>
        </div>

        {event.description && (
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {event.description}
          </p>
        )}

        {event.users && event.users.length > 0 && (
          <div className="-ms-1 mt-1 flex flex-wrap gap-1">
            {event.users.map((user, userIndex) => (
              <button
                key={userIndex}
                type="button"
                className="relative z-10 inline-flex items-center gap-x-1.5 rounded-lg border border-transparent p-1 text-xs text-gray-500 transition-colors hover:bg-white hover:shadow-sm disabled:pointer-events-none disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-800"
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
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
