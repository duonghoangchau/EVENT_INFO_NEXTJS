import fs from 'fs/promises';
import path from 'path';

export type EventPhotoItem = {
  imageUrl: string;
  linkUrl?: string;
  title?: string;
};

export type SiteContent = {
  [key: string]: any;
  siteTitle: string;
  logoUrl: string;
  zaloUrl: string;
  zaloImageUrl: string;
  bannerImageUrl: string;
  bannerTitle: string;
  bannerSubtitle: string;
  letterTitle: string;
  leaderImageUrl: string;
  letterHtml: string;
  eventName: string;
  eventTime: string;
  eventDateISO: string;
  eventLocation: string;
  eventMapUrl: string;
  rewardTitle1: string;
  rewardTitle2: string;
  rewardDesc: string;
  rewardAlert: string;
  carousel1Title: string;
  carousel1Images: string[];
  journeyTitleTop: string;
  journeyTitleBottom: string;
  journey: Record<string, string[]>;
  memoryTitle: string;
  memoryCaption: string;
  memoryImages: string[];
  eventPhotosTitle: string;
  eventPhotos: EventPhotoItem[];
  footerCompany: string;
  footerUrl: string;
};

const filePath = path.join(process.cwd(), 'data', 'site-content.json');

function normalizeEventPhotos(value: unknown): EventPhotoItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (typeof item === 'string') return { imageUrl: item, linkUrl: '', title: '' };
      if (!item || typeof item !== 'object') return null;

      const photo = item as Record<string, unknown>;
      const imageUrl = typeof photo.imageUrl === 'string' ? photo.imageUrl : '';
      if (!imageUrl) return null;

      return {
        imageUrl,
        linkUrl: typeof photo.linkUrl === 'string' ? photo.linkUrl : '',
        title: typeof photo.title === 'string' ? photo.title : ''
      };
    })
    .filter((item): item is EventPhotoItem => Boolean(item));
}

export async function getContent(): Promise<SiteContent> {
  const raw = await fs.readFile(filePath, 'utf8');
  const parsed = JSON.parse(raw);
  parsed.eventPhotos = normalizeEventPhotos(parsed.eventPhotos);
  return parsed;
}

export async function saveContent(content: SiteContent) {
  await fs.writeFile(filePath, JSON.stringify(content, null, 2), 'utf8');
}
