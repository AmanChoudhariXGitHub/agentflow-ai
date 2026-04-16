"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function TestButton({ label = 'Run Test', message }: { label?: string; message: string }) {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);
  function run() {
    setLoading(true);
    setTimeout(() => {
      setStatus(message);
      setLoading(false);
    }, 300);
  }
  return (
    <div className="space-y-2">
      <Button onClick={run} disabled={loading}>{loading ? 'Running…' : label}</Button>
      {status && <p className="text-sm" aria-live="polite">{status}</p>}
    </div>
  );
}


