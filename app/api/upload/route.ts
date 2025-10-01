import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const file = await req.blob();
  const arrayBuffer = await file.arrayBuffer();
  const path = `u/${user.id}/${Date.now()}-${randomUUID()}.jpg`;

  const { error } = await supabase.storage.from('uploads').upload(path, Buffer.from(arrayBuffer), {
    contentType: 'image/jpeg',
    upsert: false
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from('uploads').insert({ user_id: user.id, path });
  return NextResponse.json({ path });
}
