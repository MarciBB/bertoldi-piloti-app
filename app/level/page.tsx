import BottomNav from '@/components/BottomNav';
import { supabaseServer } from '@/lib/supabaseServer';

export default async function Level() {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: lvl } = await supabase.from('user_levels').select('points, level:levels(name,benefits)').eq('user_id', user?.id).maybeSingle();
  return (
    <main className="pb-16 p-4">
      <h1 className="text-xl font-semibold">Il tuo livello</h1>
      {lvl ? (
        <div className="mt-4 p-3 border rounded">
          <p className="font-medium">Livello: {lvl.level?.name ?? 'N/D'}</p>
          <p>Punti: {lvl.points}</p>
          <p className="text-sm text-gray-600">Benefit: {Array.isArray(lvl.level?.benefits) ? lvl.level.benefits.join(', ') : '-'}</p>
        </div>
      ) : <p>Nessun livello assegnato.</p>}
      <BottomNav/>
    </main>
  );
}
