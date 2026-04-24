import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/utils/errors";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { email, otp, password, confirmPassword } = await req.json();
    if (password !== confirmPassword) {
      throw new ApiError("Passwords do not match", 400);
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new ApiError("User not found", 404);
    }
    const res = await auth.api.resetPasswordEmailOTP({
      body: {
        email: email, // required
        otp: otp, // required
        password: password, // required
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
