"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import Image from "next/image";
import { useEffect } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (!user?.name) {
      router.push("/dashboard/profile");
    }
  }, [user?.name, router]);

  if (!user?.name) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Banner/Welcome Section */}
      <div className="relative">
        <div className="relative group">
          <Image
            src="../../desktop.svg"
            alt="Welcome Banner"
            width={1200}
            height={1200}
            className="w-full rounded-lg"
          />
          <div className="absolute inset-0 bg-black/30 rounded-lg group-hover:opacity-10 transition-all duration-300" />
        </div>
        <div className="absolute inset-0 flex items-center justify-between p-6">
          <div className="absolute bottom-[15%] left-1/2 transform -translate-x-1/2">
            <Button onClick={() => router.push('/game')} className="bg-[#2A4060] text-white w-32">
              Play
            </Button>
          </div>
        </div>
      </div>

      {/* Two cards side by side */}
      {/* <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Games Available</span>
                <span className="font-bold">5</span>
              </div>
              <div className="flex justify-between">
                <span>Games Completed</span>
                <span className="font-bold">{profile.gameScores?.length || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              {profile.oceanProfile 
                ? "View your personality insights and matches"
                : "Complete more games to unlock your personality profile"}
            </p>
            <Button 
              variant="outline"
              onClick={() => router.push('/game')}
              className="w-full"
            >
              Continue Assessment
            </Button>
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
}