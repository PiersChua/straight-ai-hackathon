import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/utils/errors";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY!;
const ELEVENLABS_AGENT_ID = process.env.ELEVENLABS_AGENT_ID!;

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new ApiError("Unauthorized", 401);

    const { postingId } = await req.json();
    const userId = session.user.id;

    const interview = await prisma.interview.create({
      data: { postingId, userId },
    });
    const signedRes = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${ELEVENLABS_AGENT_ID}`,
      { headers: { "xi-api-key": ELEVENLABS_API_KEY } },
    );

    if (!signedRes.ok) throw new Error("Failed to get ElevenLabs signed URL");

    const { signed_url } = await signedRes.json();

    return NextResponse.json({
      interviewId: interview.id,
      signedUrl: signed_url,
    });
  } catch (error) {
    if (error instanceof ApiError)
      return NextResponse.json(
        { message: error.message },
        { status: error.status },
      );
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 500 });
    return NextResponse.json({ message: "Unknown error" }, { status: 500 });
  }
}
