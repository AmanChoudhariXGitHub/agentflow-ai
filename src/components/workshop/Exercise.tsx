import { ReactNode } from 'react';

export function Exercise({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-md border p-4 bg-background">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="mt-2 text-sm leading-relaxed space-y-2">{children}</div>
    </section>
  );
}


