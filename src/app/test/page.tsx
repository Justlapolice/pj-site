'use client';
import React from 'react';
import PageVierge from '@/components/ui/pagevierge';
import { usePathname } from 'next/navigation';

export default function Test() {
  const pathname = usePathname();
  return (
    <PageVierge>
      <h1>Test {pathname}</h1>
    </PageVierge>
  );
}
