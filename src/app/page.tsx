// src/app/page.tsx
import Link from "next/link";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function Home() {
  const session = await auth();
  
  // Redirect to game if already signed in
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center] text-[#42669B]" style={{backgroundImage: "url(/assets/lander/Background.svg)", backgroundSize: "cover"}}>
      <Link href="/">
      <Image src="/assets/lander/Logo.svg" style={{ position: "fixed", top: 20, left: 20 }} width={100} height={100} alt="Company Culture Match Logo" />
      </Link>
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 z-[20]">
        <Image src="/assets/lander/Logo.svg" width={300} height={300} alt="Company Culture Match Logo" />
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem] text-[#42669B]">
          Company <span className="text-[#2A4060]">Culture</span> Match
        </h1>
        <p className="text-center text-2xl">
          Discover your perfect company match through our innovative personality assessment game
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-[#42669B60] p-4 hover:bg-[#42669baa]"
            href="/auth/signin"
          >
            <h3 className="text-2xl font-bold">For Job Seekers</h3>
            <div className="text-lg">
              Take our personality assessment and find your ideal company culture match.
            </div>
          </Link>
          

          <Link className="flex max-w-xs flex-col gap-4 rounded-xl bg-[#42669B60] p-4 hover:bg-[#42669baa]" href="/contact">
            <h3 className="text-2xl font-bold">For Companies</h3>
            <div className="text-lg">
              Looking to find the perfect cultural fit? Contact us to learn more about our company solutions.
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}