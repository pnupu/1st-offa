'use client'

import { ThemeProvider } from 'next-themes'
import { type ReactNode } from 'react'
import { TRPCReactProvider } from "@/trpc/react";
import { SessionProvider } from "next-auth/react";


export function Providers({ children }: { children: ReactNode }) {


  return (
    <TRPCReactProvider>
        <SessionProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
        </SessionProvider>
    </TRPCReactProvider>
       
  )
} 