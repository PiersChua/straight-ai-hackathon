import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ApiError } from "@/utils/errors";

export const GET = async (req: NextRequest) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session?.user?.id) {
      throw new ApiError("Unauthorized", 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        skills: true,
        headline: true,
        location: true,
        projects: true,
        experience: true,
        resumeUrl: true,
        availability: true,
        preferredRole: true,
        openToWork: true,
        isProfileComplete: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Error" },
      { status: 500 }
    );
  }
};