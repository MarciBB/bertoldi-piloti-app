import BottomNav from '@/components/BottomNav';
import { supabaseServer } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';
export default async function Dashboard() {
  const supabase = supabaseServer();
  const [{ data: news }] = await Promise.all([
    supabase.from('news').select('*').order('published_at', { ascending: false }).limit(5)
  ]);

  return (
    <main className="pb-16 p-4">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <section className="mt-4">
        <h2 className="font-medium">Aggiornamenti</h2>
        <ul className="mt-2 divide-y">
          {(news || []).map((n: any) => (
            <li key={n.id} className="py-3">
              <p className="font-medium">{n.title}</p>
              <p className="text-sm text-gray-600">{n.body}</p>
            </li>
          ))}
          {(!news || !news.length) && <p className="text-gray-600">Nessuna news al momento.</p>}
        </ul>
      </section>
      <BottomNav />
    </main>
  );
}
