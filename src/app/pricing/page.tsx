'use client'

import Link from 'next/link'
import { Check, X, Code2, ArrowRight } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    price: 49,
    description: 'Perfect for small teams getting started with code transformation.',
    features: [
      { name: '5 connected codebases', included: true },
      { name: '100 transformations/month', included: true },
      { name: 'Basic security scanning', included: true },
      { name: '3 team members', included: true },
      { name: 'Email support', included: true },
      { name: 'Built-in playbooks', included: true },
      { name: 'Custom playbooks', included: false },
      { name: 'API access', included: false },
      { name: 'SSO/SAML', included: false },
      { name: 'Compliance reporting', included: false },
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Professional',
    price: 99,
    description: 'For growing teams that need more power and flexibility.',
    features: [
      { name: '20 connected codebases', included: true },
      { name: '500 transformations/month', included: true },
      { name: 'Advanced security scanning', included: true },
      { name: '10 team members', included: true },
      { name: 'Priority support', included: true },
      { name: 'Built-in playbooks', included: true },
      { name: 'Custom playbooks', included: true },
      { name: 'API access', included: true },
      { name: 'SSO/SAML', included: false },
      { name: 'Compliance reporting', included: false },
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: null,
    description: 'For organizations with advanced security and compliance needs.',
    features: [
      { name: 'Unlimited codebases', included: true },
      { name: 'Unlimited transformations', included: true },
      { name: 'Enterprise security scanning', included: true },
      { name: 'Unlimited team members', included: true },
      { name: 'Dedicated support', included: true },
      { name: 'Built-in playbooks', included: true },
      { name: 'Custom playbooks', included: true },
      { name: 'API access', included: true },
      { name: 'SSO/SAML', included: true },
      { name: 'Compliance reporting', included: true },
    ],
    cta: 'Contact Sales',
    popular: false,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">CodeForge</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link
                href="/"
                className="text-slate-400 hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link
                href="/pricing"
                className="text-white font-medium"
              >
                Pricing
              </Link>
              <Link
                href="/auth/signin"
                className="text-slate-400 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Get Started
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Pricing Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Simple, Transparent Pricing
            </h1>
            <p className="mt-4 text-xl text-slate-400 max-w-2xl mx-auto">
              Start free, scale as you grow. All plans include a 14-day free trial.
            </p>
          </div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-slate-900/50 rounded-2xl border ${
                  plan.popular ? 'border-blue-500' : 'border-slate-800'
                } p-8`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                  <div className="mt-4">
                    {plan.price ? (
                      <>
                        <span className="text-4xl font-bold text-white">
                          ${plan.price}
                        </span>
                        <span className="text-slate-400">/month</span>
                      </>
                    ) : (
                      <span className="text-4xl font-bold text-white">Custom</span>
                    )}
                  </div>
                  <p className="mt-4 text-slate-400 text-sm">{plan.description}</p>
                </div>

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature.name} className="flex items-center gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-slate-600 flex-shrink-0" />
                      )}
                      <span
                        className={
                          feature.included ? 'text-slate-300' : 'text-slate-500'
                        }
                      >
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.price ? '/auth/signup' : '/contact'}
                  className={`mt-8 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>

          {/* FAQ Preview */}
          <div className="mt-24 text-center">
            <h2 className="text-2xl font-bold text-white">
              Questions? We&apos;ve got answers.
            </h2>
            <p className="mt-2 text-slate-400">
              Can&apos;t find what you&apos;re looking for?{' '}
              <Link href="/contact" className="text-blue-500 hover:text-blue-400">
                Contact our team
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-400">
            &copy; {new Date().getFullYear()} CodeForge. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
