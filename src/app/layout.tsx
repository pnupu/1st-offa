// app/layout.tsx
import "@/styles/globals.css";
import { type Metadata } from "next";
import localFont from "next/font/local";
import { Providers } from './providers'

export const metadata: Metadata = {
  title: "Company Culture Match",
  description: "Find your perfect company culture match through our personality assessment game",
};

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
      <body suppressHydrationWarning className={`font-chillax ${chillax.variable}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}