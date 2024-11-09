"use client";

import { useState, useEffect } from "react";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { OceanGraph } from "@/components/ocean-graph";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/hooks/useUser"

const CreateProfilePage = () => {
  const router = useRouter();
  const [name, setName] = useState("");

  const { data: userProfile } = api.profile.getUserProfile.useQuery();
  const { user } = useUser();

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  const updateProfile = api.user.updateProfile.useMutation({
    onSuccess: () => {
      router.push("/dashboard");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate({
      name,
    });
  };

  return (
    <div className="container mx-auto max-w-4xl p-4 space-y-6">
      <h1 className="text-2xl font-bold font-chillax">Your Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-chillax">Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={updateProfile.isPending}
                className="w-full rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm font-semibold shadow hover:bg-primary/90"
              >
                {updateProfile.isPending ? "Saving..." : "Save Profile"}
              </button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-chillax">Personality Profile</CardTitle>
          </CardHeader>
          <CardContent>
            {userProfile ? (
              <OceanGraph 
                companyData={userProfile}
                className="h-[300px] w-full" 
                showCompanyData={false}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                Complete the personality assessment in the game to see your OCEAN profile.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateProfilePage;