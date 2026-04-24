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

    const body = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: body.name,
        bio: body.bio,
        headline: body.headline,
        location: body.location,
        skills: body.skills ?? [],
        projects: body.projects ?? [],
        experience: body.experience ?? [],
        availability: body.availability,
        preferredRole: body.preferredRole,
        openToWork: body.openToWork ?? false,
        isProfileComplete: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Error" },
      { status: 500 }
    );
  }
};