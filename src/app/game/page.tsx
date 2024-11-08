"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function GamePage() {
  const { data: session } = useSession();

  // Redirect to sign in if not authenticated
  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-8 font-chillax text-3xl font-bold">Game</h1>
      <div className="flex flex-col w-full gap-6">
        {/* Game content will go here */}
      </div>
    </div>
  );
}
