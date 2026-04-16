"use client";
import { ReactNode } from 'react';

export function Hint({ title = 'Hint', children }: { title?: string; children: ReactNode }) {
  return (
    <details className="rounded border bg-muted/40 p-3">
      <summary className="cursor-pointer select-none font-medium">{title}</summary>
      <div className="mt-2 text-sm leading-relaxed">{children}</div>
    </details>
  );
}


