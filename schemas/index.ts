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
  phoneNumber: z
    .string("Phone number is required")
    .regex(/^[689]\d{7}$/, "Phone number must be a valid Singapore number"),
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
const PostingSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(100, "Title must be under 100 characters"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters"),
  requirements: z.string().trim().optional(),
  type: z.enum(PostingType, "Type is required"),
  questions: z
    .array(z.string().trim().min(1, "Question cannot be empty"))
    .min(1, "At least one question is required"),
  isActive: z.boolean(),
});
const OtpSchema = z.object({
  otp: z
    .string()
    .length(6, "Code must be 6 digits")
    .regex(/^\d+$/, "Code must be numeric"),
});

const ForgetPasswordSchema = OtpSchema.extend({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Email is invalid")
    .toLowerCase(),
  password: z
    .string()
    .regex(/^\S*$/, "Password cannot contain spaces")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Confirm Password is required"),
});

export {
  SignupSchema,
  LoginSchema,
  PostingSchema,
  OtpSchema,
  ForgetPasswordSchema,
};
