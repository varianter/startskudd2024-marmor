"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import { useSelectedLayoutSegment } from "next/navigation";

export default function Links() {
  const segment = useSelectedLayoutSegment();

  const hrefActive = (linkSegment: string | null) => ({
    href: `/${linkSegment ?? ""}`,
    className: cn({
      "text-foreground": segment === linkSegment,
      "text-muted-foreground": segment !== linkSegment,
      "transition-colors": true,
      "hover:text-foreground": true,
    }),
  });

  return (
    <>
      <Link {...hrefActive(null)}>Home</Link>
      <Link {...hrefActive("dashboard")}>Dashboard</Link>
      <Link {...hrefActive("reports")}>Reports</Link>
    </>
  );
}
