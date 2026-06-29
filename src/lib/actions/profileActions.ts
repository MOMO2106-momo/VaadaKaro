"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: {
    name: string;
    phone: string;
    ward: string;
    city: string;
    state: string;
    image?: string;
}) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" };
        }

        // Input validation
        if (!data.name || data.name.trim().length === 0) {
            return { success: false, error: "Name is required" };
        }

        // Update the Prisma User model. 
        // We store 'ward' inside 'location', and city/state inside 'addressCity' and 'addressState'
        const updatedUser = await prisma.user.update({
            where: { id: session.user.id as string },
            data: {
                name: data.name,
                phone: data.phone || null,
                location: data.ward || null,
                addressCity: data.city || null,
                addressState: data.state || null,
                image: data.image || null,
            },
        });

        if (!updatedUser) {
            return { success: false, error: "Profile not found" };
        }

        // Revalidate all citizen portal pages so the layout re-fetches user from DB
        revalidatePath("/citizen", "layout");
        revalidatePath("/citizen/dashboard");
        revalidatePath("/citizen/profile");

        return { success: true };
    } catch (error) {
        console.error("Update profile error:", error);
        return { success: false, error: "Failed to update profile. Please try again." };
    }
}
