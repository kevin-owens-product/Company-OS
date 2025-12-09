'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Wand2,
  Search,
  Filter,
  Plus,
  Play,
  Pause,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  GitPullRequest,
  ExternalLink,
  MoreVertical,
  Eye,
  RefreshCw,
} from 'lucide-react'

interface Transformation {
  id: string
  codebase: string
  playbook: string
  status: 'Planning' | 'Pending Approval' | 'Executing' | 'Completed' | 'Failed' | 'Paused'
  progress: number
  currentStep: string
  startedAt: string
  completedAt?: string
  prUrl?: string
  error?: string
  changes: {
    filesModified: number
    linesAdded: number
    linesRemoved: number
  }
}

const mockTransformations: Transformation[] = [
  {
    id: '1',
    codebase: 'api-gateway',
    playbook: 'Security Hardening',
    status: 'Executing',
    progress: 67,
    currentStep: 'Fixing SQL injection vulnerabilities',
    startedAt: '10 minutes ago',
    changes: {
      filesModified: 12,
      linesAdded: 89,
      linesRemoved: 45,
    },
  },
  {
    id: '2',
    codebase: 'payment-service',
    playbook: 'Dead Code Removal',
    status: 'Pending Approval',
    progress: 100,
    currentStep: 'Awaiting review',
    startedAt: '2 hours ago',
    changes: {
      filesModified: 8,
      linesAdded: 0,
      linesRemoved: 234,
    },
  },
  {
    id: '3',
    codebase: 'user-auth',
    playbook: 'Dependency Update',
    status: 'Completed',
    progress: 100,
    currentStep: 'All dependencies updated',
    startedAt: '1 day ago',
    completedAt: '1 day ago',
    prUrl: 'https://github.com/company/user-auth/pull/142',
    changes: {
      filesModified: 3,
      linesAdded: 156,
      linesRemoved: 89,
    },
  },
  {
    id: '4',
    codebase: 'legacy-monolith',
    playbook: 'TypeScript Migration',
    status: 'Planning',
    progress: 15,
    currentStep: 'Analyzing codebase structure',
    startedAt: '5 minutes ago',
    changes: {
      filesModified: 0,
      linesAdded: 0,
      linesRemoved: 0,
    },
  },
  {
    id: '5',
    codebase: 'notification-service',
    playbook: 'Error Handling',
    status: 'Failed',
    progress: 45,
    currentStep: 'Stopped due to merge conflict',
    startedAt: '3 hours ago',
    error: 'Merge conflict detected in src/handlers/email.ts',
    changes: {
      filesModified: 4,
      linesAdded: 67,
      linesRemoved: 12,
    },
  },
  {
    id: '6',
    codebase: 'api-gateway',
    playbook: 'SOC2 Compliance',
    status: 'Paused',
    progress: 30,
    currentStep: 'Paused by user',
    startedAt: '1 hour ago',
    changes: {
      filesModified: 6,
      linesAdded: 234,
      linesRemoved: 45,
    },
  },
]

const statusConfig = {
  Planning: {
    icon: Clock,
    color: 'text-blue-400',
    bg: 'bg-blue-600/10',
    progressColor: 'bg-blue-500',
  },
  'Pending Approval': {
    icon: Eye,
    color: 'text-amber-400',
    bg: 'bg-amber-600/10',
    progressColor: 'bg-amber-500',
  },
  Executing: {
    icon: RefreshCw,
    color: 'text-purple-400',
    bg: 'bg-purple-600/10',
    progressColor: 'bg-purple-500',
  },
  Completed: {
    icon: CheckCircle2,
    color: 'text-green-400',
    bg: 'bg-green-600/10',
    progressColor: 'bg-green-500',
  },
  Failed: {
    icon: XCircle,
    color: 'text-red-400',
    bg: 'bg-red-600/10',
    progressColor: 'bg-red-500',
  },
  Paused: {
    icon: Pause,
    color: 'text-slate-400',
    bg: 'bg-slate-600/10',
    progressColor: 'bg-slate-500',
  },
}

export default function TransformationsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredTransformations = mockTransformations.filter((t) => {
    const matchesSearch =
      t.codebase.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.playbook.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === 'all' ||
      t.status.toLowerCase().replace(' ', '-') === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    active: mockTransformations.filter((t) =>
      ['Planning', 'Executing'].includes(t.status)
    ).length,
    pending: mockTransformations.filter((t) => t.status === 'Pending Approval')
      .length,
    completed: mockTransformations.filter((t) => t.status === 'Completed')
      .length,
    failed: mockTransformations.filter((t) => t.status === 'Failed').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Transformations</h1>
          <p className="text-slate-400 mt-1">
            Track and manage code transformations across your codebases
          </p>
        </div>
        <Link
          href="/dashboard/transformations/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Transformation
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Active</span>
            <RefreshCw className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{stats.active}</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Pending Review</span>
            <Eye className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{stats.pending}</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{stats.completed}</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Failed</span>
            <XCircle className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{stats.failed}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search transformations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white appearance-none focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Status</option>
          <option value="planning">Planning</option>
          <option value="pending-approval">Pending Approval</option>
          <option value="executing">Executing</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="paused">Paused</option>
        </select>
      </div>

      {/* Transformations List */}
      <div className="space-y-4">
        {filteredTransformations.map((transformation) => {
          const StatusIcon = statusConfig[transformation.status].icon
          return (
            <div
              key={transformation.id}
              className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${statusConfig[transformation.status].bg}`}
                    >
                      <StatusIcon
                        className={`w-5 h-5 ${statusConfig[transformation.status].color} ${
                          transformation.status === 'Executing'
                            ? 'animate-spin'
                            : ''
                        }`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-white">
                          {transformation.codebase}
                        </h3>
                        <span className="text-slate-500">→</span>
                        <span className="text-slate-300">
                          {transformation.playbook}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 mt-1">
                        {transformation.currentStep}
                      </p>
                      {transformation.error && (
                        <div className="flex items-center gap-2 mt-2 text-sm text-red-400">
                          <AlertTriangle className="w-4 h-4" />
                          {transformation.error}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${statusConfig[transformation.status].bg} ${statusConfig[transformation.status].color}`}
                    >
                      {transformation.status}
                    </span>
                    <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-6">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-white font-medium">
                      {transformation.progress}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${statusConfig[transformation.status].progressColor}`}
                      style={{ width: `${transformation.progress}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-6 pt-4 border-t border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-6 text-sm">
                    <span className="text-slate-400">
                      <span className="text-white font-medium">
                        {transformation.changes.filesModified}
                      </span>{' '}
                      files modified
                    </span>
                    <span className="text-green-400">
                      +{transformation.changes.linesAdded}
                    </span>
                    <span className="text-red-400">
                      -{transformation.changes.linesRemoved}
                    </span>
                    <span className="text-slate-500">|</span>
                    <span className="text-slate-400">
                      Started {transformation.startedAt}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {transformation.prUrl && (
                      <a
                        href={transformation.prUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-500 hover:text-blue-400 hover:bg-blue-600/10 rounded-lg transition-colors"
                      >
                        <GitPullRequest className="w-4 h-4" />
                        View PR
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {transformation.status === 'Pending Approval' && (
                      <>
                        <button className="px-3 py-1.5 text-sm font-medium bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                          Approve
                        </button>
                        <button className="px-3 py-1.5 text-sm font-medium bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                          Reject
                        </button>
                      </>
                    )}
                    {transformation.status === 'Paused' && (
                      <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                        <Play className="w-4 h-4" />
                        Resume
                      </button>
                    )}
                    {transformation.status === 'Failed' && (
                      <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                        <RefreshCw className="w-4 h-4" />
                        Retry
                      </button>
                    )}
                    {['Planning', 'Executing'].includes(
                      transformation.status
                    ) && (
                      <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                        <Pause className="w-4 h-4" />
                        Pause
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredTransformations.length === 0 && (
        <div className="text-center py-12">
          <Wand2 className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="mt-4 text-lg font-medium text-white">
            No transformations found
          </h3>
          <p className="mt-2 text-slate-400">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Start your first transformation to modernize your code'}
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <Link
              href="/dashboard/transformations/new"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Transformation
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
