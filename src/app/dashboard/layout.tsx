"use client";

import { DashboardNav } from "@/components/dashboard/nav";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <aside className="hidden w-1/5 border-r bg-background lg:block">
          <div className="h-[88px] px-6 pt-6">
            <Image
              src="/logo.svg"
              alt="OFFA Logo"
              width={60}
              height={60}
              className="mb-6"
            />
          </div>
            <Separator className="mb-6" />
          <DashboardNav />
        </aside>
        <main className="flex-1">
          <div className="flex h-[88px] items-center justify-between px-8">
            <h1 className="font-chillax text-2xl font-semibold">Welcome to the <span className="text-[#2A4060]">OFFA</span></h1>
            {/* Play button */}
            <Button variant="outline" size="sm" className="text-xs" onClick={() => router.push('/game')}>Play</Button>
          </div>
            <Separator />
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 