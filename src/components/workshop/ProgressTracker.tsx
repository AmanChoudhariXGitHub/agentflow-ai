"use client";
import { useEffect, useState } from 'react';

export function ProgressTracker() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const saved = Number(localStorage.getItem('workshop-progress') || '0');
    setProgress(saved);
  }, []);
  return (
    <div className="p-4">
      <p className="text-sm text-muted-foreground">Workshop Progress</p>
      <div className="mt-2 h-2 w-full bg-muted rounded">
        <div className="h-2 bg-primary rounded" style={{ width: `${progress}%` }} />
      </div>
      <p className="text-xs mt-1" aria-live="polite">{progress}% complete</p>
    </div>
  );
}


