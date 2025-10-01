'use client';
import { useState } from 'react';

type Field = { id: string; label: string; type: 'text'|'number'|'boolean' };
export default function StepCard({ template, onSubmit }:{ template:{id:string; name:string; fields:Field[]}, onSubmit:(payload:any)=>Promise<void> }) {
  const [values, setValues] = useState<Record<string, any>>({});
  const [busy, setBusy] = useState(false);

  const handle = (id:string, v:any) => setValues(prev=>({...prev,[id]:v}));

  const submit = async () => {
    setBusy(true);
    await onSubmit(values);
    setBusy(false);
    alert('Inviato');
  };

  return (
    <div className="p-4 border rounded space-y-3">
      <h3 className="font-semibold">{template.name}</h3>
      {template.fields.map(f => (
        <div key={f.id} className="space-y-1">
          <label className="text-sm">{f.label}</label>
          {f.type === 'text' && <input className="w-full border rounded p-2" onChange={e=>handle(f.id, e.target.value)} />}
          {f.type === 'number' && <input type="number" className="w-full border rounded p-2" onChange={e=>handle(f.id, Number(e.target.value))} />}
          {f.type === 'boolean' && (
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" onChange={e=>handle(f.id, e.target.checked)} />
              <span>Si</span>
            </label>
          )}
        </div>
      ))}
      <button disabled={busy} onClick={submit} className="btn-primary">{busy ? '...' : 'Invia'}</button>
    </div>
  );
}
