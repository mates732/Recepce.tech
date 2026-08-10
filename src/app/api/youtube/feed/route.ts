import { NextResponse } from "next/server";

const CACHE_TTL_MS = 10 * 60 * 1000;

const cache = new Map<string, { videos: unknown; expires: number }>();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const channelId = searchParams.get("channelId");

  if (!channelId || !/^UC[\w-]{22,24}$/.test(channelId)) {
    return NextResponse.json({ error: "Invalid channelId" }, { status: 400 });
  }

  const cached = cache.get(channelId);
  if (cached && Date.now() < cached.expires) {
    return NextResponse.json({ videos: cached.videos });
  }

  try {
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const res = await fetch(rssUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; Next.js)" },
    });

    if (!res.ok) {
      if (cached) {
        return NextResponse.json({ videos: cached.videos });
      }
      return NextResponse.json({ error: "Failed to fetch RSS feed" }, { status: 502 });
    }

    const xmlText = await res.text();

    const videos: { id: string; title: string; thumbnail: string; url: string; published: string }[] = [];

    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    let entryMatch;
    while ((entryMatch = entryRegex.exec(xmlText)) !== null) {
      const entry = entryMatch[1];
      const videoId = entry.match(/<yt:videoId[^>]*>([^<]+)<\/yt:videoId>/) || entry.match(/<videoId[^>]*>([^<]+)<\/videoId>/);
      const title = entry.match(/<title[^>]*>([^<]+)<\/title>/);
      const published = entry.match(/<published[^>]*>([^<]+)<\/published>/);
      const thumbnailMatch = entry.match(/<media:thumbnail[^>]*url="([^"]+)"/);

      if (videoId && title) {
        videos.push({
          id: videoId[1],
          title: title[1],
          thumbnail: thumbnailMatch?.[1] || `https://img.youtube.com/vi/${videoId[1]}/hqdefault.jpg`,
          url: `https://youtube.com/watch?v=${videoId[1]}`,
          published: published?.[1] || "",
        });
      }
    }

    cache.set(channelId, { videos, expires: Date.now() + CACHE_TTL_MS });
    return NextResponse.json({ videos });
  } catch {
    if (cached) {
      return NextResponse.json({ videos: cached.videos });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
