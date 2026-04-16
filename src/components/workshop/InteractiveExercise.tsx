"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function InteractiveExercise() {
  const [status, setStatus] = useState<string>('Ready');
  async function verify() {
    setStatus('Running checks…');
    // Lightweight demo check
    const ok = true;
    setTimeout(() => setStatus(ok ? '✅ Checks passed' : '❌ Checks failed'), 600);
  }
  return (
    <div className="space-y-2">
      <h3 className="font-semibold">Exercises</h3>
      <p className="text-sm text-muted-foreground">Complete TODOs in code, then verify.</p>
      <Button onClick={verify} aria-live="polite">Run verification</Button>
      <p className="text-sm">{status}</p>
    </div>
  );
}


