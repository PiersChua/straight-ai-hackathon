import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/utils/errors";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: RouteContext<"/api/postings/[id]">,
) => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      throw new ApiError("Unauthorized", 401);
    }
    const { id } = await params;
    const posting = await prisma.posting.findUnique({
      where: { id },
    });
    if (!posting) {
      throw new ApiError("Posting not found", 404);
    }
    return NextResponse.json({ posting }, { status: 200 });
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
    return NextResponse.json({ message: "Unknown error" }, { status: 500 });
  }
};
