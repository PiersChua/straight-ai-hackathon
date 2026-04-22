import { ApiError } from "@/utils/errors";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

const getSessionUser = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new ApiError("Unauthorized", 401);
  }

  return session.user;
};

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    const { title, description, requirements, type, questions, isActive } =
      await req.json();

    const posting = await prisma.posting.create({
      data: {
        title,
        description,
        requirements: requirements || null,
        type,
        questions: Array.isArray(questions)
          ? questions.filter((q: string) => q.trim() !== "")
          : [],
        isActive: isActive ?? true,
        userId: user.id,
      },
    });

    return NextResponse.json(
      { message: "Posting created successfully", posting },
      { status: 201 },
    );
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