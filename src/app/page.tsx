import { Background } from "@/components/background";
import { Hero } from "@/components/blocks/hero";
import { ResourceAllocation } from "@/components/blocks/resource-allocation";

export default function Home() {
  return (
    <>
      <Background className="via-muted to-muted/80">
        <Hero />
        <ResourceAllocation />
      </Background>
    </>
  );
}
