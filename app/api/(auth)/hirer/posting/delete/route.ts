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

export async function DELETE(req: NextRequest) {
  try {
    const user = await getSessionUser();
    const { id } = await req.json();

    const existingPosting = await prisma.posting.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingPosting) {
      throw new ApiError("Posting not found", 404);
    }

    await prisma.posting.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        message: "Posting deleted successfully",
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
}