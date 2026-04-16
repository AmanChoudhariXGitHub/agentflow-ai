import Link from 'next/link';

export function StepNavigation({ steps }: { steps: Array<{ slug: string; title: string }> }) {
  return (
    <nav className="p-4 space-y-2" aria-label="Workshop steps">
      {steps.map((s, i) => (
        <Link key={s.slug} href={`/workshop/${s.slug}`} className="block rounded px-2 py-1 hover:bg-muted">
          <span className="text-sm">{String(i + 1).padStart(2, '0')}.</span> <span className="ml-2">{s.title}</span>
        </Link>
      ))}
    </nav>
  );
}


