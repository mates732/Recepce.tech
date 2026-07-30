export const SOCIALS = {
  youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL ?? "",
  youtubeChannelId: process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID ?? "",
  github: process.env.NEXT_PUBLIC_GITHUB_URL ?? "",
  email: process.env.NEXT_PUBLIC_EMAIL ?? "vojanmatyas@gmail.com",
};

export type Socials = typeof SOCIALS;
