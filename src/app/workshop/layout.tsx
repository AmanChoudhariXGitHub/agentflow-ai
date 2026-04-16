'use client';

import { WorkshopLayout } from '@/components/layout/WorkshopLayout';

export default function WorkshopLayoutPage({ children }: { children: React.ReactNode }) {
  return (
    <WorkshopLayout>
      {children}
    </WorkshopLayout>
  );
}


