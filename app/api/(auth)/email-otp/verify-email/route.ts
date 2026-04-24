import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/utils/errors";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { email, otp } = await req.json();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new ApiError("Something went wrong", 404);
    }
    if (user.emailVerified) {
      throw new ApiError("Email has already been verified", 400);
    }
    const res = await auth.api.verifyEmailOTP({
      body: {
        email: email, // required
        otp: otp, // required
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
