import Image from "next/image";
import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

export function Footer() {
  const navigation = [
    { name: "Donate to MWDAO", href: "https://docs.mwdao.xyz/dao/treasury" },
    // { name: "About Us", href: "/about" },
    // { name: "Pricing", href: "/pricing" },
    // { name: "FAQ", href: "/faq" },
    // { name: "Contact", href: "/contact" },
  ];

  const social = [
    { name: "Xwitter", href: "https://x.com/smeshny" },
    { name: "GitHub", href: "https://github.com/smeshny/mwdao.xyz" },
  ];

  const legal = [{ name: "Privacy Policy", href: "/privacy" }];

  const commitSha = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA;
  const shortSha = commitSha?.slice(0, 7);

  return (
    <footer className="flex flex-col items-center gap-14 pt-4">
      <nav className="container flex flex-col items-center gap-4">
        <ul className="flex flex-wrap items-center justify-center gap-6">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="font-medium transition-opacity hover:opacity-75"
              >
                {item.name}
              </Link>
            </li>
          ))}
          {social.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-0.5 font-medium transition-opacity hover:opacity-75"
                title={
                  item.name === "GitHub" && commitSha ? commitSha : undefined
                }
              >
                {item.name}
                {item.name === "GitHub" && shortSha ? (
                  <span className="text-muted-foreground"> ({shortSha})</span>
                ) : null}
                <ArrowUpRight className="size-4" />
              </Link>
            </li>
          ))}
        </ul>
        <ul className="flex flex-wrap items-center justify-center gap-6">
          {legal.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="text-muted-foreground text-sm transition-opacity hover:opacity-75"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="text-primary mt-4 w-full from-current to-transparent px-4 opacity-10 dark:opacity-90">
        <Image
          src="/footer.svg"
          alt="Footer decoration"
          className="fade-out-bottom w-full"
          width={1570}
          height={293}
          priority={false}
        />
      </div>
    </footer>
  );
}
