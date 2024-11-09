"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OceanGraph } from "@/components/ocean-graph";
import type { Company, OceanProfile, File } from "@prisma/client";
import { api } from "@/trpc/react";
import { Building } from "lucide-react";

interface CompanyWithProfile extends Company {
  oceanProfile: OceanProfile | null;
  logo: File | null;
}

interface CompanyCardProps {
  company: CompanyWithProfile;
}

function calculateFitPercentage(company: OceanProfile, user: OceanProfile) {
  const traits = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'] as const;
  
  const differences = traits.map(trait => {
    const diff = Math.abs(company[trait] - user[trait]);
    return 1 - diff;
  });

  const avgSimilarity = differences.reduce((sum, diff) => sum + diff, 0) / traits.length;
  return Math.round(avgSimilarity * 100);
}

export function CompanyCard({ company }: CompanyCardProps) {
  const { data: userProfile } = api.profile.getUserProfile.useQuery();

  const fitPercentage = userProfile && company.oceanProfile 
    ? calculateFitPercentage(company.oceanProfile, userProfile)
    : null;

  return (
    <Card className="overflow-visible w-full">
      <CardHeader className="flex flex-row items-center gap-4">
        <div>
          <CardTitle className="font-chillax">{company.name}</CardTitle>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            {company.address && (
              <div className="flex items-center gap-1">
                <Building className="h-4 w-4" />
                <span>{company.address}</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <p className="text-sm text-muted-foreground flex-1">{company.description}</p>
          
          {company.oceanProfile && (
            <div className="flex gap-8">
              {fitPercentage !== null && (
                <div className="flex flex-col justify-center">
                  <div className="text-l font-chillax font-bold">
                    FIT: <span className={`${
                      fitPercentage >= 75 ? 'text-green-500' :
                      fitPercentage <= 25 ? 'text-red-500' : 
                      'text-yellow-500'
                    }`}>{fitPercentage}%</span>
                  </div>
                </div>
              )}
              
              <div className="flex-1">
                <h3 className="mb-2 font-chillax text-sm font-medium">Company Profile</h3>
                <OceanGraph 
                  companyData={company.oceanProfile}
                  userData={userProfile}
                  className="h-[300px] w-full" 
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 