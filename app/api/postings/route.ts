import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { PostingSchema } from "@/schemas";
import { z } from "zod";
import { ApiError } from "@/utils/errors";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
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

    const posting = await prisma.posting.create({
      data: {
        title,
        description,
        requirements,
        type,
        questions,
        isActive,
        userId: session.user.id,
      },
    });

    return NextResponse.json(posting, { status: 201 });
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
