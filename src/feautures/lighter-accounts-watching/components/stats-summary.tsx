"use client";

type StatsSummaryProps = {
  addresses: string[];
  totalCollateral?: number;
  totalPositions?: number;
};

export function StatsSummary({
  addresses,
  totalCollateral = 0,
  totalPositions = 0,
}: StatsSummaryProps) {
  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="rounded-lg border border-gray-700 bg-gray-900 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Watched Accounts</p>
            <p className="text-2xl font-bold text-white">{addresses.length}</p>
          </div>
          <div className="rounded-lg bg-blue-600/20 p-3">
            <svg
              className="h-6 w-6 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>User Icon</title>
              <path
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-700 bg-gray-900 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Total Collateral</p>
            <p className="text-2xl font-bold text-green-400">
              ${totalCollateral.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg bg-green-600/20 p-3">
            <svg
              className="h-6 w-6 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>Dollar Icon</title>
              <path
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-700 bg-gray-900 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Active Positions</p>
            <p className="text-2xl font-bold text-blue-400">{totalPositions}</p>
          </div>
          <div className="rounded-lg bg-purple-600/20 p-3">
            <svg
              className="h-6 w-6 text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>Chart Icon</title>
              <path
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
