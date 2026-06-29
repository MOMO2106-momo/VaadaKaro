import { GamificationService } from "./gamification.service";

async function main() {
  console.log("Seeding badges...");
  await GamificationService.seedBadges();
  console.log("Badges seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
