'use client';

import React from 'react';
import Link from 'next/link';
import { Play, Pause, Clock, ArrowRight, GitBranch, Terminal } from 'lucide-react';
import { Transformation } from './types';

const mockTransformations: Transformation[] = [
  {
    id: 'TR-8821',
    codebaseId: '1',
    codebaseName: 'acme-legacy-crm',
    playbookId: 'PB-101',
    playbookName: 'Frontend Consolidation (Angular -> React)',
    status: 'Execution',
    currentStep: 'Converting templates to JSX',
    progress: 45,
    startedAt: '2023-10-24 09:30',
    eta: '2h 15m'
  },
  {
    id: 'TR-8822',
    codebaseId: '2',
    codebaseName: 'inventory-system-v1',
    playbookId: 'PB-102',
    playbookName: 'Microservices Extraction',
    status: 'Approval',
    currentStep: 'Reviewing Service Boundaries',
    progress: 20,
    startedAt: '2023-10-23 14:00',
    eta: 'Paused for Review'
  },
  {
    id: 'TR-8815',
    codebaseId: '4',
    codebaseName: 'auth-service',
    playbookId: 'PB-203',
    playbookName: 'Auth Modernization',
    status: 'Completed',
    currentStep: 'Deployment Verification',
    progress: 100,
    startedAt: '2023-10-20 11:00',
    eta: 'Done'
  }
];

const Transformations: React.FC = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Execution': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'Approval': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'Completed': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'Failed': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'Paused': return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Active Transformations</h2>
          <p className="text-slate-400">Monitor and control autonomous refactoring agents.</p>
        </div>
        <Link
          href="/codeforge/playbooks"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Play className="w-4 h-4" />
          Start New Transformation
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {mockTransformations.map((transform) => (
          <div key={transform.id} className="bg-slate-800 rounded-xl border border-slate-700/50 p-6 hover:border-slate-600 transition-colors">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${
                  transform.status === 'Execution' ? 'bg-blue-500/10 text-blue-400 animate-pulse' :
                  transform.status === 'Completed' ? 'bg-green-500/10 text-green-400' :
                  'bg-slate-700 text-slate-400'
                }`}>
                  <Terminal className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{transform.playbookName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <GitBranch className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-400">{transform.codebaseName}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-sm text-slate-500 font-mono">{transform.id}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-2 ${getStatusColor(transform.status)}`}>
                  <div className={`w-2 h-2 rounded-full ${
                    transform.status === 'Execution' ? 'bg-blue-400 animate-pulse' :
                    transform.status === 'Completed' ? 'bg-green-400' : 'bg-yellow-400'
                  }`}></div>
                  {transform.status}
                </div>
                {transform.status === 'Approval' && (
                  <Link
                    href="/codeforge/analysis"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-900/20"
                  >
                    Review Changes
                  </Link>
                )}
                {transform.status === 'Execution' && (
                  <button className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                    <Pause className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300 font-medium">{transform.currentStep}</span>
                <span className="text-slate-400">{transform.progress}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    transform.status === 'Completed' ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${transform.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between text-xs text-slate-500 border-t border-slate-700/50 pt-4">
              <div className="flex gap-6">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Started: {transform.startedAt}
                </span>
                <span className="flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5" />
                  ETA: {transform.eta}
                </span>
              </div>
              <button className="text-blue-400 hover:text-blue-300 font-medium">View Logs</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Transformations;
