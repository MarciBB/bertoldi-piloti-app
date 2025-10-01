export const dynamic = 'force-dynamic';

import BottomNav from '@/components/BottomNav';
import { supabaseServer } from '@/lib/supabaseServer';

export default async function Level() {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  // TS può inferire lvl.level come array: facciamo narrowing
  const { data: lvl } = await supabase
    .from('user_levels')
    .select('points, level:levels(name,benefits)')
    .eq('user_id', user?.id)
    .maybeSingle();

  // Se Supabase restituisce array per la relazione, prendi il primo elemento
  const levelObj: any = Array.isArray(lvl?.level) ? lvl?.level[0] : lvl?.level;
  const levelName = levelObj?.name ?? 'N/D';
  const benefits =
    Array.isArray(levelObj?.benefits) ? levelObj.benefits.join(', ') : '-';

  return (
    <main className="pb-16 p-4">
      <h1 className="text-xl font-semibold">Il tuo livello</h1>
      {lvl ? (
        <div className="mt-4 p-3 border rounded">
          <p className="font-medium">Livello: {levelName}</p>
          <p>Punti: {lvl.points}</p>
          <p className="text-sm text-gray-600">Benefit: {benefits}</p>
        </div>
      ) : (
        <p>Nessun livello assegnato.</p>
      )}
      <BottomNav/>
    </main>
  );
}