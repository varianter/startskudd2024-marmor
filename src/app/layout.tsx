import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";

import "./globals.css";
import { cn } from "@/lib/utils";
import PageHeader from "./page-header";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "RDD - Rock Displacement Dashboard",
  description:
    "Rock Displacement Dashboard. A dashboard for monitoring rockslide detection systems.",
  icons: {},
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <div className="flex min-h-screen w-full flex-col">
          <PageHeader />

          {children}

          <footer>
            <hr className="border-slate-300 sm:mx-auto dark:border-gray-700 lg:my-8" />
            <span className="block p-8 text-sm text-gray-500 sm:text-center dark:text-gray-400">
              © 2024{" "}
              <a href="https://rigidbauta.no/" className="hover:underline">
                Rigid Bauta AS
              </a>
              . All Rights Reserved.
            </span>
          </footer>
        </div>
      </body>
    </html>
  );
}
