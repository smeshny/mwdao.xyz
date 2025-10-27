import { Background } from "@/components/background";
import { Hero } from "@/components/blocks/hero";
import { Timeline } from "@/components/blocks/timeline";

export default function Home() {
  return (
    <>
      <Background className="via-muted to-muted/80">
        <Hero />
        <Timeline />
      </Background>
    </>
  );
}
