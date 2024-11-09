// src/app/page.tsx
import Link from "next/link";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  
  // Redirect to game if already signed in
  if (session?.user) {
    redirect("/game");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Company <span className="text-[hsl(280,100%,70%)]">Culture</span> Match
        </h1>
        
        <p className="text-center text-2xl">
          Discover your perfect company match through our innovative personality assessment game
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
            href="/auth/signin"
          >
            <h3 className="text-2xl font-bold">Get Started →</h3>
            <div className="text-lg">
              Take our personality assessment and find your ideal company culture match.
            </div>
          </Link>
          
          <div className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4">
            <h3 className="text-2xl font-bold">For Companies</h3>
            <div className="text-lg">
              Looking to find the perfect cultural fit? Contact us to learn more about our company solutions.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}