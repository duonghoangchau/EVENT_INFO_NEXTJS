import { redirect } from 'next/navigation';
import { isLoggedIn } from '@/lib/auth';
import { getContent } from '@/lib/content';
import AdminEditor from './admin-editor';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  if (!(await isLoggedIn())) redirect('/admin/login');
  const content = await getContent();
  return <AdminEditor initial={content} />;
}
