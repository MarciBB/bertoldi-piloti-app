import { supabaseServer } from '@/lib/supabaseServer';
import StepCard from '@/components/StepCard';
import BottomNav from '@/components/BottomNav';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';
export default async function BoatPage() {
  const supabase = supabaseServer();
  const { data: templates } = await supabase
    .from('form_templates')
    .select('id,key,name,frequency,schema_json')
    .eq('active', true);

  async function submit(values: Record<string, any>, templateId: string) {
    'use server';
    const supa = supabaseServer();
    const { data: { user } } = await supa.auth.getUser();
    const period_date = new Date().toISOString().slice(0,10);
    await supa.from('form_submissions').insert({
      template_id: templateId,
      user_id: user!.id,
      period_date,
      data: values
    });
    revalidatePath('/boat');
  }

  return (
    <main className="pb-16 p-4">
      <h1 className="text-xl font-semibold">La tua barca</h1>
      <section className="mt-6 space-y-4">
        {(templates || []).map((t:any) => {
          const fields = (t.schema_json?.fields || []) as any[];
          return (
            <StepCard key={t.id}
              template={{ id: t.id, name: t.name, fields: fields.map(f => ({ id:f.id, label:f.label, type:f.type })) }}
              onSubmit={(vals)=>submit(vals, t.id)}
            />
          );
        })}
        {(!templates || !templates.length) && <p>Nessun template configurato.</p>}
      </section>
      <BottomNav/>
    </main>
  );
}
