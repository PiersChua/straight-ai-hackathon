import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { InterviewStatus } from "@/generated/prisma/enums";
import { ApiError } from "@/utils/errors";

const StatusSchema = z.object({
  status: z.enum(InterviewStatus),
});

export async function PUT(
  req: NextRequest,
  { params }: RouteContext<"/api/interviews/[id]/status">,
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const body = await req.json();
    const parsed = StatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    // Verify the interview belongs to a posting owned by this hirer
    const interview = await prisma.interview.findUnique({
      where: { id },
      include: { posting: { select: { userId: true } } },
    });

    if (!interview) {
      return NextResponse.json(
        { message: "Interview not found" },
        { status: 404 },
      );
    }
    if (interview.posting.userId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    const updated = await prisma.interview.update({
      where: { id },
      data: { status: parsed.data.status },
    });

    return NextResponse.json(updated);
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
}
