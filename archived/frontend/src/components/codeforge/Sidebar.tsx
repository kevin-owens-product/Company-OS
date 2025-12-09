'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  GitBranch,
  BookOpen,
  Zap,
  Settings,
  Activity,
  Layers
} from 'lucide-react';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/codeforge' },
  { id: 'ingestion', label: 'Codebases', icon: GitBranch, href: '/codeforge/codebases' },
  { id: 'analysis', label: 'Analysis Results', icon: Activity, href: '/codeforge/analysis' },
  { id: 'playbooks', label: 'Playbook Library', icon: BookOpen, href: '/codeforge/playbooks' },
  { id: 'transformations', label: 'Transformations', icon: Zap, href: '/codeforge/transformations' },
  { id: 'governance', label: 'Governance', icon: Layers, href: '/codeforge/governance' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/codeforge/settings' },
];

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/codeforge') {
      return pathname === '/codeforge' || pathname === '/codeforge/';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full fixed left-0 top-0">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">CodeForge</h1>
          <span className="text-xs text-slate-500 font-medium">ENTERPRISE</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                active
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-blue-400' : 'text-slate-500'}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-lg p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">
            JD
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white truncate">John Doe</p>
            <p className="text-xs text-slate-400 truncate">PE Operating Partner</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
