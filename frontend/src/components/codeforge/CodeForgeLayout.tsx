'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Settings as SettingsIcon } from 'lucide-react';
import Link from 'next/link';
import Sidebar from './Sidebar';
import AIAssistant from './AIAssistant';

interface CodeForgeLayoutProps {
  children: React.ReactNode;
}

const getPageTitle = (pathname: string): string => {
  if (pathname === '/codeforge' || pathname === '/codeforge/') return 'Overview';
  if (pathname.includes('/codebases')) return 'Codebases';
  if (pathname.includes('/analysis')) return 'Analysis Results';
  if (pathname.includes('/playbooks')) return 'Playbook Library';
  if (pathname.includes('/transformations')) return 'Transformations';
  if (pathname.includes('/governance')) return 'Governance';
  if (pathname.includes('/settings')) return 'Settings';
  return 'CodeForge';
};

const CodeForgeLayout: React.FC<CodeForgeLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <div className="codeforge-app min-h-screen bg-slate-900 flex text-slate-100">
      <Sidebar />

      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-slate-400 text-sm font-medium mb-1">{pageTitle}</h2>
            <div className="h-1 w-12 bg-blue-600 rounded-full"></div>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-3 py-1 bg-slate-800 rounded-full border border-slate-700 text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              System Operational
            </div>
            <Link
              href="/codeforge/settings"
              className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800"
            >
              <SettingsIcon className="w-5 h-5" />
            </Link>
          </div>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-4">
          {children}
        </div>
      </main>

      <AIAssistant />
    </div>
  );
};

export default CodeForgeLayout;
