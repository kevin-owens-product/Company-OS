'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  GitBranch,
  Search,
  Filter,
  Plus,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  ExternalLink,
  Trash2,
} from 'lucide-react'

interface Codebase {
  id: string
  name: string
  description: string
  provider: 'GitHub' | 'GitLab' | 'Bitbucket' | 'Azure DevOps'
  repoUrl: string
  branch: string
  status: 'Ready' | 'Analyzing' | 'Pending' | 'Error'
  lastScan: string
  riskScore: number
  languages: { name: string; percentage: number }[]
  totalFiles: number
  totalLines: number
}

const mockCodebases: Codebase[] = [
  {
    id: '1',
    name: 'api-gateway',
    description: 'Main API gateway service handling all external requests',
    provider: 'GitHub',
    repoUrl: 'https://github.com/company/api-gateway',
    branch: 'main',
    status: 'Ready',
    lastScan: '2 hours ago',
    riskScore: 72,
    languages: [
      { name: 'TypeScript', percentage: 68 },
      { name: 'JavaScript', percentage: 25 },
      { name: 'Other', percentage: 7 },
    ],
    totalFiles: 234,
    totalLines: 45000,
  },
  {
    id: '2',
    name: 'payment-service',
    description: 'Payment processing microservice with Stripe integration',
    provider: 'GitHub',
    repoUrl: 'https://github.com/company/payment-service',
    branch: 'main',
    status: 'Analyzing',
    lastScan: 'In progress',
    riskScore: 0,
    languages: [
      { name: 'Python', percentage: 85 },
      { name: 'SQL', percentage: 15 },
    ],
    totalFiles: 89,
    totalLines: 12000,
  },
  {
    id: '3',
    name: 'user-auth',
    description: 'Authentication and authorization service',
    provider: 'GitLab',
    repoUrl: 'https://gitlab.com/company/user-auth',
    branch: 'develop',
    status: 'Ready',
    lastScan: '1 day ago',
    riskScore: 45,
    languages: [
      { name: 'Go', percentage: 92 },
      { name: 'Other', percentage: 8 },
    ],
    totalFiles: 156,
    totalLines: 28000,
  },
  {
    id: '4',
    name: 'legacy-monolith',
    description: 'Legacy PHP monolith application',
    provider: 'Bitbucket',
    repoUrl: 'https://bitbucket.org/company/legacy-monolith',
    branch: 'master',
    status: 'Error',
    lastScan: 'Failed',
    riskScore: 89,
    languages: [
      { name: 'PHP', percentage: 70 },
      { name: 'JavaScript', percentage: 20 },
      { name: 'CSS', percentage: 10 },
    ],
    totalFiles: 1500,
    totalLines: 250000,
  },
]

const statusConfig = {
  Ready: {
    icon: CheckCircle2,
    color: 'text-green-500',
    bg: 'bg-green-600/10',
  },
  Analyzing: {
    icon: RefreshCw,
    color: 'text-blue-500',
    bg: 'bg-blue-600/10',
  },
  Pending: {
    icon: Clock,
    color: 'text-amber-500',
    bg: 'bg-amber-600/10',
  },
  Error: {
    icon: AlertCircle,
    color: 'text-red-500',
    bg: 'bg-red-600/10',
  },
}

const providerIcons = {
  GitHub: '/icons/github.svg',
  GitLab: '/icons/gitlab.svg',
  Bitbucket: '/icons/bitbucket.svg',
  'Azure DevOps': '/icons/azure.svg',
}

function getRiskColor(score: number) {
  if (score >= 75) return 'text-red-500'
  if (score >= 50) return 'text-amber-500'
  if (score >= 25) return 'text-yellow-500'
  return 'text-green-500'
}

function getRiskBg(score: number) {
  if (score >= 75) return 'bg-red-500'
  if (score >= 50) return 'bg-amber-500'
  if (score >= 25) return 'bg-yellow-500'
  return 'bg-green-500'
}

export default function CodebasesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredCodebases = mockCodebases.filter((codebase) => {
    const matchesSearch =
      codebase.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      codebase.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === 'all' || codebase.status.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Codebases</h1>
          <p className="text-slate-400 mt-1">
            Manage your connected repositories and view analysis results
          </p>
        </div>
        <Link
          href="/dashboard/codebases/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Connect Codebase
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search codebases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white appearance-none focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="ready">Ready</option>
            <option value="analyzing">Analyzing</option>
            <option value="pending">Pending</option>
            <option value="error">Error</option>
          </select>
        </div>
      </div>

      {/* Codebases Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCodebases.map((codebase) => {
          const StatusIcon = statusConfig[codebase.status].icon
          return (
            <div
              key={codebase.id}
              className="bg-slate-800/50 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                      <GitBranch className="w-5 h-5 text-slate-300" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {codebase.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`flex items-center gap-1 text-xs ${statusConfig[codebase.status].color}`}
                        >
                          <StatusIcon className={`w-3 h-3 ${codebase.status === 'Analyzing' ? 'animate-spin' : ''}`} />
                          {codebase.status}
                        </span>
                        <span className="text-slate-500">•</span>
                        <span className="text-xs text-slate-400">
                          {codebase.provider}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                {/* Description */}
                <p className="mt-4 text-sm text-slate-400 line-clamp-2">
                  {codebase.description}
                </p>

                {/* Languages */}
                <div className="mt-4">
                  <div className="flex h-2 rounded-full overflow-hidden bg-slate-700">
                    {codebase.languages.map((lang, idx) => (
                      <div
                        key={lang.name}
                        className={`h-full ${
                          idx === 0
                            ? 'bg-blue-500'
                            : idx === 1
                              ? 'bg-green-500'
                              : 'bg-slate-500'
                        }`}
                        style={{ width: `${lang.percentage}%` }}
                      />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {codebase.languages.map((lang, idx) => (
                      <span key={lang.name} className="flex items-center gap-1 text-xs text-slate-400">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            idx === 0
                              ? 'bg-blue-500'
                              : idx === 1
                                ? 'bg-green-500'
                                : 'bg-slate-500'
                          }`}
                        />
                        {lang.name} {lang.percentage}%
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-4 pt-4 border-t border-slate-700 grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Risk Score</p>
                    <p className={`text-lg font-semibold ${codebase.riskScore ? getRiskColor(codebase.riskScore) : 'text-slate-500'}`}>
                      {codebase.riskScore || '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Files</p>
                    <p className="text-lg font-semibold text-white">
                      {codebase.totalFiles.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Lines</p>
                    <p className="text-lg font-semibold text-white">
                      {(codebase.totalLines / 1000).toFixed(0)}k
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 py-4 border-t border-slate-700 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Last scan: {codebase.lastScan}
                </span>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/codebases/${codebase.id}`}
                    className="px-3 py-1.5 text-sm font-medium text-blue-500 hover:text-blue-400 hover:bg-blue-600/10 rounded-lg transition-colors"
                  >
                    View Details
                  </Link>
                  <button className="px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredCodebases.length === 0 && (
        <div className="text-center py-12">
          <GitBranch className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="mt-4 text-lg font-medium text-white">
            No codebases found
          </h3>
          <p className="mt-2 text-slate-400">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Connect your first codebase to get started'}
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <Link
              href="/dashboard/codebases/new"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              Connect Codebase
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
