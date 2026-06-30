import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const BADGES = [
  {
    name: 'First Report',
    description: 'Filed your first civic complaint',
    icon: '🏅',
    pointsRequired: 50,
  },
  {
    name: 'Truth Seeker',
    description: 'Verified 10 complaints from others',
    icon: '🔍',
    pointsRequired: 200,
  },
  {
    name: 'Community Voice',
    description: 'Got 25 upvotes on complaints',
    icon: '📣',
    pointsRequired: 500,
  },
  {
    name: 'Justice Warrior',
    description: 'Had 5 complaints fully resolved',
    icon: '⚖️',
    pointsRequired: 750,
  },
  {
    name: 'Civic Champion',
    description: 'Reach top 10 on the leaderboard',
    icon: '🏆',
    pointsRequired: 1500,
  },
  {
    name: 'Legend',
    description: 'Contribute 5000 points total',
    icon: '🌟',
    pointsRequired: 5000,
  },
];

async function main() {
  console.log('Seeding data...');

  // 1. Seed Badges
  let badgeCount = 0;
  for (const badge of BADGES) {
    await prisma.badge.upsert({
      where: { name: badge.name },
      update: {
        description: badge.description,
        icon: badge.icon,
        pointsRequired: badge.pointsRequired,
      },
      create: badge,
    });
    badgeCount++;
  }
  console.log(`Seeded ${badgeCount} badges.`);

  // 2. Seed Lawyers
  const lawyers = [
    {
      name: 'Adv. Rahul Deshmukh',
      email: 'rahul.lawyer@example.com',
      role: 'LAWYER',
      location: 'Mumbai',
      lawyerProfile: {
        create: {
          barNumber: 'MAH/1234/2010',
          specialization: ['Criminal', 'RTI'], // Typo RTl corrected to RTI
          location: 'Mumbai',
          pincode: '400001',
          fees: 1500,
          experience: 12,
          languages: ['English', 'Marathi', 'Hindi'],
          bio: 'Expert in criminal defense and RTI matters with over 12 years of experience in Bombay High Court.',
          rating: 4.8
        }
      }
    },
    {
      name: 'Adv. Priya Kulkarni',
      email: 'priya.lawyer@example.com',
      role: 'LAWYER',
      location: 'Pune',
      lawyerProfile: {
        create: {
          barNumber: 'MAH/5678/2015',
          specialization: ['Consumer', 'Family'],
          location: 'Pune',
          pincode: '411001',
          fees: 1000,
          experience: 8,
          languages: ['English', 'Marathi', 'Hindi'],
          bio: 'Specialized in consumer protection and family law disputes.',
          rating: 4.9
        }
      }
    }
  ];

  let lawyerCount = 0;
  for (const lawyer of lawyers) {
    await prisma.user.upsert({
      where: { email: lawyer.email },
      update: {},
      create: {
        name: lawyer.name,
        email: lawyer.email,
        role: 'LAWYER' as any,
        location: lawyer.location,
        lawyerProfile: lawyer.lawyerProfile
      } as any
    });
    lawyerCount++;
  }
  console.log(`Seeded ${lawyerCount} lawyers.`);

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
