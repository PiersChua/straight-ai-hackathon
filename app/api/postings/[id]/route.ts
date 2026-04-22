import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PostingSchema } from "@/schemas";
import { ApiError } from "@/utils/errors";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

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

export async function PUT(
  req: NextRequest,
  { params }: RouteContext<"/api/postings/[id]">,
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const posting = await prisma.posting.findUnique({
      where: { id },
    });

    if (!posting) {
      return NextResponse.json(
        { message: "Posting not found" },
        { status: 404 },
      );
    }

    if (posting.userId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = PostingSchema.safeParse(body);

    if (!parsed.success) {
      const errors = z.treeifyError(parsed.error);
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: errors.properties,
        },
        { status: 400 },
      );
    }

    const { title, description, requirements, type, questions, isActive } =
      parsed.data;

    const updated = await prisma.posting.update({
      where: { id },
      data: { title, description, requirements, type, questions, isActive },
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
    return NextResponse.json({ message: "Unknown error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: RouteContext<"/api/postings/[id]">,
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const posting = await prisma.posting.findUnique({
      where: { id },
    });
    if (!posting) {
      return NextResponse.json(
        { message: "Posting not found" },
        { status: 404 },
      );
    }
    if (posting.userId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    await prisma.posting.delete({ where: { id } });
    return NextResponse.json({ success: true }, { status: 200 });
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
}
