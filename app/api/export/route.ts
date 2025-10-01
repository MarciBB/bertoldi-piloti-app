import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { stringify } from 'csv-stringify/sync';
import archiver from 'archiver';
import { PassThrough } from 'stream';

export async function GET(req: NextRequest) {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const url = new URL(req.url);
  const templateKey = url.searchParams.get('template') ?? '';
  const from = url.searchParams.get('from') ?? '1900-01-01';
  const to = url.searchParams.get('to') ?? '2999-12-31';

  const { data: rows, error } = await supabase
    .from('form_submissions')
    .select('id, period_date, data, created_at, templates:form_templates(key,name), user:profiles(email)')
    .gte('period_date', from)
    .lte('period_date', to)
    .filter('templates.key', 'eq', templateKey);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const csv = stringify(
    (rows ?? []).map((r: any) => ({
      id: r.id,
      template_key: r.templates?.key,
      template_name: r.templates?.name,
      period_date: r.period_date,
      created_at: r.created_at,
      user_email: r.user?.email,
      ...flattenJson(r.data)
    })),
    { header: true }
  );

  const zipStream = new PassThrough();
  const archive = archiver('zip');
  archive.pipe(zipStream);
  archive.append(csv, { name: `submissions_${templateKey}_${from}_${to}.csv` });
  archive.finalize();

  return new NextResponse(zipStream as any, {
    status: 200,
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="export_${templateKey}_${from}_${to}.zip"`
    }
  });
}

function flattenJson(obj: any, prefix = ''): any {
  const out: any = {};
  for (const [k,v] of Object.entries(obj || {})) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) Object.assign(out, flattenJson(v, key));
    else out[key] = Array.isArray(v) ? v.join('|') : v;
  }
  return out;
}
