import "server-only";

export interface YoutubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  published: string;
}

export class YoutubeFeedError extends Error {}

const CHANNEL_ID_PATTERN = /^UC[\w-]{22,24}$/;
const CACHE_TTL_MS = 10 * 60 * 1000;

const cache = new Map<string, { videos: YoutubeVideo[]; expires: number }>();

export function isValidChannelId(channelId: string): boolean {
  return CHANNEL_ID_PATTERN.test(channelId);
}

function parseRssFeed(xmlText: string): YoutubeVideo[] {
  const videos: YoutubeVideo[] = [];

  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let entryMatch;
  while ((entryMatch = entryRegex.exec(xmlText)) !== null) {
    const entry = entryMatch[1];
    const videoId =
      entry.match(/<yt:videoId[^>]*>([^<]+)<\/yt:videoId>/) ||
      entry.match(/<videoId[^>]*>([^<]+)<\/videoId>/);
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

  return videos;
}

async function fetchAndParse(channelId: string): Promise<YoutubeVideo[]> {
  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  const res = await fetch(rssUrl, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; Next.js)" },
  });

  if (!res.ok) {
    throw new YoutubeFeedError("Failed to fetch RSS feed");
  }

  return parseRssFeed(await res.text());
}

/**
 * Vrací videa kanálu. Při výpadku zdroje vrací poslední známá data (stale cache),
 * pokud žádná nejsou, vyhazuje chybu.
 */
export async function getLatestVideos(channelId: string): Promise<YoutubeVideo[]> {
  const cached = cache.get(channelId);
  if (cached && Date.now() < cached.expires) {
    return cached.videos;
  }

  try {
    const videos = await fetchAndParse(channelId);
    cache.set(channelId, { videos, expires: Date.now() + CACHE_TTL_MS });
    return videos;
  } catch (error) {
    if (cached) return cached.videos;
    throw error;
  }
}
