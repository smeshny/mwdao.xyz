import type { Metadata } from "next";

import { Background } from "@/components/background";
import { LighterAccountsWatching } from "@/feautures/lighter-accounts-monitoring/components/lighter-accounts-watching";
import { buildMetadata } from "@/lib/seo/metadata";

export default function LighterAccountsWatchingPage() {
  return (
    <Background>
      <div className="py-28 lg:py-32 lg:pt-44">
        <LighterAccountsWatching />
      </div>
    </Background>
  );
}

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Lighter Accounts Monitoring",
    description: "Monitor Lighter accounts activity and status in real time.",
    path: "/tools/lighter-accounts-monitoring",
    images: ["/og-images/lighter-accounts-monitoring.png"],
    keywords: [
      "MWDAO",
      "Lighter.xyz",
      "ZK Lighter",
      "accounts monitoring",
      "wallet groups",
      "positions",
      "PnL",
      "crypto",
      "web3 tools",
    ],
  });
}
