# Bertoldi Boats – Piloti App (PWA-ready)

Stack: **Next.js 14 (App Router) + TypeScript + Tailwind + Supabase (Auth/DB/Storage)**

## Setup locale
```bash
pnpm i # oppure npm i / yarn
cp .env.example .env.local
# Inserisci SUPABASE_URL e ANON_KEY
pnpm dev
```

## Deploy su Vercel (consigliato)
1) Crea un nuovo progetto su **Vercel** collegando il repo.
2) Imposta variabili su *Settings → Environment Variables*:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3) Build & Deploy con preset **Next.js** (nessuna modifica necessaria).
4) (Opzionale) Custom Domain.

## Supabase
- Crea progetto → copia URL e ANON KEY.
- In *SQL Editor* incolla lo schema in `supabase/schema.sql`.
- In *Storage* crea bucket `uploads` (Authenticated access).

## Note sicurezza
- RLS attive su tabelle chiave (profiles, submissions, uploads…).
- Upload immagini → bucket privato + record in `uploads`.

## Struttura
- `app/` pagine e API (route handlers).
- `lib/` helper (supabase, auth guard).
- `components/` UI riutilizzabili.
- `supabase/schema.sql` schema completo.
