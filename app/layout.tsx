// app/layout.tsx
import '@/styles/globals.css'; // ✅ usa l’alias @ configurato in tsconfig
// oppure: import '../styles/globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bertoldi Piloti',
  description: 'Compiti giornalieri, formazione e turni per piloti'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}