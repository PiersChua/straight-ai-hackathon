import { ApiError } from "@/utils/errors";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: RouteContext<"/api/recordings/[id]">,
) {
  try {
    const { id } = await params;
    const res = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversations/${id}/audio`,
      { headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY as string } },
    );

    if (!res.ok) {
      return NextResponse.json(
        { message: "Failed to fetch recording" },
        { status: res.status },
      );
    }

    // Stream the audio bytes directly back to the client
    const buffer = await res.arrayBuffer();
    return new NextResponse(buffer, {
      status: 200,
      headers: { "Content-Type": "audio/mpeg" },
    });
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
