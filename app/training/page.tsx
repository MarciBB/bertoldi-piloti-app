import BottomNav from '@/components/BottomNav';
import { supabaseServer } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';
export default async function Training() {
  const supabase = supabaseServer();
  const { data: modules } = await supabase.from('training_modules').select('*').order('created_at', { ascending: true });
  return (
    <main className="pb-16 p-4">
      <h1 className="text-xl font-semibold">Formazione</h1>
      <ul className="mt-4 space-y-2">
        {(modules || []).map((m:any)=>(
          <li key={m.id} className="p-3 border rounded">
            <p className="font-medium">{m.title}</p>
            <p className="text-sm text-gray-600">{m.content}</p>
          </li>
        ))}
        {(!modules || !modules.length) && <p>Nessun modulo ancora disponibile.</p>}
      </ul>
      <BottomNav/>
    </main>
  );
}
