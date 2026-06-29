"use server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { registrationSchema } from "@/lib/validation";

export async function registerUser(prevState: any, formData: FormData) {
  try {
    
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const phone = formData.get("phone") as string;
    const dateOfBirthStr = formData.get("dateOfBirth") as string;
    const city = formData.get("city") as string;
    const stateInput = formData.get("state") as string;
    const consent = formData.get("consent") === "on";
    const civicIdConsent = formData.get("civicIdConsent") === "on";

    // 1. Validate with Zod
    const validatedFields = registrationSchema.safeParse({
      name,
      email,
      password,
      phone,
      dateOfBirth: dateOfBirthStr,
      city,
      state: stateInput,
    });

    if (!validatedFields.success) {
      const errors = validatedFields.error.flatten().fieldErrors;
      return { 
        error: errors.name?.[0] || 
               errors.email?.[0] || 
               errors.password?.[0] ||
               "Invalid input" 
      };
    }

    // 2. Check Consent
    if (!consent) {
      return { error: "You must agree to the Terms & Conditions and Privacy Policy." };
    }

    // 3. Database Check
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return { error: "This email is already registered. Please sign in instead." };
    }

    // 4. Hashing
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate Civic ID: VK-YYYY-XXXXX
    const year = new Date().getFullYear();
    const randomNum = Math.floor(10000 + Math.random() * 90000); // 5 digits
    const generatedCitizenId = `VK-${year}-${randomNum}`;
    
    // Convert to Date
    const dobDate = new Date(dateOfBirthStr);

    // Calculate initial Completeness Score
    let profileCompletenessScore = 50; 
    if (civicIdConsent) profileCompletenessScore += 20;

    // 5. Creation
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone,
        dateOfBirth: dobDate,
        addressCity: city,
        addressState: stateInput,
        civicIdConsent,
        citizenId: generatedCitizenId,
        verificationStatus: "UNVERIFIED",
        phoneVerified: false,
        profileCompletenessScore,
        role: "CITIZEN",
      },
    });

    return { success: "Account created successfully! You can now sign in." };
  } catch (error: any) {
    console.error("[AUTH_ACTION] Critical Registration Error:", error);
    
    // Check for specific Prisma errors
    if (error.code === 'P2002') {
      return { error: "Email is already in use." };
    }
    
    // Return detailed error in dev, generic in prod
    return { 
      error: process.env.NODE_ENV === 'development' 
        ? `Registration failed: ${error.message || String(error)}` 
        : "An unexpected error occurred during account creation. Please try again later." 
    };
  }
}

export async function loginUser(prevState: any, formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");


  if (!email || !password) {
    return { error: "Missing email or password" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    console.error("[AUTH_ACTION] Login Error:", error);
    
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        case "CallbackRouteError":
          return { error: "Database/Server error during login." };
        default:
          return { error: "Something went wrong during sign in." };
      }
    }
    
    // Auth.js redirects by throwing an error, so we need to re-throw it 
    // to allow the redirect to happen, unless it's a specific fail case.
    if ((error as any)?.message?.includes("NEXT_REDIRECT")) {
        throw error;
    }

    return { 
        error: process.env.NODE_ENV === 'development' 
          ? `Login failed: ${String(error)}` 
          : "Something went wrong." 
    };
  }
}

export async function logoutUser() {
  await signOut({ redirectTo: "/login" });
}
