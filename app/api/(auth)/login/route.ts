import { ApiError } from "@/utils/errors";
import { auth } from "@/lib/auth";
import { LoginSchema } from "@/schemas";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export const POST = async (req: NextRequest) => {
  try {
    const { email, password } = await req.json();
    const validatedFields = LoginSchema.safeParse({
      email,
      password,
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
    const validatedData = validatedFields.data;
    const res = await auth.api.signInEmail({
      body: {
        email: validatedData.email, // user email address
        password: validatedData.password, // user password -> min 8 characters by default
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
