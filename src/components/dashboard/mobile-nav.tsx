"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState } from "react";
import { DashboardNav } from "./nav";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="mr-2 px-0 hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[80%]">
        <div className="px-2 py-6">
          <Image
            src="/logo.svg"
            alt="OFFA Logo"
            width={100}
            height={32}
            className="mb-6"
          />
          <Separator className="mb-6" />
        </div>
        <DashboardNav/>
      </SheetContent>
    </Sheet>
  );
} 