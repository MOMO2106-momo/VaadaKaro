import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testSignup() {
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = "Password123!";
  const hashedPassword = await bcrypt.hash(testPassword, 10);

  console.log(`Attempting to create user with email: ${testEmail}`);

  try {
    const user = await prisma.user.create({
      data: {
        name: "Test User",
        email: testEmail.toLowerCase(),
        password: hashedPassword,
        role: "CITIZEN",
      },
    });

    console.log("User created successfully!");
    console.log("User ID:", user.id);
    console.log("User Role:", user.role);

    // Cleanup
    await prisma.user.delete({
      where: { id: user.id },
    });
    console.log("Test user cleaned up.");

  } catch (error: any) {
    console.error("Test Signup Failed!");
    console.error("Error Code:", error?.code);
    console.error("Error Message:", error?.message);
    console.error("Full Error:", JSON.stringify(error, null, 2));
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testSignup();
