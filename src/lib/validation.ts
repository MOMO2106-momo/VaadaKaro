import { z } from 'zod';
import { PriorityLevel } from '@prisma/client';

export const complaintSchema = z.object({
  title: z.string()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title cannot exceed 150 characters"),
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(3000, "Description cannot exceed 3000 characters"),
  department: z.string().min(1, "Department is required"),
  category: z.string().min(1, "Category is required"),
  priority: z.nativeEnum(PriorityLevel),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Invalid Indian pincode"),
  declaration: z.literal(true, {
    message: "You must solemnly affirm the truth of your grievance",
  }),
  aiDisclaimer: z.literal(true, {
    message: "You must acknowledge the AI informational nature",
  }),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  attachments: z.array(z.object({
    url: z.string().url(),
    filename: z.string(),
    mimeType: z.string().optional(),
    fileSize: z.number().max(10 * 1024 * 1024, "File size must be less than 10MB"),
  })).default([]),
});

export const registrationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date of birth" }),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
});
