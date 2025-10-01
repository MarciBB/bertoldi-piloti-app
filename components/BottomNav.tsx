'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/dashboard', label: 'Home' },
  { href: '/boat', label: 'La tua barca' },
  { href: '/training', label: 'Formazione' },
  { href: '/shifts', label: 'Turni' },
  { href: '/level', label: 'Livello' },
];

export default function BottomNav() {
  const path = usePathname();
  return (
    <nav className="fixed bottom-0 inset-x-0 border-t bg-white/95 backdrop-blur">
      <ul className="grid grid-cols-5 text-sm">
        {tabs.map(t => (
          <li key={t.href} className="text-center">
            <Link href={t.href} className={`block py-2 ${path.startsWith(t.href) ? 'font-semibold' : ''}`}>
              {t.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
