'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import {
  LayoutDashboard,
  GitBranch,
  Search,
  BookOpen,
  Wand2,
  Shield,
  Settings,
  LogOut,
  Code2,
  ChevronDown,
  Plus,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Codebases', href: '/dashboard/codebases', icon: GitBranch },
  { name: 'Analysis', href: '/dashboard/analysis', icon: Search },
  { name: 'Playbooks', href: '/dashboard/playbooks', icon: BookOpen },
  { name: 'Transformations', href: '/dashboard/transformations', icon: Wand2 },
  { name: 'Governance', href: '/dashboard/governance', icon: Shield },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-slate-950 border-r border-slate-800">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-white">CodeForge</span>
              <span className="block text-xs text-slate-500">AI Code Platform</span>
            </div>
          </Link>
        </div>

        {/* Workspace Selector */}
        <div className="p-4 border-b border-slate-800">
          <button className="w-full flex items-center justify-between px-3 py-2 bg-slate-900 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-xs font-bold text-white">
                {session?.user?.name?.[0] || 'W'}
              </div>
              <span className="text-sm text-slate-300 truncate">
                {session?.user?.name || 'Workspace'}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-600/10 text-blue-500'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            )
          })}

          <div className="pt-4 mt-4 border-t border-slate-800">
            <Link
              href="/dashboard/codebases/new"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              <Plus className="w-5 h-5" />
              Connect Codebase
            </Link>
          </div>
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-slate-800">
          <Link
            href="/dashboard/settings"
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-2',
              pathname.startsWith('/dashboard/settings')
                ? 'bg-blue-600/10 text-blue-500'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            )}
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign out
          </button>
        </div>
      </div>
    </aside>
  )
}
