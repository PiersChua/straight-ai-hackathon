import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/utils/errors";
import fs from "fs";
import path from "path";

export const POST = async (req: NextRequest) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session?.user?.id) {
      throw new ApiError("Unauthorized", 401);
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) throw new ApiError("No file uploaded", 400);

    if (file.type !== "application/pdf") {
      throw new ApiError("Only PDF allowed", 400);
    }

    if (file.size > 1024 * 1024) {
      throw new ApiError("Max file size is 1MB", 400);
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const fileName = `${session.user.id}.pdf`;
    const filePath = path.join(process.cwd(), "public/resumes", fileName);

    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, buffer);

    const resumeUrl = `/resumes/${fileName}`;

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        resumeUrl,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Error" },
      { status: 500 }
    );
  }
};