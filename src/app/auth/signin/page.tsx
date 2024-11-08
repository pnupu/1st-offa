"use client";

import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function SignInPage() {
  const { data: session } = useSession();
  
  // Redirect to game if already signed in
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white/10 p-8 text-white">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
            Sign in to your account
          </h2>
        </div>
        
        <div className="space-y-4">
          {/* <form
            className="space-y-4"
            action={async (formData: FormData) => {
              "use server";
              const email = formData.get("email");
              if (!email) return;
              
              await signIn("email", { email, redirect: true, callbackUrl: "/game" });
            }}
          >
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              className="relative block w-full rounded-lg border-0 p-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-600"
              placeholder="Email address"
            />
            <button
              type="submit"
              className="w-full rounded-lg bg-purple-600 px-4 py-3 font-semibold text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Sign in with Email
            </button>
          </form> */}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              {/* <div className="w-full border-t border-white/10"></div> */}
            </div>
            <div className="relative flex justify-center text-sm">
              {/* <span className="bg-[#15162c] px-2 text-white">Or continue with</span> */}
            </div>
          </div>

          <button
            onClick={() => signIn("google", { callbackUrl: "/game" })}
            className="flex w-full items-center justify-center rounded-lg bg-white px-4 py-3 text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
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