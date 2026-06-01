import fs from 'fs/promises';
import path from 'path';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { unstable_noStore as noStore } from 'next/cache';
import seedContent from '@/data/site-content.json';

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

type SiteContentRow = {
  id: string;
  content: SiteContent;
  updated_at?: string;
};

type SupabaseConfig = {
  key: string;
  url: string;
};

const filePath = path.join(process.cwd(), 'data', 'site-content.json');
const CONTENT_ROW_ID = 'site-content';
const CONTENT_TABLE = 'site_content';

function normalizeEventPhotos(value: unknown): EventPhotoItem[] {
  if (!Array.isArray(value)) return [];

  return value.reduce<EventPhotoItem[]>((items, item) => {
    if (typeof item === 'string') {
      items.push({ imageUrl: item, linkUrl: '', title: '' });
      return items;
    }

    if (!item || typeof item !== 'object') return items;

    const photo = item as Record<string, unknown>;
    const imageUrl = typeof photo.imageUrl === 'string' ? photo.imageUrl : '';
    if (!imageUrl) return items;

    items.push({
      imageUrl,
      linkUrl: typeof photo.linkUrl === 'string' ? photo.linkUrl : '',
      title: typeof photo.title === 'string' ? photo.title : ''
    });

    return items;
  }, []);
}

function normalizeContent(value: unknown): SiteContent {
  if (!value || typeof value !== 'object') {
    throw new Error('Site content payload is invalid');
  }

  const parsed = { ...(value as SiteContent) };
  parsed.eventPhotos = normalizeEventPhotos(parsed.eventPhotos);
  return parsed;
}

function getSupabaseUrl() {
  return process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
}

function getSupabaseKey() {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    ''
  );
}

function hasAnySupabaseEnv() {
  return Boolean(
    process.env.SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

function isReadOnlyDeployment() {
  return process.env.VERCEL === '1';
}

function getSupabaseConfig(): SupabaseConfig | null {
  const url = getSupabaseUrl();
  const key = getSupabaseKey();

  if (!url && !key) return null;

  if (!url) {
    throw new Error('Supabase URL is missing. Set SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL.');
  }

  if (!key) {
    throw new Error(
      'Supabase key is missing. Set SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY, or NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    );
  }

  return { url, key };
}

function createSupabaseAdminClient(): SupabaseClient | null {
  const config = getSupabaseConfig();

  if (!config) return null;

  return createClient(config.url, config.key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

async function getLocalContent(): Promise<SiteContent> {
  const raw = await fs.readFile(filePath, 'utf8');
  return normalizeContent(JSON.parse(raw));
}

async function saveLocalContent(content: SiteContent) {
  await fs.writeFile(filePath, JSON.stringify(content, null, 2), 'utf8');
}

export async function getContent(): Promise<SiteContent> {
  noStore();

  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return getLocalContent();
  }

  const { data, error } = await supabase
    .from(CONTENT_TABLE)
    .select('content')
    .eq('id', CONTENT_ROW_ID)
    .maybeSingle<Pick<SiteContentRow, 'content'>>();

  if (error) {
    throw new Error(`Failed to load site content from Supabase: ${error.message}`);
  }

  if (!data?.content) {
    return normalizeContent(seedContent);
  }

  return normalizeContent(data.content);
}

export async function saveContent(content: SiteContent) {
  const normalizedContent = normalizeContent(content);
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    if (isReadOnlyDeployment() || hasAnySupabaseEnv()) {
      throw new Error(
        'Supabase is not fully configured for writes. Check SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY.'
      );
    }

    await saveLocalContent(normalizedContent);
    return;
  }

  const { error } = await supabase.from(CONTENT_TABLE).upsert(
    {
      id: CONTENT_ROW_ID,
      content: normalizedContent,
      updated_at: new Date().toISOString()
    } satisfies SiteContentRow,
    { onConflict: 'id' }
  );

  if (error) {
    throw new Error(`Failed to save site content to Supabase: ${error.message}`);
  }
}
