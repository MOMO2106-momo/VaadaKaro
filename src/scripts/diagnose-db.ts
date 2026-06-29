import { PrismaClient } from '@prisma/client';

async function diagnose() {
  const prisma = new PrismaClient();
  console.log("🔍 Starting Project Connectivity Diagnosis...");
  
  try {
    console.log("1. Checking Environment Variables...");
    if (!process.env.DATABASE_URL) {
      console.error("❌ DATABASE_URL is missing from .env");
      return;
    }
    console.log("✅ DATABASE_URL is defined.");

    console.log("2. Attempting Database Connection...");
    await prisma.$connect();
    console.log("✅ Successfully reached the database server!");

    console.log("3. Verifying Database Access...");
    const userCount = await prisma.user.count();
    console.log(`✅ Successfully queried 'User' table. Current user count: ${userCount}`);
    
    console.log("🏆 Result: Your Prisma configuration is perfectly synchronized with your database.");
  } catch (error: any) {
    console.error("❌ Connection Failed!");
    
    if (error.code === 'P1000') {
      console.error("\n💡 DIAGNOSIS: AUTHENTICATION FAILURE (P1000)");
      console.error("Possible causes:");
      console.error("- The password in your .env ('Vaadakaro2025') is incorrect for user 'postgres'.");
      console.error("- The user 'postgres' does not have permission to access database 'vaadakaro'.");
    } else if (error.code === 'P1001') {
      console.error("\n💡 DIAGNOSIS: SERVER UNREACHABLE (P1001)");
      console.error("Possible causes:");
      console.error("- PostgreSQL service is not running on 127.0.0.1:5432.");
      console.error("- A firewall is blocking the connection.");
    } else {
      console.error("\n💡 UNKNOWN ERROR:", error.message || error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

diagnose();
