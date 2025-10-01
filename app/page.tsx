// app/page.tsx
export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabaseServer';

export default async function Home() {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  // Se loggato → dashboard, altrimenti → login
  redirect(user ? '/dashboard' : '/login');
}