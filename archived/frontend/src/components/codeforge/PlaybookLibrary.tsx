'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Code, ShieldCheck, DollarSign, ArrowRight } from 'lucide-react';
import { Playbook } from './types';

const playbooks: Playbook[] = [
  {
    id: 'PB-101',
    category: 'Consolidation',
    title: 'Frontend Consolidation',
    description: 'Standardize legacy frontend frameworks (AngularJS, jQuery, Vue 2) to React 18 with TypeScript. Automated component translation.',
    code: 'PB-101'
  },
  {
    id: 'PB-102',
    category: 'Consolidation',
    title: 'Backend Modernization',
    description: 'Rationalize monolithic backends into domain-driven microservices. Supports Java Spring, .NET, and PHP conversions to Go/Node.js.',
    code: 'PB-102'
  },
  {
    id: 'PB-201',
    category: 'Security',
    title: 'Dependency Audit & Hardening',
    description: 'Identify and upgrade vulnerable dependencies. Implement automated SBOM generation and lockfile analysis.',
    code: 'PB-201'
  },
  {
    id: 'PB-203',
    category: 'Security',
    title: 'Auth Modernization',
    description: 'Replace custom authentication with OIDC/OAuth2 providers (Auth0, Okta). Implement MFA and session management best practices.',
    code: 'PB-203'
  },
  {
    id: 'PB-301',
    category: 'Cost',
    title: 'Dead Code Removal',
    description: 'Advanced static and dynamic analysis to identify and safely remove unused code paths, reducing build times and maintenance.',
    code: 'PB-301'
  },
  {
    id: 'PB-501',
    category: 'Compliance',
    title: 'SOC2 Readiness',
    description: 'Implement comprehensive audit logging, access controls, and encryption at rest to meet SOC2 Type II requirements.',
    code: 'PB-501'
  }
];

const PlaybookLibrary: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Consolidation', 'Security', 'Cost', 'Compliance'];

  const filteredPlaybooks = activeFilter === 'All'
    ? playbooks
    : playbooks.filter(pb => pb.category === activeFilter);

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'Consolidation':
        return 'bg-blue-500/10 text-blue-400';
      case 'Security':
        return 'bg-red-500/10 text-red-400';
      case 'Cost':
        return 'bg-green-500/10 text-green-400';
      case 'Compliance':
        return 'bg-purple-500/10 text-purple-400';
      default:
        return 'bg-slate-500/10 text-slate-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Consolidation':
        return <Code className="w-6 h-6" />;
      case 'Security':
        return <ShieldCheck className="w-6 h-6" />;
      case 'Cost':
        return <DollarSign className="w-6 h-6" />;
      case 'Compliance':
        return <ShieldCheck className="w-6 h-6" />;
      default:
        return <Code className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Playbook Library</h2>
        <p className="text-slate-400 mt-1">Industry-proven transformation patterns, powered by autonomous agents.</p>
      </div>

      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === activeFilter
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlaybooks.map((pb) => (
          <div key={pb.id} className="group bg-slate-800 rounded-xl border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/10 flex flex-col h-full">
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${getCategoryStyles(pb.category)}`}>
                  {getCategoryIcon(pb.category)}
                </div>
                <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-700">{pb.code}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{pb.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{pb.description}</p>
            </div>
            <div className="p-6 pt-0 mt-auto">
              <Link
                href="/codeforge/transformations"
                className="w-full py-2.5 flex items-center justify-center gap-2 rounded-lg bg-slate-700/50 hover:bg-blue-600 hover:text-white text-slate-300 text-sm font-medium transition-colors group-hover:bg-blue-600 group-hover:text-white"
              >
                Select Playbook
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaybookLibrary;
