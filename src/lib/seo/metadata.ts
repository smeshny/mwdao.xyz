import type { Metadata, Viewport } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const siteMeta = {
  name: "Mainline",
  url: siteUrl,
  titleDefault: "Mainline - Modern Next.js Template",
  titleTemplate: "%s | Mainline",
  description:
    "A modern Next.js template built with shadcn/ui, Tailwind & MDX. Open source - MIT License.",
  keywords: [
    "Next.js",
    "nextjs template",
    "nextjs theme",
    "nextjs starter",
    "shadcn template",
    "shadcn theme",
    "shadcn starter",
    "tailwind template",
    "tailwind theme",
    "tailwind starter",
    "mdx template",
    "mdx theme",
    "mdx starter",
  ],
  author: "shadcnblocks.com",
  twitter: "@ausrobdev",
  ogImage: "/og-image.jpg",
};

export function absoluteUrl(path: string = "/"): string {
  try {
    return new URL(path, siteMeta.url).toString();
  } catch {
    return `${siteMeta.url.replace(/\/$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;
  }
}

export const baseMetadata: Metadata = {
  metadataBase: new URL(siteMeta.url),
  title: {
    default: siteMeta.titleDefault,
    template: siteMeta.titleTemplate,
  },
  description: siteMeta.description,
  keywords: siteMeta.keywords,
  authors: [{ name: siteMeta.author }],
  creator: siteMeta.author,
  publisher: siteMeta.author,
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "48x48" },
      {
        url: "/favicon/android-chrome-192x192.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        url: "/favicon/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      { url: "/favicon/favicon.ico" },
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: [{ url: "/favicon/favicon.ico" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: siteMeta.titleDefault,
    description: siteMeta.description,
    siteName: siteMeta.name,
    images: [
      {
        url: siteMeta.ogImage,
        width: 1200,
        height: 630,
        alt: siteMeta.titleDefault,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteMeta.titleDefault,
    description: siteMeta.description,
    images: [siteMeta.ogImage],
    creator: siteMeta.twitter,
  },
  alternates: {
    canonical: absoluteUrl("/"),
  },
};

export const defaultViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

type BuildMetaInput = {
  title?: string;
  description?: string;
  path?: string; // e.g. "/tools/lighter-accounts-monitoring"
  images?: string[]; // absolute or relative
  keywords?: string[];
  noindex?: boolean;
};

export function buildMetadata(input: BuildMetaInput = {}): Metadata {
  const title = input.title ?? siteMeta.titleDefault;
  const description = input.description ?? siteMeta.description;
  const canonical = absoluteUrl(input.path ?? "/");
  const images = (
    input.images && input.images.length > 0 ? input.images : [siteMeta.ogImage]
  ).map((img) => (img.startsWith("http") ? img : absoluteUrl(img)));

  return {
    title,
    description,
    keywords: input.keywords ?? siteMeta.keywords,
    alternates: { canonical },
    robots: input.noindex
      ? { index: false, follow: false }
      : baseMetadata.robots,
    openGraph: {
      ...baseMetadata.openGraph,
      title,
      description,
      url: canonical,
      images,
    },
    twitter: {
      ...baseMetadata.twitter,
      title,
      description,
      images,
    },
  } satisfies Metadata;
}
