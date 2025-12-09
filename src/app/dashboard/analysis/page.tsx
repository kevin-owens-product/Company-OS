'use client'

import { useState } from 'react'
import {
  Search,
  Filter,
  AlertTriangle,
  Shield,
  Code2,
  Zap,
  CheckCircle2,
  Clock,
  ChevronDown,
  ExternalLink,
  FileCode,
} from 'lucide-react'

interface Finding {
  id: string
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info'
  type: 'Security' | 'Tech Debt' | 'Reliability' | 'Compliance' | 'Performance'
  title: string
  description: string
  file: string
  line: number
  codebase: string
  remediation: string
  status: 'Open' | 'In Progress' | 'Resolved' | 'Ignored'
  code?: string
}

const mockFindings: Finding[] = [
  {
    id: '1',
    severity: 'Critical',
    type: 'Security',
    title: 'SQL Injection Vulnerability',
    description: 'User input is directly interpolated into SQL query without proper sanitization, allowing potential SQL injection attacks.',
    file: 'src/handlers/users.ts',
    line: 45,
    codebase: 'api-gateway',
    remediation: 'Use parameterized queries or prepared statements instead of string interpolation.',
    status: 'Open',
    code: `const query = \`SELECT * FROM users WHERE id = '\${userId}'\`;`,
  },
  {
    id: '2',
    severity: 'Critical',
    type: 'Security',
    title: 'Hardcoded API Key',
    description: 'Stripe API key is hardcoded in the source code. This exposes sensitive credentials.',
    file: 'src/config/stripe.ts',
    line: 12,
    codebase: 'payment-service',
    remediation: 'Move API keys to environment variables and use a secrets management solution.',
    status: 'Open',
    code: `const STRIPE_KEY = 'sk_live_xxxxxxxxxxxxx';`,
  },
  {
    id: '3',
    severity: 'High',
    type: 'Security',
    title: 'Insufficient Input Validation',
    description: 'Email input is not properly validated before being used in authentication flow.',
    file: 'src/auth/login.ts',
    line: 28,
    codebase: 'user-auth',
    remediation: 'Implement proper email validation using a robust validation library.',
    status: 'In Progress',
  },
  {
    id: '4',
    severity: 'High',
    type: 'Tech Debt',
    title: 'Deprecated Package Usage',
    description: 'The request library is deprecated and no longer maintained. It has known security vulnerabilities.',
    file: 'package.json',
    line: 15,
    codebase: 'legacy-monolith',
    remediation: 'Migrate to a modern HTTP client like axios or node-fetch.',
    status: 'Open',
  },
  {
    id: '5',
    severity: 'Medium',
    type: 'Reliability',
    title: 'Missing Error Handling',
    description: 'API endpoint lacks proper error handling, which could lead to unhandled exceptions.',
    file: 'src/routes/products.ts',
    line: 89,
    codebase: 'api-gateway',
    remediation: 'Wrap async operations in try-catch blocks and implement proper error responses.',
    status: 'Open',
  },
  {
    id: '6',
    severity: 'Medium',
    type: 'Performance',
    title: 'N+1 Query Problem',
    description: 'Database queries are executed in a loop, causing significant performance degradation.',
    file: 'src/services/orders.ts',
    line: 156,
    codebase: 'api-gateway',
    remediation: 'Use eager loading or batch queries to reduce database round trips.',
    status: 'Open',
  },
  {
    id: '7',
    severity: 'Low',
    type: 'Tech Debt',
    title: 'Unused Import',
    description: 'Module is imported but never used in the file.',
    file: 'src/utils/helpers.ts',
    line: 3,
    codebase: 'api-gateway',
    remediation: 'Remove unused import to improve code clarity.',
    status: 'Ignored',
  },
]

const severityConfig = {
  Critical: { color: 'text-red-500', bg: 'bg-red-600/10', border: 'border-red-500/30' },
  High: { color: 'text-orange-500', bg: 'bg-orange-600/10', border: 'border-orange-500/30' },
  Medium: { color: 'text-yellow-500', bg: 'bg-yellow-600/10', border: 'border-yellow-500/30' },
  Low: { color: 'text-blue-500', bg: 'bg-blue-600/10', border: 'border-blue-500/30' },
  Info: { color: 'text-slate-400', bg: 'bg-slate-600/10', border: 'border-slate-500/30' },
}

const typeConfig = {
  Security: { icon: Shield, color: 'text-red-400' },
  'Tech Debt': { icon: Code2, color: 'text-amber-400' },
  Reliability: { icon: AlertTriangle, color: 'text-orange-400' },
  Compliance: { icon: CheckCircle2, color: 'text-blue-400' },
  Performance: { icon: Zap, color: 'text-purple-400' },
}

const statusConfig = {
  Open: { color: 'text-red-400', bg: 'bg-red-600/10' },
  'In Progress': { color: 'text-amber-400', bg: 'bg-amber-600/10' },
  Resolved: { color: 'text-green-400', bg: 'bg-green-600/10' },
  Ignored: { color: 'text-slate-400', bg: 'bg-slate-600/10' },
}

export default function AnalysisPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [expandedFinding, setExpandedFinding] = useState<string | null>(null)

  const filteredFindings = mockFindings.filter((finding) => {
    const matchesSearch =
      finding.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      finding.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      finding.file.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSeverity =
      severityFilter === 'all' || finding.severity.toLowerCase() === severityFilter
    const matchesType =
      typeFilter === 'all' || finding.type.toLowerCase().replace(' ', '-') === typeFilter
    return matchesSearch && matchesSeverity && matchesType
  })

  const stats = {
    critical: mockFindings.filter((f) => f.severity === 'Critical').length,
    high: mockFindings.filter((f) => f.severity === 'High').length,
    medium: mockFindings.filter((f) => f.severity === 'Medium').length,
    low: mockFindings.filter((f) => f.severity === 'Low').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Analysis Results</h1>
        <p className="text-slate-400 mt-1">
          Review findings from code analysis across your codebases
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Critical</span>
            <span className="w-2 h-2 rounded-full bg-red-500" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{stats.critical}</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">High</span>
            <span className="w-2 h-2 rounded-full bg-orange-500" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{stats.high}</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Medium</span>
            <span className="w-2 h-2 rounded-full bg-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{stats.medium}</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Low</span>
            <span className="w-2 h-2 rounded-full bg-blue-500" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{stats.low}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search findings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white appearance-none focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Severity</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white appearance-none focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Types</option>
          <option value="security">Security</option>
          <option value="tech-debt">Tech Debt</option>
          <option value="reliability">Reliability</option>
          <option value="compliance">Compliance</option>
          <option value="performance">Performance</option>
        </select>
      </div>

      {/* Findings List */}
      <div className="space-y-4">
        {filteredFindings.map((finding) => {
          const TypeIcon = typeConfig[finding.type].icon
          const isExpanded = expandedFinding === finding.id

          return (
            <div
              key={finding.id}
              className={`bg-slate-800/50 rounded-xl border ${
                severityConfig[finding.severity].border
              } overflow-hidden`}
            >
              <button
                onClick={() =>
                  setExpandedFinding(isExpanded ? null : finding.id)
                }
                className="w-full p-4 flex items-start gap-4 text-left"
              >
                <div
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    severityConfig[finding.severity].bg
                  } ${severityConfig[finding.severity].color}`}
                >
                  {finding.severity}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <TypeIcon
                      className={`w-4 h-4 ${typeConfig[finding.type].color}`}
                    />
                    <span className="text-sm text-slate-400">{finding.type}</span>
                  </div>
                  <h3 className="text-white font-medium mt-1">{finding.title}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <FileCode className="w-4 h-4" />
                      {finding.codebase}
                    </span>
                    <span>{finding.file}:{finding.line}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      statusConfig[finding.status].bg
                    } ${statusConfig[finding.status].color}`}
                  >
                    {finding.status}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 pt-0 border-t border-slate-700">
                  <div className="mt-4 space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-slate-300">
                        Description
                      </h4>
                      <p className="mt-1 text-sm text-slate-400">
                        {finding.description}
                      </p>
                    </div>

                    {finding.code && (
                      <div>
                        <h4 className="text-sm font-medium text-slate-300">
                          Affected Code
                        </h4>
                        <pre className="mt-2 p-3 bg-slate-900 rounded-lg overflow-x-auto">
                          <code className="text-sm text-red-400">
                            {finding.code}
                          </code>
                        </pre>
                      </div>
                    )}

                    <div>
                      <h4 className="text-sm font-medium text-slate-300">
                        Recommended Fix
                      </h4>
                      <p className="mt-1 text-sm text-slate-400">
                        {finding.remediation}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                        Auto-Fix with AI
                      </button>
                      <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors">
                        Mark as Resolved
                      </button>
                      <button className="px-4 py-2 text-slate-400 hover:text-white text-sm font-medium transition-colors">
                        Ignore
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredFindings.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
          <h3 className="mt-4 text-lg font-medium text-white">
            No findings found
          </h3>
          <p className="mt-2 text-slate-400">
            {searchQuery || severityFilter !== 'all' || typeFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Your codebases are looking great!'}
          </p>
        </div>
      )}
    </div>
  )
}
