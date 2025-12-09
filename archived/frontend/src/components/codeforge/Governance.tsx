'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Check, AlertCircle, ExternalLink, Globe, Database } from 'lucide-react';
import { ComplianceStandard } from './types';

const mockStandards: ComplianceStandard[] = [
  {
    id: 'SOC2',
    name: 'SOC 2 Type II',
    status: 'At Risk',
    score: 85,
    lastAudit: '2023-09-15',
    controlsPassing: 85,
    controlsTotal: 100
  },
  {
    id: 'GDPR',
    name: 'GDPR',
    status: 'Compliant',
    score: 98,
    lastAudit: '2023-10-01',
    controlsPassing: 49,
    controlsTotal: 50
  },
  {
    id: 'PCI',
    name: 'PCI DSS v4.0',
    status: 'Non-Compliant',
    score: 62,
    lastAudit: '2023-08-20',
    controlsPassing: 31,
    controlsTotal: 50
  }
];

const mockPolicies = [
  { id: 1, name: 'No Hardcoded Secrets', status: 'Passed', scope: 'All Repos' },
  { id: 2, name: 'Branch Protection Enabled', status: 'Failed', scope: '2/5 Repos' },
  { id: 3, name: 'Require MFA for Production', status: 'Passed', scope: 'Global' },
  { id: 4, name: 'Dependency Vulnerability Scan', status: 'Passed', scope: 'All Repos' },
  { id: 5, name: 'Data Encryption at Rest', status: 'Warning', scope: 'Legacy DB' },
];

const Governance: React.FC = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Compliant': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'At Risk': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'Non-Compliant': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Governance & Compliance</h2>
        <p className="text-slate-400">Manage compliance frameworks and enforce security policies.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {mockStandards.map((std) => (
          <div key={std.id} className="bg-slate-800 rounded-xl border border-slate-700/50 p-6 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-700 rounded-lg">
                  <Shield className="w-6 h-6 text-slate-300" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{std.name}</h3>
                  <span className="text-xs text-slate-500">Last audit: {std.lastAudit}</span>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(std.status)}`}>
                {std.status}
              </span>
            </div>

            <div className="flex items-end justify-between mb-2">
              <span className="text-3xl font-bold text-white">{std.score}%</span>
              <span className="text-sm text-slate-400 mb-1">{std.controlsPassing}/{std.controlsTotal} Controls</span>
            </div>

            <div className="w-full bg-slate-900 rounded-full h-2 mb-6">
              <div
                className={`h-2 rounded-full ${
                  std.score > 90 ? 'bg-green-500' : std.score > 70 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${std.score}%` }}
              ></div>
            </div>

            <Link
              href="/codeforge/analysis"
              className="mt-auto w-full py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              View Gaps
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-xl border border-slate-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Automated Policy Checks</h3>
          <div className="space-y-4">
            {mockPolicies.map((policy) => (
              <div key={policy.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30 border border-slate-700/50">
                <div className="flex items-center gap-3">
                  {policy.status === 'Passed' && <Check className="w-5 h-5 text-green-500" />}
                  {policy.status === 'Failed' && <AlertCircle className="w-5 h-5 text-red-500" />}
                  {policy.status === 'Warning' && <AlertCircle className="w-5 h-5 text-yellow-500" />}
                  <span className="text-sm text-slate-200">{policy.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-500">{policy.scope}</span>
                  <button className="text-blue-400 hover:text-white text-xs font-medium">Configure</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Data Residency Map</h3>
          <div className="bg-slate-900/50 rounded-lg h-64 flex items-center justify-center border border-slate-700/50 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <Globe className="w-48 h-48 text-blue-500" />
            </div>
            <div className="text-center relative z-10">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 mb-2 ring-4 ring-blue-500/5">
                <Database className="w-6 h-6" />
              </div>
              <h4 className="text-white font-medium">US-East-1</h4>
              <p className="text-xs text-slate-400">Primary Data Store</p>
            </div>
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div> Active Region
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <div className="w-2 h-2 rounded-full bg-slate-600"></div> Disabled
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-400 text-center">
            All data processing is restricted to US regions per SOC2 requirements.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Governance;
