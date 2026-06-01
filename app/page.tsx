import { getContent } from '@/lib/content';
import EventClient from './event-client';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const content = await getContent();
  return <EventClient content={content} />;
}
