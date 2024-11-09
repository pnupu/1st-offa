"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Album,
  Building,
  House,
  User,
} from "lucide-react";

const items = [
  {
    title: "Home",
    href: "/dashboard",
    icon: House,
  },
  {
    title: "Browse Companies",
    href: "/dashboard/companies",
    icon: Building,
  },
  {
    title: "Leaderboards",
    href: "/dashboard/leaderboards",
    icon: Album,
  },
  {
    title: "My Profile",
    href: "/dashboard/profile",
    icon: User,
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1 p-4">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            pathname === item.href ? "bg-accent" : "transparent"
          )}
        >
          <item.icon className="mr-2 h-4 w-4" />
          {item.title}
        </Link>
      ))}
    </nav>
  );
} 