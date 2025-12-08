'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Github, Upload, FolderPlus, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { Codebase } from './types';

const initialCodebases: Codebase[] = [
  { id: '1', name: 'acme-legacy-crm', source: 'GitHub', status: 'Ready', lastScan: '2h ago', riskScore: 78, language: 'Java' },
  { id: '2', name: 'inventory-system-v1', source: 'GitLab', status: 'Analyzing', lastScan: 'Just now', riskScore: 0, language: 'PHP' },
  { id: '3', name: 'unversioned-billing', source: 'Upload', status: 'Error', lastScan: '1d ago', riskScore: 92, language: 'VB.NET' },
  { id: '4', name: 'frontend-angular-js', source: 'GitHub', status: 'Ready', lastScan: '5h ago', riskScore: 65, language: 'JavaScript' },
];

const GitlabIcon = () => (
  <svg className="w-5 h-5 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z"/>
  </svg>
);

const Ingestion: React.FC = () => {
  const [codebases, setCodebases] = useState<Codebase[]>(initialCodebases);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddCodebase = () => {
    setIsAdding(true);
    setTimeout(() => {
      const newCodebase: Codebase = {
        id: Date.now().toString(),
        name: `legacy-service-${Math.floor(Math.random() * 100)}`,
        source: 'GitHub',
        status: 'Analyzing',
        lastScan: 'Pending',
        riskScore: 0,
        language: 'Unknown'
      };
      setCodebases(prev => [newCodebase, ...prev]);
      setIsAdding(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Code Ingestion</h2>
          <p className="text-slate-400">Manage connected repositories and upload legacy archives.</p>
        </div>
        <button
          onClick={handleAddCodebase}
          disabled={isAdding}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
        >
          {isAdding ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FolderPlus className="w-4 h-4" />}
          {isAdding ? 'Connecting...' : 'Add Codebase'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 space-y-4">
          {/* Connection Cards */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700/50">
            <h3 className="text-white font-semibold mb-4">Integrations</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors group">
                <div className="flex items-center gap-3">
                  <Github className="w-5 h-5 text-white" />
                  <span className="text-slate-200">GitHub</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors group">
                <div className="flex items-center gap-3">
                  <GitlabIcon />
                  <span className="text-slate-200">GitLab</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-slate-600"></div>
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors group">
                <div className="flex items-center gap-3">
                  <Upload className="w-5 h-5 text-blue-400" />
                  <span className="text-slate-200">Direct Upload</span>
                </div>
                <span className="text-xs text-slate-500 group-hover:text-slate-400">ZIP, TAR</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700/50">
            <h3 className="text-white font-semibold mb-2">Ingestion Stats</h3>
            <div className="space-y-4 mt-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Total Lines of Code</span>
                <span className="text-white font-mono">1.4M</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Repositories</span>
                <span className="text-white font-mono">{codebases.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Storage Used</span>
                <span className="text-white font-mono">4.2 GB</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2">
          <div className="bg-slate-800 rounded-xl border border-slate-700/50 overflow-hidden">
            <div className="p-6 border-b border-slate-700/50">
              <h3 className="text-lg font-semibold text-white">Active Repositories</h3>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Source</th>
                  <th className="px-6 py-4 font-medium">Language</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {codebases.map((repo) => (
                  <tr key={repo.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{repo.name}</div>
                      <div className="text-xs text-slate-500 mt-1">Last scan: {repo.lastScan}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-300 text-sm">
                        {repo.source === 'GitHub' && <Github className="w-4 h-4" />}
                        {repo.source === 'GitLab' && <GitlabIcon />}
                        {repo.source === 'Upload' && <Upload className="w-4 h-4 text-blue-400" />}
                        {repo.source}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-slate-300">
                        {repo.language}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {repo.status === 'Ready' && (
                        <span className="flex items-center gap-1.5 text-green-400 text-sm font-medium">
                          <CheckCircle className="w-4 h-4" /> Ready
                        </span>
                      )}
                      {repo.status === 'Analyzing' && (
                        <span className="flex items-center gap-1.5 text-blue-400 text-sm font-medium">
                          <RefreshCw className="w-4 h-4 animate-spin" /> Analyzing
                        </span>
                      )}
                      {repo.status === 'Error' && (
                        <span className="flex items-center gap-1.5 text-red-400 text-sm font-medium">
                          <AlertTriangle className="w-4 h-4" /> Failed
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href="/codeforge/analysis"
                        className="text-slate-400 hover:text-white text-sm font-medium hover:underline"
                      >
                        Configure
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ingestion;
