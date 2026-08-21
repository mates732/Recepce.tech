import { NextResponse } from "next/server";
import { getLatestVideos, isValidChannelId, YoutubeFeedError } from "@/services/youtube";
import { rateLimit, clientIp } from "@/lib/rateLimit";

const RATE_LIMIT_MAX = 30;
const RATE_LIMIT_WINDOW = 60_000;

export async function GET(request: Request) {
  const ip = clientIp(request);
  if (!rateLimit(`youtube:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW)) {
    return NextResponse.json({ error: "rate limited" }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const channelId = searchParams.get("channelId");

  if (!channelId || !isValidChannelId(channelId)) {
    return NextResponse.json({ error: "Invalid channelId" }, { status: 400 });
  }

  try {
    const videos = await getLatestVideos(channelId);
    return NextResponse.json({ videos });
  } catch (error) {
    if (error instanceof YoutubeFeedError) {
      return NextResponse.json({ error: "Failed to fetch RSS feed" }, { status: 502 });
    }
    console.error("YouTube feed error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
