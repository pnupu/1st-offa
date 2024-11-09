import "@/styles/globals.css";

import { Inter } from "next/font/google";
import localFont from "next/font/local";

import { Providers } from './providers'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const chillax = localFont({
  src: [
    {
      path: '../../public/fonts/Chillax-Variable.woff2',
      style: 'normal',
    },
  ],
  variable: '--font-chillax',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`font-sans ${inter.variable} ${chillax.variable}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
