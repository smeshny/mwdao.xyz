import { Background } from "@/components/background";
import { LighterAccountsWatching } from "@/feautures/lighter-accounts-watching/components/lighter-accounts-watching";

export default function LighterAccountsWatchingPage() {
  return (
    <Background>
      <div className="py-28 lg:py-32 lg:pt-44">
        <LighterAccountsWatching />
      </div>
    </Background>
  );
}
