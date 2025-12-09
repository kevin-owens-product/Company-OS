'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  Shield,
  Code2,
  Trash2,
  RefreshCw,
  GitMerge,
  Zap,
  FileCheck,
  Plus,
  Search,
  Play,
  Star,
  Clock,
} from 'lucide-react'

interface Playbook {
  id: string
  name: string
  description: string
  category: 'Security' | 'Modernization' | 'Cleanup' | 'Dependencies' | 'Architecture' | 'Compliance'
  isBuiltIn: boolean
  usageCount: number
  estimatedTime: string
  tags: string[]
}

const mockPlaybooks: Playbook[] = [
  {
    id: '1',
    name: 'Security Hardening',
    description: 'Automatically fix common security vulnerabilities including SQL injection, XSS, and hardcoded secrets.',
    category: 'Security',
    isBuiltIn: true,
    usageCount: 1250,
    estimatedTime: '15-30 min',
    tags: ['OWASP', 'vulnerabilities', 'secrets'],
  },
  {
    id: '2',
    name: 'Dead Code Removal',
    description: 'Identify and safely remove unused functions, imports, variables, and unreachable code.',
    category: 'Cleanup',
    isBuiltIn: true,
    usageCount: 890,
    estimatedTime: '5-15 min',
    tags: ['cleanup', 'optimization', 'refactoring'],
  },
  {
    id: '3',
    name: 'Dependency Update',
    description: 'Update outdated dependencies to their latest stable versions with automatic compatibility checks.',
    category: 'Dependencies',
    isBuiltIn: true,
    usageCount: 2100,
    estimatedTime: '10-20 min',
    tags: ['npm', 'yarn', 'packages', 'security'],
  },
  {
    id: '4',
    name: 'TypeScript Migration',
    description: 'Gradually migrate JavaScript codebase to TypeScript with proper type definitions.',
    category: 'Modernization',
    isBuiltIn: true,
    usageCount: 456,
    estimatedTime: '30-60 min',
    tags: ['typescript', 'types', 'migration'],
  },
  {
    id: '5',
    name: 'API Modernization',
    description: 'Convert legacy REST APIs to modern patterns with proper error handling and validation.',
    category: 'Architecture',
    isBuiltIn: true,
    usageCount: 234,
    estimatedTime: '45-90 min',
    tags: ['api', 'rest', 'graphql'],
  },
  {
    id: '6',
    name: 'SOC2 Compliance',
    description: 'Ensure codebase meets SOC2 compliance requirements for logging, encryption, and access control.',
    category: 'Compliance',
    isBuiltIn: true,
    usageCount: 178,
    estimatedTime: '30-45 min',
    tags: ['soc2', 'audit', 'compliance'],
  },
  {
    id: '7',
    name: 'React Hooks Migration',
    description: 'Convert class components to functional components with React Hooks.',
    category: 'Modernization',
    isBuiltIn: true,
    usageCount: 567,
    estimatedTime: '20-40 min',
    tags: ['react', 'hooks', 'functional'],
  },
  {
    id: '8',
    name: 'Error Handling Improvement',
    description: 'Add comprehensive error handling, logging, and recovery patterns throughout the codebase.',
    category: 'Architecture',
    isBuiltIn: true,
    usageCount: 345,
    estimatedTime: '15-30 min',
    tags: ['errors', 'logging', 'reliability'],
  },
]

const categoryConfig = {
  Security: { icon: Shield, color: 'text-red-400', bg: 'bg-red-600/10' },
  Modernization: { icon: Zap, color: 'text-purple-400', bg: 'bg-purple-600/10' },
  Cleanup: { icon: Trash2, color: 'text-amber-400', bg: 'bg-amber-600/10' },
  Dependencies: { icon: RefreshCw, color: 'text-blue-400', bg: 'bg-blue-600/10' },
  Architecture: { icon: GitMerge, color: 'text-green-400', bg: 'bg-green-600/10' },
  Compliance: { icon: FileCheck, color: 'text-cyan-400', bg: 'bg-cyan-600/10' },
}

export default function PlaybooksPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  const filteredPlaybooks = mockPlaybooks.filter((playbook) => {
    const matchesSearch =
      playbook.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      playbook.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      playbook.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
    const matchesCategory =
      categoryFilter === 'all' ||
      playbook.category.toLowerCase() === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Playbooks</h1>
          <p className="text-slate-400 mt-1">
            Pre-built transformation recipes to modernize and secure your code
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
          <Plus className="w-5 h-5" />
          Create Playbook
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search playbooks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'security', 'modernization', 'cleanup', 'dependencies', 'architecture', 'compliance'].map(
            (category) => (
              <button
                key={category}
                onClick={() => setCategoryFilter(category)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  categoryFilter === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            )
          )}
        </div>
      </div>

      {/* Playbooks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlaybooks.map((playbook) => {
          const CategoryIcon = categoryConfig[playbook.category].icon
          return (
            <div
              key={playbook.id}
              className="bg-slate-800/50 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors overflow-hidden group"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${categoryConfig[playbook.category].bg}`}
                  >
                    <CategoryIcon
                      className={`w-6 h-6 ${categoryConfig[playbook.category].color}`}
                    />
                  </div>
                  {playbook.isBuiltIn && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-amber-600/10 text-amber-500 text-xs font-medium rounded">
                      <Star className="w-3 h-3" />
                      Built-in
                    </span>
                  )}
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-white mt-4">
                  {playbook.name}
                </h3>
                <p className="text-sm text-slate-400 mt-2 line-clamp-2">
                  {playbook.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {playbook.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-slate-900 text-slate-400 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-700">
                  <div className="flex items-center gap-1 text-sm text-slate-400">
                    <Play className="w-4 h-4" />
                    {playbook.usageCount.toLocaleString()} runs
                  </div>
                  <div className="flex items-center gap-1 text-sm text-slate-400">
                    <Clock className="w-4 h-4" />
                    {playbook.estimatedTime}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="px-6 py-4 border-t border-slate-700 bg-slate-900/30">
                <Link
                  href={`/dashboard/transformations/new?playbook=${playbook.id}`}
                  className="flex items-center justify-center gap-2 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Run Playbook
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredPlaybooks.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="mt-4 text-lg font-medium text-white">
            No playbooks found
          </h3>
          <p className="mt-2 text-slate-400">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  )
}
