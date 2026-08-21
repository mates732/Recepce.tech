import { getSite } from "@/content/repository";

/**
 * Sociální odkazy a kontakty — spravované přes admin (site settings),
 * s fallbackem na environment proměnné a defaulty.
 */
const settings = getSite()?.settings;

export const SOCIALS = {
  youtube: settings?.social?.youtube?.trim() || process.env.NEXT_PUBLIC_YOUTUBE_URL || "",
  youtubeChannelId:
    settings?.social?.youtubeChannelId?.trim() || process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID || "",
  github: settings?.social?.github?.trim() || process.env.NEXT_PUBLIC_GITHUB_URL || "",
  email: settings?.contact?.email?.trim() || process.env.NEXT_PUBLIC_EMAIL || "vojanmatyas@gmail.com",
  instagram:
    settings?.social?.instagram?.trim() ||
    process.env.NEXT_PUBLIC_INSTAGRAM_URL ||
    "https://www.instagram.com/i_am_trenbolone/",
  phone: settings?.contact?.phone?.trim() || "+420 732 839 892",
};

export type Socials = typeof SOCIALS;
