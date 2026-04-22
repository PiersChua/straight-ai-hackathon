import { PostingType } from "@/generated/prisma/enums";
import z from "zod";

const SignupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Required")
    .regex(/^[A-Za-z\s]+$/, "Name can only contain letters")
    .toLowerCase(),
  email: z.string().min(1, "Required").email("Email is invalid").toLowerCase(),
  password: z
    .string()
    .regex(/^\S*$/, "Password cannot contain spaces")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Confirm Password is required"),
  role: z.enum(["HIRER", "CANDIDATE"]),
});

const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Email is invalid")
    .toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export { SignupSchema, LoginSchema };
