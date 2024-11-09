import { api } from "@/trpc/server";
import { CompanyCard } from "@/components/companies/company-card";

export default async function CompaniesPage() {
  const companies = await api.company.getAll();

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-8 font-chillax text-3xl font-bold">Browse Companies</h1>
      <div className="flex flex-col w-full gap-6">
        {companies.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>
    </div>
  );
} 