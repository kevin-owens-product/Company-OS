'use client';

import React, { useState } from 'react';
import { ShieldAlert, AlertCircle, AlertTriangle, CheckCircle2, FileCode, ChevronDown, ChevronRight, RefreshCw, Wand2, Filter } from 'lucide-react';
import { Finding } from './types';

const mockFindings: Finding[] = [
  {
    id: 'F-1023',
    severity: 'Critical',
    type: 'Security',
    title: 'Hardcoded AWS Credentials',
    description: 'Detected AWS access key ID and secret access key hardcoded in the source code. This poses a severe security risk.',
    file: 'src/services/aws-config.js',
    line: 14,
    remediation: 'Move credentials to environment variables or use AWS Secrets Manager.',
    status: 'Open'
  },
  {
    id: 'F-1024',
    severity: 'High',
    type: 'Security',
    title: 'SQL Injection Vulnerability',
    description: 'Unsanitized user input concatenated directly into SQL query string.',
    file: 'src/db/user-repository.ts',
    line: 89,
    remediation: 'Use parameterized queries or an ORM to handle input sanitization.',
    status: 'Open'
  },
  {
    id: 'F-1045',
    severity: 'Medium',
    type: 'TechDebt',
    title: 'Deprecated AngularJS Component',
    description: 'Legacy AngularJS controller found mixed with React components. Prevents build optimization.',
    file: 'src/legacy/user-controller.js',
    line: 1,
    remediation: 'Rewrite component using React functional component pattern.',
    status: 'Open'
  },
  {
    id: 'F-1056',
    severity: 'Low',
    type: 'Reliability',
    title: 'Missing Error Handling',
    description: 'Promise rejection not handled in API call chain.',
    file: 'src/api/checkout.ts',
    line: 45,
    remediation: 'Add try/catch block or .catch() handler.',
    status: 'Resolved'
  },
  {
    id: 'F-1099',
    severity: 'High',
    type: 'Compliance',
    title: 'PII Logged in Plaintext',
    description: 'User email and phone number are being written to application logs.',
    file: 'src/utils/logger.js',
    line: 23,
    remediation: 'Mask sensitive data before logging.',
    status: 'Open'
  }
];

const AnalysisResults: React.FC = () => {
  const [filterSeverity, setFilterSeverity] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [findings, setFindings] = useState(mockFindings);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleRunScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setFindings(prev => [...prev]);
    }, 2000);
  };

  const handleApplyFix = (id: string) => {
    setFindings(prev => prev.map(f => {
      if (f.id === id) {
        return { ...f, status: 'Resolved' as const };
      }
      return f;
    }));
  };

  const filteredFindings = filterSeverity === 'All'
    ? findings
    : findings.filter(f => f.severity === filterSeverity);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'High': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'Medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'Low': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'Security': return <ShieldAlert className="w-5 h-5" />;
      case 'TechDebt': return <FileCode className="w-5 h-5" />;
      case 'Reliability': return <AlertCircle className="w-5 h-5" />;
      case 'Compliance': return <CheckCircle2 className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Analysis Results</h2>
          <p className="text-slate-400">Detailed findings across your portfolio. 5 active repositories scanned.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg hover:text-white transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button
            onClick={handleRunScan}
            disabled={isScanning}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg shadow-lg shadow-blue-900/20 transition-colors"
          >
            {isScanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {isScanning ? 'Scanning...' : 'Run New Scan'}
          </button>
        </div>
      </div>

      <div className="flex gap-2 pb-2 overflow-x-auto">
        {['All', 'Critical', 'High', 'Medium', 'Low'].map(severity => (
          <button
            key={severity}
            onClick={() => setFilterSeverity(severity)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              filterSeverity === severity
                ? 'bg-slate-700 text-white border-slate-600'
                : 'bg-transparent text-slate-400 border-slate-700 hover:border-slate-500 hover:text-slate-200'
            }`}
          >
            {severity}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredFindings.map((finding) => (
          <div key={finding.id} className="bg-slate-800 rounded-xl border border-slate-700/50 overflow-hidden hover:border-slate-600 transition-colors">
            <div
              className="p-4 flex items-center gap-4 cursor-pointer"
              onClick={() => toggleExpand(finding.id)}
            >
              <button className="text-slate-500 hover:text-slate-300">
                {expandedId === finding.id ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </button>

              <div className={`p-2 rounded-lg ${getSeverityColor(finding.severity)} bg-opacity-10 border bg-transparent`}>
                {getIcon(finding.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-white font-medium truncate">{finding.title}</h3>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${getSeverityColor(finding.severity)}`}>
                    {finding.severity}
                  </span>
                  <span className="text-xs text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                    {finding.type}
                  </span>
                </div>
                <p className="text-sm text-slate-400 truncate">{finding.file}:{finding.line}</p>
              </div>

              <div className="hidden md:flex items-center gap-4">
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                  finding.status === 'Open' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'
                }`}>
                  {finding.status}
                </span>
              </div>
            </div>

            {expandedId === finding.id && (
              <div className="bg-slate-900/50 border-t border-slate-700/50 p-6 animate-in">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-300 mb-2">Description</h4>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4">{finding.description}</p>

                    <h4 className="text-sm font-semibold text-slate-300 mb-2">Location</h4>
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-slate-400 flex items-center gap-2">
                      <FileCode className="w-4 h-4" />
                      {finding.file} <span className="text-slate-600">L{finding.line}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-300 mb-2">AI Remediation Plan</h4>
                    <div className="bg-blue-900/10 border border-blue-900/30 p-4 rounded-lg">
                      <p className="text-blue-300 text-sm mb-3">{finding.remediation}</p>
                      <div className="flex gap-3">
                        {finding.status === 'Open' ? (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleApplyFix(finding.id); }}
                            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors"
                          >
                            <Wand2 className="w-3 h-3" />
                            Apply Fix
                          </button>
                        ) : (
                          <span className="flex items-center gap-2 px-3 py-1.5 text-green-400 text-xs font-medium">
                            <CheckCircle2 className="w-3 h-3" /> Fixed
                          </span>
                        )}
                        <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition-colors">
                          View Context
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalysisResults;
