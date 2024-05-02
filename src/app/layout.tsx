import { ReactNode } from "react";

import type { Metadata } from "next";
import { Lato } from "next/font/google";

import "../styles/globals.css";

const lato = Lato({ subsets: ["latin"], weight: ["400", "700", "900"] });

export const metadata: Metadata = {
  title: "World News",
  icons: {
    icon: {
      url: "/images/news.jpg",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={lato.className}>{children}</body>
    </html>
  );
}
