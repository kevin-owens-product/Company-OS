'use client'

import { useSession } from 'next-auth/react'
import {
  GitBranch,
  Shield,
  Zap,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  Play,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'

const metrics = [
  {
    label: 'Connected Codebases',
    value: '12',
    trend: 'up' as const,
    trendValue: '+2 this month',
    icon: GitBranch,
    color: 'blue',
  },
  {
    label: 'Security Score',
    value: '87%',
    trend: 'up' as const,
    trendValue: '+5% from last scan',
    icon: Shield,
    color: 'green',
  },
  {
    label: 'Active Transformations',
    value: '3',
    trend: 'neutral' as const,
    trendValue: '2 pending approval',
    icon: Zap,
    color: 'purple',
  },
  {
    label: 'Open Findings',
    value: '24',
    trend: 'down' as const,
    trendValue: '-12 this week',
    icon: AlertTriangle,
    color: 'amber',
  },
]

const recentTransformations = [
  {
    id: '1',
    codebase: 'api-gateway',
    playbook: 'Security Hardening',
    status: 'Executing',
    progress: 67,
  },
  {
    id: '2',
    codebase: 'payment-service',
    playbook: 'Dead Code Removal',
    status: 'Pending Approval',
    progress: 0,
  },
  {
    id: '3',
    codebase: 'user-auth',
    playbook: 'Dependency Update',
    status: 'Completed',
    progress: 100,
  },
]

const topFindings = [
  {
    id: '1',
    severity: 'Critical',
    title: 'SQL Injection Vulnerability',
    codebase: 'api-gateway',
    file: 'src/handlers/query.ts',
  },
  {
    id: '2',
    severity: 'High',
    title: 'Hardcoded API Key',
    codebase: 'payment-service',
    file: 'src/config/stripe.ts',
  },
  {
    id: '3',
    severity: 'Medium',
    title: 'Deprecated Package Usage',
    codebase: 'user-auth',
    file: 'package.json',
  },
]

const colorMap = {
  blue: 'bg-blue-600/10 text-blue-500',
  green: 'bg-green-600/10 text-green-500',
  purple: 'bg-purple-600/10 text-purple-500',
  amber: 'bg-amber-600/10 text-amber-500',
}

const severityColors = {
  Critical: 'bg-red-600/10 text-red-500 border-red-500/20',
  High: 'bg-orange-600/10 text-orange-500 border-orange-500/20',
  Medium: 'bg-yellow-600/10 text-yellow-500 border-yellow-500/20',
  Low: 'bg-blue-600/10 text-blue-500 border-blue-500/20',
}

const statusColors = {
  Executing: 'text-blue-500',
  'Pending Approval': 'text-amber-500',
  Completed: 'text-green-500',
  Failed: 'text-red-500',
}

export default function DashboardPage() {
  const { data: session } = useSession()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Welcome back, {session?.user?.name?.split(' ')[0] || 'User'}
        </h1>
        <p className="mt-1 text-slate-400">
          Here&apos;s what&apos;s happening with your codebases today.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="bg-slate-800/50 rounded-xl border border-slate-700 p-6"
          >
            <div className="flex items-center justify-between">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  colorMap[metric.color as keyof typeof colorMap]
                }`}
              >
                <metric.icon className="w-6 h-6" />
              </div>
              {metric.trend === 'up' && (
                <TrendingUp className="w-5 h-5 text-green-500" />
              )}
              {metric.trend === 'down' && (
                <TrendingDown className="w-5 h-5 text-green-500" />
              )}
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-white">{metric.value}</p>
              <p className="text-sm text-slate-400 mt-1">{metric.label}</p>
            </div>
            <p className="text-xs text-slate-500 mt-2">{metric.trendValue}</p>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transformations */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">
              Recent Transformations
            </h2>
            <Link
              href="/dashboard/transformations"
              className="text-sm text-blue-500 hover:text-blue-400 flex items-center gap-1"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentTransformations.map((transformation) => (
              <div
                key={transformation.id}
                className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-lg"
              >
                <div className="flex-shrink-0">
                  {transformation.status === 'Executing' && (
                    <Play className="w-5 h-5 text-blue-500" />
                  )}
                  {transformation.status === 'Pending Approval' && (
                    <Clock className="w-5 h-5 text-amber-500" />
                  )}
                  {transformation.status === 'Completed' && (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {transformation.codebase}
                  </p>
                  <p className="text-xs text-slate-400">
                    {transformation.playbook}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-medium ${
                      statusColors[
                        transformation.status as keyof typeof statusColors
                      ]
                    }`}
                  >
                    {transformation.status}
                  </p>
                  {transformation.status === 'Executing' && (
                    <div className="mt-1 w-20 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${transformation.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Findings */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Top Findings</h2>
            <Link
              href="/dashboard/analysis"
              className="text-sm text-blue-500 hover:text-blue-400 flex items-center gap-1"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {topFindings.map((finding) => (
              <div
                key={finding.id}
                className="p-4 bg-slate-900/50 rounded-lg border-l-2 border-transparent hover:border-l-blue-500 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded border ${
                      severityColors[
                        finding.severity as keyof typeof severityColors
                      ]
                    }`}
                  >
                    {finding.severity}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">
                      {finding.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {finding.codebase} • {finding.file}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/codebases/new"
            className="flex items-center gap-3 p-4 bg-slate-900/50 rounded-lg hover:bg-slate-900 transition-colors group"
          >
            <div className="w-10 h-10 bg-blue-600/10 rounded-lg flex items-center justify-center group-hover:bg-blue-600/20 transition-colors">
              <GitBranch className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Connect Codebase</p>
              <p className="text-xs text-slate-400">Add a new repository</p>
            </div>
          </Link>
          <Link
            href="/dashboard/playbooks"
            className="flex items-center gap-3 p-4 bg-slate-900/50 rounded-lg hover:bg-slate-900 transition-colors group"
          >
            <div className="w-10 h-10 bg-purple-600/10 rounded-lg flex items-center justify-center group-hover:bg-purple-600/20 transition-colors">
              <Zap className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Run Playbook</p>
              <p className="text-xs text-slate-400">Start a transformation</p>
            </div>
          </Link>
          <Link
            href="/dashboard/analysis"
            className="flex items-center gap-3 p-4 bg-slate-900/50 rounded-lg hover:bg-slate-900 transition-colors group"
          >
            <div className="w-10 h-10 bg-green-600/10 rounded-lg flex items-center justify-center group-hover:bg-green-600/20 transition-colors">
              <Shield className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Run Analysis</p>
              <p className="text-xs text-slate-400">Scan for issues</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
