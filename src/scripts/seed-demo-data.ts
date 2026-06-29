import prisma from "../lib/prisma";

async function seedDemoData() {
  console.log("🚀 Starting Hackathon Demo Data Seeding...");

  const officer = await prisma.user.upsert({
    where: { email: "officer@vaadakaro.gov.in" },
    update: {},
    create: {
      name: "Inspector Rajesh Kumar",
      email: "officer@vaadakaro.gov.in",
      role: "OFFICER",
      department: "Public Works",
      isVerified: true,
    },
  });

  const citizen = await prisma.user.upsert({
    where: { email: "demo.citizen@vaadakaro.in" },
    update: {},
    create: {
      name: "Demo Citizen",
      email: "demo.citizen@vaadakaro.in",
      role: "CITIZEN",
      citizenId: `VK-${new Date().getFullYear()}-10001`,
      isVerified: true,
    },
  });

  const potholeCoords = [
    [28.6140, 77.2091],
    [28.6138, 77.2089],
    [28.6141, 77.2092],
    [28.6137, 77.2090],
  ];

  for (let i = 0; i < potholeCoords.length; i++) {
    await prisma.complaint.upsert({
      where: { trackingId: `VK-DEMO-PH-${i}` },
      update: {},
      create: {
        title: `[DEMO] Critical Pothole Issue #${i + 1}`,
        description:
          "Multiple deep potholes causing traffic hazards and vehicle damage in the main intersection.",
        category: "Roads & Potholes",
        department: "PWD",
        status: i === 0 ? "UNDER_REVIEW" : "SUBMITTED",
        priority: "URGENT",
        latitude: potholeCoords[i][0],
        longitude: potholeCoords[i][1],
        trackingId: `VK-DEMO-PH-${i}`,
        citizenId: citizen.id,
        pincode: "110001",
      },
    });
  }

  const garbageCoords = [
    [28.6851, 77.2251],
    [28.6849, 77.2249],
    [28.6852, 77.2252],
  ];

  for (let i = 0; i < garbageCoords.length; i++) {
    await prisma.complaint.upsert({
      where: { trackingId: `VK-DEMO-GB-${i}` },
      update: {},
      create: {
        title: `[DEMO] Illegal Garbage Dumping #${i + 1}`,
        description:
          "Garbage accumulating for days, blocking the sidewalk and causing foul smell.",
        category: "Sanitation & Garbage",
        department: "MCD",
        status: "SUBMITTED",
        priority: "HIGH",
        latitude: garbageCoords[i][0],
        longitude: garbageCoords[i][1],
        trackingId: `VK-DEMO-GB-${i}`,
        citizenId: citizen.id,
        pincode: "110001",
      },
    });
  }

  console.log("✅ Demo hotspots created.");
  console.log(`   Officer: ${officer.email}`);
  console.log(`   Citizen: ${citizen.email}`);
  console.log("🌟 Demo data seeding complete!");
}

seedDemoData()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
