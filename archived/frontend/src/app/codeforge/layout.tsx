'use client';

import React from 'react';
import { CodeForgeLayout } from '@/components/codeforge';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <CodeForgeLayout>{children}</CodeForgeLayout>;
}
