"use client";

import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function SignInPage() {
  const { data: session } = useSession();
  const [error, setError] = useState<string | null>(null);
  
  // Redirect to dashboard if already signed in
  if (session?.user) {
    redirect("/dashboard");
  }

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      await signIn("google", { 
        callbackUrl: "/dashboard"
      });
    } catch (err) {
      console.error("Sign in error:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-[#42669B]" style={{backgroundImage: "url(/assets/lander/Background.svg)", backgroundSize: "cover"}}>
      <Image src="/assets/lander/Logo.svg" style={{position: "fixed", top: 20, left: 20}} width={100} height={100} alt="Company Culture Match Logo" />
      <div className="w-full max-w-md space-y-8 rounded-xl bg-[#42669B60] p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
            Sign in to your account
          </h2>
        </div>
        
        {error && (
          <div className="rounded-md bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleGoogleSignIn}
            className="flex w-full items-center justify-center rounded-lg bg-white px-4 py-3 text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}