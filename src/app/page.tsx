import Link from 'next/link'
import {
  Shield,
  Zap,
  GitBranch,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Code2,
  Sparkles
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">CodeForge</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/pricing" className="text-slate-400 hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="/auth/signin" className="text-slate-400 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-600/10 text-blue-400 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Code Transformation</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Modernize Your Legacy Code<br />
            <span className="text-blue-500">Automatically</span>
          </h1>
          <p className="text-xl text-slate-400 mb-8 max-w-3xl mx-auto">
            CodeForge uses advanced AI to analyze, understand, and transform your codebase.
            Reduce technical debt, improve security, and accelerate development.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#demo"
              className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors border border-slate-700"
            >
              Watch Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '10M+', label: 'Lines Analyzed' },
              { value: '500+', label: 'Companies' },
              { value: '85%', label: 'Debt Reduction' },
              { value: '3x', label: 'Faster Delivery' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything You Need to Transform Code
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              A complete platform for code analysis, transformation, and modernization
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: GitBranch,
                title: 'Universal Git Integration',
                description: 'Connect GitHub, GitLab, Bitbucket, or Azure DevOps. We support all major providers.',
              },
              {
                icon: Shield,
                title: 'Security Analysis',
                description: 'Identify vulnerabilities, security hotspots, and compliance issues automatically.',
              },
              {
                icon: Zap,
                title: 'AI-Powered Transformations',
                description: 'Let AI handle code modernization, dependency updates, and refactoring.',
              },
              {
                icon: BarChart3,
                title: 'Technical Debt Tracking',
                description: 'Measure, track, and reduce technical debt with actionable insights.',
              },
              {
                icon: CheckCircle,
                title: 'Automated PR Creation',
                description: 'Get pull requests with detailed explanations for every transformation.',
              },
              {
                icon: Code2,
                title: 'Custom Playbooks',
                description: 'Create your own transformation rules or use our built-in playbooks.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition-colors"
              >
                <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Codebase?
          </h2>
          <p className="text-xl text-slate-400 mb-8">
            Start with a free trial. No credit card required.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors"
          >
            Get Started for Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">CodeForge</span>
            </div>
            <div className="text-slate-400 text-sm">
              &copy; {new Date().getFullYear()} CodeForge. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
