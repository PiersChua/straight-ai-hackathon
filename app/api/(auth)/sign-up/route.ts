import { ApiError } from "@/utils/errors";
import { NextRequest, NextResponse } from "next/server";
import { SignupSchema } from "@/schemas";
import z from "zod";
import { auth } from "@/lib/auth";
import { role } from "better-auth/client";

export const POST = async (req: NextRequest) => {
  try {
    const { name, email, phoneNumber, password, confirmPassword, role } =
      await req.json();
    const validatedFields = SignupSchema.safeParse({
      name,
      email,
      phoneNumber,
      password,
      confirmPassword,
      role,
    });
    if (!validatedFields.success) {
      const errors = z.treeifyError(validatedFields.error);
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: errors.properties,
        },
        { status: 400 },
      );
    }
    if (password !== confirmPassword) {
      throw new ApiError("Passwords do not match", 400);
    }
    const validatedData = validatedFields.data;
    const res = await auth.api.signUpEmail({
      body: {
        email: validatedData.email, // user email address
        password: validatedData.password, // user password -> min 8 characters by default
        phoneNumber: validatedData.phoneNumber,
        name: validatedData.name, // user display name
        role: validatedData.role,
      },
      asResponse: true,
    });
    return res;
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status },
      );
    }
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "Unknown error occurred" },
      { status: 500 },
    );
  }
};
