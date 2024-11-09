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

type OceanTrait = 'openness' | 'conscientiousness' | 'extraversion' | 'agreeableness' | 'neuroticism';

interface TraitDifference {
  trait: OceanTrait;
  difference: number;
  userScore: number;
  companyScore: number;
}

function getTraitInsight(trait: OceanTrait, userScore: number, companyScore: number): string {
  const insights = {
    openness: {
      high: "You match the company's appreciation for innovation and creative thinking.",
      low: "You might prefer more structured approaches than the company's innovative style.",
    },
    conscientiousness: {
      high: "You align well with the company's organized and detail-oriented culture.",
      low: "You might find the company's structured approach somewhat restrictive.",
    },
    extraversion: {
      high: "You share the company's preference for collaborative and social work environments.",
      low: "You might prefer more independent work than the company's collaborative style.",
    },
    agreeableness: {
      high: "You match the company's emphasis on teamwork and harmonious relationships.",
      low: "You might bring valuable direct communication to their cooperative environment.",
    },
    neuroticism: {
      high: "You share the company's careful and detail-oriented approach to challenges.",
      low: "You bring valuable stress resilience to their work environment.",
    },
  };

  // For small differences (strong matches), we should return the "high" message
  // since the scores are close together
  if (Math.abs(companyScore - userScore) < 0.2) {
    return insights[trait].high;
  }

  const difference = companyScore - userScore;
  return difference > 0 ? insights[trait].low : insights[trait].high;
}

function getGrowthInsight(trait: OceanTrait, userScore: number, companyScore: number): string {
  const growthInsights = {
    openness: {
      high: "This environment could help you develop more structured work approaches while maintaining creativity.",
      low: "You could grow by embracing the company's innovative culture while bringing your practical perspective.",
    },
    conscientiousness: {
      high: "You could learn to balance your detail-oriented nature with more flexible approaches.",
      low: "This environment offers a chance to enhance your organizational and planning skills.",
    },
    extraversion: {
      high: "You could develop skills in focused individual work while maintaining your social strengths.",
      low: "This setting provides opportunities to build confidence in group settings at your own pace.",
    },
    agreeableness: {
      high: "You could learn to balance cooperation with assertiveness in this environment.",
      low: "This culture could help you develop more diplomatic approaches while maintaining your directness.",
    },
    neuroticism: {
      high: "This environment could help you develop more resilience while maintaining your attention to detail.",
      low: "You could learn to channel your calm nature into supporting others in high-pressure situations.",
    },
  };

  const difference = companyScore - userScore;
  return difference > 0 ? growthInsights[trait].low : growthInsights[trait].high;
}

function calculateTraitDifferences(company: OceanProfile, user: OceanProfile): TraitDifference[] {
  const traits: OceanTrait[] = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];
  
  return traits.map(trait => ({
    trait,
    difference: Math.abs(company[trait] - user[trait]),
    userScore: user[trait],
    companyScore: company[trait],
  })).sort((a, b) => a.difference - b.difference); // Sort from smallest to largest difference
}

function InsightCard({ title, trait, difference, insight }: { 
  title: React.ReactNode; 
  trait: string; 
  difference: string;
  insight: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
      <h4 className="font-chillax text-sm font-medium mb-2">{title}</h4>
      <p className="text-sm text-muted-foreground mb-1">
        <span className="font-medium">{trait}</span> 
        <br />
        {difference}
      </p>
      <p className="text-sm text-muted-foreground">{insight}</p>
    </div>
  );
}

export function CompanyCard({ company }: CompanyCardProps) {
  const { data: userProfile } = api.profile.getUserProfile.useQuery();

  const traitDifferences = userProfile && company.oceanProfile
    ? calculateTraitDifferences(company.oceanProfile, userProfile)
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
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <p className="text-sm text-muted-foreground flex-1">{company.description}</p>
            
            {company.oceanProfile && userProfile && (
              <div className="flex gap-8">
                <div className="flex-1">
                  <h3 className="mb-2 font-chillax text-sm font-medium">Profile comparison</h3>
                  <OceanGraph 
                    companyData={company.oceanProfile}
                    userData={userProfile}
                    className="h-[300px] w-full" 
                  />
                </div>
              </div>
            )}
          </div>

          {traitDifferences && traitDifferences.length >= 5 && (
            <div className="grid grid-cols-3 gap-4">
              <InsightCard
                title={<span className="text-green-600">Strongest Match</span>}
                trait={traitDifferences[0]?.trait ?? ''}
                difference={`Similarity: ${Math.round((1 - (traitDifferences[0]?.difference ?? 0)) * 100)}%`}
                insight={getTraitInsight(
                  traitDifferences[0]?.trait ?? 'openness',
                  traitDifferences[0]?.userScore ?? 0,
                  traitDifferences[0]?.companyScore ?? 0
                )}
              />
              <InsightCard
                title={<span className="text-red-600">Biggest Gap</span>}
                trait={traitDifferences[4]?.trait ?? ''}
                difference={`Difference: ${Math.round((traitDifferences[4]?.difference ?? 0) * 100)}%`}
                insight={getTraitInsight(
                  traitDifferences[4]?.trait ?? 'openness',
                  traitDifferences[4]?.userScore ?? 0,
                  traitDifferences[4]?.companyScore ?? 0
                )}
              />
              <InsightCard
                title="Growth Opportunity"
                trait={traitDifferences[2]?.trait ?? ''}
                difference={`Difference: ${Math.round((traitDifferences[2]?.difference ?? 0) * 100)}%`}
                insight={getGrowthInsight(
                  traitDifferences[2]?.trait ?? 'openness',
                  traitDifferences[2]?.userScore ?? 0,
                  traitDifferences[2]?.companyScore ?? 0
                )}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 
