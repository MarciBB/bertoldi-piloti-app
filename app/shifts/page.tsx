import BottomNav from '@/components/BottomNav';
import { supabaseServer } from '@/lib/supabaseServer';

export default async function Shifts() {
  const supabase = supabaseServer();
  const { data: items } = await supabase.from('shifts').select('*').order('week_start', { ascending: false }).limit(4);
  return (
    <main className="pb-16 p-4">
      <h1 className="text-xl font-semibold">Turni</h1>
      <div className="mt-4 space-y-3">
        {(items || []).map((it:any)=>(
          <div key={it.id} className="p-3 border rounded">
            <p className="font-medium">Settimana dal {it.week_start}</p>
            <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">{JSON.stringify(it.data, null, 2)}</pre>
          </div>
        ))}
        {(!items || !items.length) && <p>Nessun turno pubblicato.</p>}
      </div>
      <BottomNav/>
    </main>
  );
}
