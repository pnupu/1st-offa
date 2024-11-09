import { PrismaClient, ProfileType } from '@prisma/client';
import emailData from './gamedata/emails.json';
const prisma = new PrismaClient();

async function main() {
  const seedUserId = process.env.SEED_USER_ID;
  if (!seedUserId) {
    throw new Error('SEED_USER_ID is required in .env');
  }

  // Create Ocean Profile for seed user
  await prisma.oceanProfile.upsert({
    where: { userId: seedUserId },
    update: {
      openness: 0.8,
      conscientiousness: 0.7,
      extraversion: 0.6,
      agreeableness: 0.75,
      neuroticism: 0.4,
    },
    create: {
      openness: 0.8,
      conscientiousness: 0.7,
      extraversion: 0.6,
      agreeableness: 0.75,
      neuroticism: 0.4,
      profileType: ProfileType.USER,
      userId: seedUserId,
    },
  });

  // Create company logos
  const logo1 = await prisma.file.upsert({
    where: { key: "tech-innovators-logo" },
    update: {
      url: "https://placehold.co/400x400?text=Tech+Innovators",
    },
    create: {
      url: "https://placehold.co/400x400?text=Tech+Innovators",
      key: "tech-innovators-logo",
    },
  });

  const logo2 = await prisma.file.upsert({
    where: { key: "creative-solutions-logo" },
    update: {
      url: "https://placehold.co/400x400?text=Creative+Solutions",
    },
    create: {
      url: "https://placehold.co/400x400?text=Creative+Solutions",
      key: "creative-solutions-logo",
    },
  });

  // Create two companies with admin
  const company1 = await prisma.company.upsert({
    where: {
      id: "company1",
    },
    update: {
      name: "Tech Innovators Inc.",
      description: "Tech Innovators Inc. is a cutting-edge technology company specializing in artificial intelligence and machine learning solutions. Founded in 2015, we've been at the forefront of developing innovative software solutions that help businesses automate processes and make data-driven decisions. Our team of expert engineers and data scientists is passionate about pushing the boundaries of what's possible with technology.",
      website: "https://techinnovators.example.com",
      address: "123 Innovation Drive, Silicon Valley, CA 94025",
      logoId: logo1.id,
    },
    create: {
      id: "company1",
      name: "Tech Innovators Inc.",
      description: "Tech Innovators Inc. is a cutting-edge technology company specializing in artificial intelligence and machine learning solutions. Founded in 2015, we've been at the forefront of developing innovative software solutions that help businesses automate processes and make data-driven decisions. Our team of expert engineers and data scientists is passionate about pushing the boundaries of what's possible with technology.",
      website: "https://techinnovators.example.com",
      address: "123 Innovation Drive, Silicon Valley, CA 94025",
      logoId: logo1.id,
    },
  });

  const company2 = await prisma.company.upsert({
    where: { id: 'company2' },
    update: {
      name: 'Creative Solutions Ltd.',
      description: 'Creative Solutions Ltd. is a dynamic design and branding agency that transforms ideas into compelling visual stories. With over a decade of experience in digital design, branding, and user experience, we help businesses build meaningful connections with their audiences. Our diverse team of designers, strategists, and creative thinkers works collaboratively to deliver innovative solutions that stand out in todays competitive market.',
      website: "https://creativesolutions.example.com",
      address: "456 Design Street, Creative District, NY 10013",
      logoId: logo2.id,
    },
    create: {
      id: 'company2',
      name: 'Creative Solutions Ltd.',
      description: 'Creative Solutions Ltd. is a dynamic design and branding agency that transforms ideas into compelling visual stories. With over a decade of experience in digital design, branding, and user experience, we help businesses build meaningful connections with their audiences. Our diverse team of designers, strategists, and creative thinkers works collaboratively to deliver innovative solutions that stand out in todays competitive market.',
      website: "https://creativesolutions.example.com",
      address: "456 Design Street, Creative District, NY 10013",
      logoId: logo2.id,
    },
  });

  // Create a test user for each company
  await prisma.user.upsert({
    where: { email: 'employee1@techinnovators.com' },
    update: {},
    create: {
      email: 'employee1@techinnovators.com',
      name: 'John Tech',
      companyId: company1.id,
      oceanProfile: {
        create: {
          openness: 0.7,
          conscientiousness: 0.8,
          extraversion: 0.6,
          agreeableness: 0.7,
          neuroticism: 0.3,
          profileType: ProfileType.USER,
        },
      },
    },
  });

  await prisma.user.upsert({
    where: { email: 'employee1@creativesolutions.com' },
    update: {},
    create: {
      email: 'employee1@creativesolutions.com',
      name: 'Alice Creative',
      companyId: company2.id,
      oceanProfile: {
        create: {
          openness: 0.9,
          conscientiousness: 0.6,
          extraversion: 0.8,
          agreeableness: 0.8,
          neuroticism: 0.4,
          profileType: ProfileType.USER,
        },
      },
    },
  });

  // Create company OCEAN profiles
  await prisma.oceanProfile.upsert({
    where: { companyId: company1.id },
    update: {
      openness: 0.75,
      conscientiousness: 0.8,
      extraversion: 0.7,
      agreeableness: 0.75,
      neuroticism: 0.35,
    },
    create: {
      openness: 0.75,
      conscientiousness: 0.8,
      extraversion: 0.7,
      agreeableness: 0.75,
      neuroticism: 0.35,
      profileType: ProfileType.COMPANY,
      companyId: company1.id,
    },
  });

  await prisma.oceanProfile.upsert({
    where: { companyId: company2.id },
    update: {
      openness: 0.3,
      conscientiousness: 0.3,
      extraversion: 0.2,
      agreeableness: 0.3,
      neuroticism: 0.9,
    },
    create: {
      openness: 0.3,
      conscientiousness: 0.3,
      extraversion: 0.2,
      agreeableness: 0.3,
      neuroticism: 0.9,
      profileType: ProfileType.COMPANY,
      companyId: company2.id,
    },
  });

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