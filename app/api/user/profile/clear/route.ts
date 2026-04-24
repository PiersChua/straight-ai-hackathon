import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ApiError } from "@/utils/errors";

export const POST = async (req: NextRequest) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session?.user?.id) {
      throw new ApiError("Unauthorized", 401);
    }

    const cleared = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        bio: "",
        headline: "",
        location: "",
        availability: "",
        preferredRole: "",
        openToWork: false,
        skills: [],
        projects: [],
        experience: [],
        resumeUrl: null,
        isProfileComplete: false,
      },
    });

    return NextResponse.json(cleared);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Error" },
      { status: 500 }
    );
  }
};