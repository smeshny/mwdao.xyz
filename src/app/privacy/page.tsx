import type { Metadata } from "next";

import PrivacyArticle from "./PrivacyArticle";

import { Background } from "@/components/background";
import { buildMetadata } from "@/lib/seo/metadata";

export default function Page() {
  return (
    <Background className="via-muted to-muted/80">
      <section className="mx-auto max-w-2xl px-4 py-28 lg:pt-44 lg:pb-32">
        <PrivacyArticle />
      </section>
    </Background>
  );
}

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Privacy Policy",
    description:
      "Privacy Policy for MimbleWimbleDAO (MWDAO.xyz): how we collect, use, and protect your data.",
    path: "/privacy",
  });
}
