"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

const CompanyLoginPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [error, setError] = useState("");

  const { data: companies } = api.company.getAllCompanyNames.useQuery();
  const verifySecretKey = api.company.verifySecretKey.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Verify secret key
    try {
      const isValid = await verifySecretKey.mutateAsync({ secretKey });
      if (!isValid) {
        setError("Invalid company secret key");
        return;
      }

      const result = await signIn("credentials", {
        email,
        name,
        companyId: company,
        redirect: false,
        callbackUrl: "/dashboard"
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-[#42669B]" style={{ backgroundImage: "url(/assets/lander/Background.svg)", backgroundSize: "cover" }}>
      <Link href="/">
        <Image src="/assets/lander/Logo.svg" style={{ position: "fixed", top: 20, left: 20 }} width={100} height={100} alt="Company Culture Match Logo" />
      </Link>
      <div className="container mx-auto max-w-md p-4">
        <Card>
          <CardHeader>
            <CardTitle className="font-chillax text-center">Join Your Company</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="text-red-500 text-sm text-center">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Company
                </label>
                <select
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  required
                >
                  <option value="">Select a company</option>
                  {companies?.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Secret Key
                </label>
                <input
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  required
                  placeholder="Enter secret key"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm font-semibold shadow hover:bg-primary/90"
              >
                Join Company
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompanyLoginPage; 