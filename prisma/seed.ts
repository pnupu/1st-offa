import { PrismaClient } from '@prisma/client';
import emailData from './gamedata/emails.json';
import companiesData from './gamedata/companies';
const prisma = new PrismaClient();

async function main() {
  // Seed companies and their profiles
  for (const companyData of companiesData) {


    // Create company
    await prisma.company.upsert({
      where: { id: companyData.id },
      update: {
        name: companyData.name,
        description: companyData.description,
        website: companyData.website,
        address: companyData.address,
      },
      create: {
        id: companyData.id,
        name: companyData.name,
        description: companyData.description,
        website: companyData.website,
        address: companyData.address,
      },
    });
  }

  // Seed game emails
  for (let i = 0; i < emailData.length; i++) {
    const email = emailData[i];
    if (!email) {
      throw new Error('Email data is missing');
    }
    await prisma.gameEmail.upsert({
      where: { id: `email-${i + 1}` },
      update: {
        subject: email.Subject,
        content: `${email.Greeting}${email.Body}`,
        from: email.Sender.Name,
        position: email.Sender.Position,
        sentTime: email.SentTime,
        order: i + 1,
      },
      create: {
        id: `email-${i + 1}`,
        subject: email.Subject,
        content: `${email.Greeting}${email.Body}`,
        from: email.Sender.Name,
        position: email.Sender.Position,
        sentTime: email.SentTime,
        order: i + 1,
      },
    });
  }

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });