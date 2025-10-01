import BottomNav from '@/components/BottomNav';
import { supabaseServer } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';
export default async function Onboarding() {
  const supabase = supabaseServer();
  const { data: items } = await supabase.from('onboarding_items').select('*').order('created_at', { ascending: true });
  return (
    <main className="pb-16 p-4">
      <h1 className="text-xl font-semibold">Onboarding</h1>
      <ul className="mt-4 space-y-2">
        {(items || []).map((it:any)=>(
          <li key={it.id} className="p-3 border rounded">
            <p className="font-medium">{it.title}</p>
            <p className="text-sm text-gray-600">{it.content}</p>
          </li>
        ))}
        {(!items || !items.length) && <p>Nessun elemento di onboarding ancora disponibile.</p>}
      </ul>
      <BottomNav/>
    </main>
  );
}
