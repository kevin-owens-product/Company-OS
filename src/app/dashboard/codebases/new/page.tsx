'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Github,
  GitBranch,
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react'

type Provider = 'github' | 'gitlab' | 'bitbucket' | 'azure'
type Step = 'provider' | 'connect' | 'configure' | 'complete'

const providers = [
  {
    id: 'github' as Provider,
    name: 'GitHub',
    description: 'Connect repositories from GitHub.com or GitHub Enterprise',
    icon: Github,
    color: 'hover:border-slate-500',
  },
  {
    id: 'gitlab' as Provider,
    name: 'GitLab',
    description: 'Connect repositories from GitLab.com or self-hosted',
    icon: GitBranch,
    color: 'hover:border-orange-500',
  },
  {
    id: 'bitbucket' as Provider,
    name: 'Bitbucket',
    description: 'Connect repositories from Bitbucket Cloud or Server',
    icon: GitBranch,
    color: 'hover:border-blue-500',
  },
  {
    id: 'azure' as Provider,
    name: 'Azure DevOps',
    description: 'Connect repositories from Azure DevOps Services',
    icon: GitBranch,
    color: 'hover:border-cyan-500',
  },
]

export default function NewCodebasePage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('provider')
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [repoUrl, setRepoUrl] = useState('')
  const [branch, setBranch] = useState('main')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const handleProviderSelect = (provider: Provider) => {
    setSelectedProvider(provider)
    setStep('connect')
  }

  const handleConnect = async () => {
    setIsConnecting(true)
    // Simulate OAuth flow
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsConnecting(false)
    setStep('configure')
  }

  const handleConfigure = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsConnecting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsConnecting(false)
    setStep('complete')
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard/codebases"
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Connect Codebase</h1>
          <p className="text-slate-400 mt-1">
            Add a new repository to start analyzing and transforming your code
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-4 mb-8">
        {['provider', 'connect', 'configure', 'complete'].map((s, idx) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === s
                  ? 'bg-blue-600 text-white'
                  : ['provider', 'connect', 'configure', 'complete'].indexOf(step) > idx
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-700 text-slate-400'
              }`}
            >
              {['provider', 'connect', 'configure', 'complete'].indexOf(step) > idx ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                idx + 1
              )}
            </div>
            {idx < 3 && (
              <div
                className={`w-16 h-0.5 mx-2 ${
                  ['provider', 'connect', 'configure', 'complete'].indexOf(step) > idx
                    ? 'bg-green-600'
                    : 'bg-slate-700'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-8">
        {/* Step 1: Provider Selection */}
        {step === 'provider' && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-6">
              Select Git Provider
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {providers.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => handleProviderSelect(provider.id)}
                  className={`flex items-start gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-700 ${provider.color} transition-colors text-left`}
                >
                  <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <provider.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{provider.name}</h3>
                    <p className="text-sm text-slate-400 mt-1">
                      {provider.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Connect */}
        {step === 'connect' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-slate-700 rounded-xl flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8 text-slate-300" />
            </div>
            <h2 className="text-lg font-semibold text-white mt-6">
              Authorize CodeForge
            </h2>
            <p className="text-slate-400 mt-2 max-w-md mx-auto">
              Grant CodeForge read access to your repositories. We&apos;ll never make
              changes without your explicit approval.
            </p>
            <div className="mt-6 p-4 bg-slate-900/50 rounded-lg text-left max-w-md mx-auto">
              <h4 className="text-sm font-medium text-white mb-2">
                Permissions requested:
              </h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Read repository contents
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Read repository metadata
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Create pull requests (optional)
                </li>
              </ul>
            </div>
            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => setStep('provider')}
                className="px-6 py-2 text-slate-400 hover:text-white transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg font-medium transition-colors"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    Authorize with{' '}
                    {providers.find((p) => p.id === selectedProvider)?.name}
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Configure */}
        {step === 'configure' && (
          <form onSubmit={handleConfigure}>
            <h2 className="text-lg font-semibold text-white mb-6">
              Configure Repository
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Repository URL
                </label>
                <input
                  type="text"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/your-org/your-repo"
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Default Branch
                </label>
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  placeholder="main"
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My Repository"
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of this codebase"
                  rows={3}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setStep('connect')}
                className="px-6 py-2 text-slate-400 hover:text-white transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isConnecting}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg font-medium transition-colors"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Connect Repository'
                )}
              </button>
            </div>
          </form>
        )}

        {/* Step 4: Complete */}
        {step === 'complete' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-xl font-semibold text-white mt-6">
              Codebase Connected!
            </h2>
            <p className="text-slate-400 mt-2 max-w-md mx-auto">
              Your repository has been connected successfully. CodeForge is now
              analyzing your codebase. This may take a few minutes.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => router.push('/dashboard/codebases')}
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
              >
                View All Codebases
              </button>
              <button
                onClick={() => router.push('/dashboard/analysis')}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                View Analysis
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
