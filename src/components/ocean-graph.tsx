"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart, Legend } from "recharts";

interface OceanData {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

interface OceanGraphProps {
  companyData: OceanData;
  userData?: OceanData | null;
  className?: string;
}

export function OceanGraph({ companyData, userData, className }: OceanGraphProps) {
  const chartData = [
    { 
      trait: "Openness", 
      company: companyData.openness * 100,
      user: userData?.openness ? userData.openness * 100 : undefined
    },
    { 
      trait: "Conscientiousness", 
      company: companyData.conscientiousness * 100,
      user: userData?.conscientiousness ? userData.conscientiousness * 100 : undefined
    },
    { 
      trait: "Extraversion", 
      company: companyData.extraversion * 100,
      user: userData?.extraversion ? userData.extraversion * 100 : undefined
    },
    { 
      trait: "Agreeableness", 
      company: companyData.agreeableness * 100,
      user: userData?.agreeableness ? userData.agreeableness * 100 : undefined
    },
    { 
      trait: "Neuroticism", 
      company: companyData.neuroticism * 100,
      user: userData?.neuroticism ? userData.neuroticism * 100 : undefined
    },
  ];

  return (
    <div className={className}>
      <RadarChart
        width={400}
        height={300}
        data={chartData}
        className="mx-auto -mt-6 -ml-6"
        margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
      >
        <PolarGrid stroke="hsl(var(--muted-foreground))" />
        <PolarAngleAxis 
          dataKey="trait" 
          tick={{ 
            fill: "hsl(var(--muted-foreground))",
            fontSize: 12,
          }}
          tickSize={15}
          className="font-chillax"
        />
        <Radar
          name="Company"
          dataKey="company"
          stroke="hsl(var(--primary))"
          fill="hsl(var(--primary))"
          fillOpacity={0.2}
        />
        {userData && (
          <Radar
            name="Your Profile"
            dataKey="user"
            stroke="hsl(var(--destructive))"
            fill="hsl(var(--destructive))"
            fillOpacity={0.2}
          />
        )}
        <Legend 
          wrapperStyle={{
            paddingTop: "20px",
            fontSize: "12px",
          }}
        />
      </RadarChart>
    </div>
  );
} 