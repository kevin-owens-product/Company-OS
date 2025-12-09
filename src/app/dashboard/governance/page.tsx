'use client'

import { useState } from 'react'
import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileCheck,
  Download,
  Calendar,
  TrendingUp,
  ExternalLink,
} from 'lucide-react'

interface ComplianceStandard {
  id: string
  name: string
  description: string
  status: 'Compliant' | 'At Risk' | 'Non-Compliant'
  score: number
  lastAudit: string
  nextAudit: string
  controlsPassing: number
  controlsTotal: number
  findings: {
    critical: number
    high: number
    medium: number
    low: number
  }
}

const mockStandards: ComplianceStandard[] = [
  {
    id: '1',
    name: 'SOC 2 Type II',
    description: 'Service Organization Control 2 - Security, Availability, Processing Integrity',
    status: 'Compliant',
    score: 94,
    lastAudit: '2024-01-15',
    nextAudit: '2024-07-15',
    controlsPassing: 47,
    controlsTotal: 50,
    findings: { critical: 0, high: 0, medium: 2, low: 5 },
  },
  {
    id: '2',
    name: 'GDPR',
    description: 'General Data Protection Regulation compliance for EU data handling',
    status: 'At Risk',
    score: 78,
    lastAudit: '2024-02-01',
    nextAudit: '2024-08-01',
    controlsPassing: 31,
    controlsTotal: 40,
    findings: { critical: 1, high: 3, medium: 5, low: 8 },
  },
  {
    id: '3',
    name: 'HIPAA',
    description: 'Health Insurance Portability and Accountability Act compliance',
    status: 'Compliant',
    score: 91,
    lastAudit: '2024-01-20',
    nextAudit: '2024-07-20',
    controlsPassing: 41,
    controlsTotal: 45,
    findings: { critical: 0, high: 1, medium: 2, low: 4 },
  },
  {
    id: '4',
    name: 'PCI DSS',
    description: 'Payment Card Industry Data Security Standard',
    status: 'Non-Compliant',
    score: 62,
    lastAudit: '2024-02-10',
    nextAudit: '2024-05-10',
    controlsPassing: 25,
    controlsTotal: 40,
    findings: { critical: 2, high: 5, medium: 8, low: 12 },
  },
  {
    id: '5',
    name: 'ISO 27001',
    description: 'Information Security Management System standard',
    status: 'Compliant',
    score: 88,
    lastAudit: '2024-01-05',
    nextAudit: '2024-07-05',
    controlsPassing: 110,
    controlsTotal: 125,
    findings: { critical: 0, high: 2, medium: 6, low: 10 },
  },
]

const statusConfig = {
  Compliant: {
    icon: CheckCircle2,
    color: 'text-green-500',
    bg: 'bg-green-600/10',
    border: 'border-green-500/30',
  },
  'At Risk': {
    icon: AlertTriangle,
    color: 'text-amber-500',
    bg: 'bg-amber-600/10',
    border: 'border-amber-500/30',
  },
  'Non-Compliant': {
    icon: XCircle,
    color: 'text-red-500',
    bg: 'bg-red-600/10',
    border: 'border-red-500/30',
  },
}

function getScoreColor(score: number) {
  if (score >= 90) return 'text-green-500'
  if (score >= 70) return 'text-amber-500'
  return 'text-red-500'
}

function getProgressColor(score: number) {
  if (score >= 90) return 'bg-green-500'
  if (score >= 70) return 'bg-amber-500'
  return 'bg-red-500'
}

export default function GovernancePage() {
  const overallScore = Math.round(
    mockStandards.reduce((acc, s) => acc + s.score, 0) / mockStandards.length
  )
  const compliantCount = mockStandards.filter(
    (s) => s.status === 'Compliant'
  ).length
  const totalFindings = mockStandards.reduce(
    (acc, s) =>
      acc +
      s.findings.critical +
      s.findings.high +
      s.findings.medium +
      s.findings.low,
    0
  )
  const criticalFindings = mockStandards.reduce(
    (acc, s) => acc + s.findings.critical,
    0
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Governance & Compliance</h1>
          <p className="text-slate-400 mt-1">
            Monitor compliance status and audit readiness across standards
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors">
          <Download className="w-5 h-5" />
          Export Report
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Overall Score</span>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className={`text-3xl font-bold mt-2 ${getScoreColor(overallScore)}`}>
            {overallScore}%
          </p>
          <div className="mt-3 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${getProgressColor(overallScore)}`}
              style={{ width: `${overallScore}%` }}
            />
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Standards Tracked</span>
            <FileCheck className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-white mt-2">
            {mockStandards.length}
          </p>
          <p className="text-sm text-slate-400 mt-2">
            {compliantCount} compliant
          </p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Open Findings</span>
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-bold text-white mt-2">{totalFindings}</p>
          <p className="text-sm text-red-400 mt-2">
            {criticalFindings} critical
          </p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Next Audit</span>
            <Calendar className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-white mt-2">23</p>
          <p className="text-sm text-slate-400 mt-2">days remaining</p>
        </div>
      </div>

      {/* Standards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockStandards.map((standard) => {
          const StatusIcon = statusConfig[standard.status].icon
          return (
            <div
              key={standard.id}
              className={`bg-slate-800/50 rounded-xl border ${statusConfig[standard.status].border} overflow-hidden`}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${statusConfig[standard.status].bg}`}
                    >
                      <StatusIcon
                        className={`w-5 h-5 ${statusConfig[standard.status].color}`}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {standard.name}
                      </h3>
                      <span
                        className={`text-sm ${statusConfig[standard.status].color}`}
                      >
                        {standard.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-2xl font-bold ${getScoreColor(standard.score)}`}
                    >
                      {standard.score}%
                    </p>
                    <p className="text-xs text-slate-400">compliance score</p>
                  </div>
                </div>

                {/* Description */}
                <p className="mt-4 text-sm text-slate-400">
                  {standard.description}
                </p>

                {/* Progress */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-400">Controls Passing</span>
                    <span className="text-white">
                      {standard.controlsPassing} / {standard.controlsTotal}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${getProgressColor(standard.score)}`}
                      style={{
                        width: `${(standard.controlsPassing / standard.controlsTotal) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Findings */}
                <div className="mt-4 flex items-center gap-4">
                  {standard.findings.critical > 0 && (
                    <span className="px-2 py-1 bg-red-600/10 text-red-500 text-xs font-medium rounded">
                      {standard.findings.critical} Critical
                    </span>
                  )}
                  {standard.findings.high > 0 && (
                    <span className="px-2 py-1 bg-orange-600/10 text-orange-500 text-xs font-medium rounded">
                      {standard.findings.high} High
                    </span>
                  )}
                  {standard.findings.medium > 0 && (
                    <span className="px-2 py-1 bg-yellow-600/10 text-yellow-500 text-xs font-medium rounded">
                      {standard.findings.medium} Medium
                    </span>
                  )}
                  {standard.findings.low > 0 && (
                    <span className="px-2 py-1 bg-blue-600/10 text-blue-500 text-xs font-medium rounded">
                      {standard.findings.low} Low
                    </span>
                  )}
                </div>

                {/* Dates */}
                <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between text-sm">
                  <div className="text-slate-400">
                    Last audit:{' '}
                    <span className="text-white">
                      {new Date(standard.lastAudit).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-slate-400">
                    Next audit:{' '}
                    <span className="text-white">
                      {new Date(standard.nextAudit).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 py-4 border-t border-slate-700 bg-slate-900/30 flex items-center justify-between">
                <button className="text-sm text-blue-500 hover:text-blue-400 font-medium transition-colors">
                  View Details
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  Run Audit
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
