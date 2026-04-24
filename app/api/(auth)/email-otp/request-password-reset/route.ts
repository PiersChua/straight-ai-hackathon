import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/utils/errors";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { email } = await req.json();
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        accounts: {
          where: { providerId: "credential" },
        },
      },
    });
    if (!user) {
      throw new ApiError("User not found", 404);
    }
    if (user.accounts.length === 0) {
      throw new ApiError(
        "This accont is registered with an external social provider. Please sign in with that provider instead",
        400,
      );
    }
    const res = await auth.api.requestPasswordResetEmailOTP({
      body: {
        email: email, // required
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
