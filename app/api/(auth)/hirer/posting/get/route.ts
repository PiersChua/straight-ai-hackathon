import { ApiError } from "@/utils/errors";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
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

export const GET = async () => {
  try {
    const user = await getSessionUser();

    const postings = await prisma.posting.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        message: "Postings fetched successfully",
        postings,
      },
      { status: 200 },
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
};