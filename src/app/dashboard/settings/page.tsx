'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import {
  User,
  Building2,
  CreditCard,
  Key,
  Bell,
  Shield,
  Users,
  Webhook,
  Save,
  Copy,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  CheckCircle2,
} from 'lucide-react'

type Tab = 'profile' | 'workspace' | 'billing' | 'api' | 'notifications' | 'security' | 'team'

const tabs = [
  { id: 'profile' as Tab, name: 'Profile', icon: User },
  { id: 'workspace' as Tab, name: 'Workspace', icon: Building2 },
  { id: 'team' as Tab, name: 'Team', icon: Users },
  { id: 'billing' as Tab, name: 'Billing', icon: CreditCard },
  { id: 'api' as Tab, name: 'API Keys', icon: Key },
  { id: 'notifications' as Tab, name: 'Notifications', icon: Bell },
  { id: 'security' as Tab, name: 'Security', icon: Shield },
]

const mockApiKeys = [
  { id: '1', name: 'Production API Key', key: 'cf_live_xxxxxxxxxxxx', created: '2024-01-15', lastUsed: '2 hours ago' },
  { id: '2', name: 'Development Key', key: 'cf_test_xxxxxxxxxxxx', created: '2024-02-01', lastUsed: '1 day ago' },
]

const mockTeam = [
  { id: '1', name: 'John Smith', email: 'john@company.com', role: 'Owner', avatar: 'JS' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@company.com', role: 'Admin', avatar: 'SJ' },
  { id: '3', name: 'Mike Wilson', email: 'mike@company.com', role: 'Member', avatar: 'MW' },
]

export default function SettingsPage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [showApiKey, setShowApiKey] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex gap-8">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0">
        <nav className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600/10 text-blue-500'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-3xl">
        {/* Profile Settings */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Profile Settings</h2>
              <p className="text-slate-400 mt-1">
                Manage your personal information and preferences
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                  {session?.user?.name?.[0] || 'U'}
                </div>
                <div>
                  <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors">
                    Change Avatar
                  </button>
                  <p className="text-xs text-slate-400 mt-2">JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue={session?.user?.name || ''}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={session?.user?.email || ''}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Senior Engineer"
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-700 flex justify-end">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  {saved ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Saved!
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Workspace Settings */}
        {activeTab === 'workspace' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Workspace Settings</h2>
              <p className="text-slate-400 mt-1">
                Configure your workspace preferences and settings
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Workspace Name
                </label>
                <input
                  type="text"
                  defaultValue="My Company"
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Workspace URL
                </label>
                <div className="flex">
                  <span className="px-4 py-2 bg-slate-700 border border-r-0 border-slate-600 rounded-l-lg text-slate-400 text-sm">
                    codeforge.app/
                  </span>
                  <input
                    type="text"
                    defaultValue="my-company"
                    className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-r-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Default Oversight Level
                </label>
                <select className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500">
                  <option value="review">Review - Require approval for all changes</option>
                  <option value="notify">Notify - Execute but notify team</option>
                  <option value="autonomous">Autonomous - Execute without approval</option>
                </select>
                <p className="text-xs text-slate-400 mt-2">
                  This sets the default for new transformations
                </p>
              </div>

              <div className="pt-4 border-t border-slate-700 flex justify-end">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Save className="w-5 h-5" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Team Settings */}
        {activeTab === 'team' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Team Members</h2>
                <p className="text-slate-400 mt-1">
                  Manage who has access to this workspace
                </p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                <Plus className="w-5 h-5" />
                Invite Member
              </button>
            </div>

            <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {mockTeam.map((member) => (
                    <tr key={member.id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-sm font-medium text-white">
                            {member.avatar}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{member.name}</p>
                            <p className="text-xs text-slate-400">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          defaultValue={member.role.toLowerCase()}
                          className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                        >
                          <option value="owner">Owner</option>
                          <option value="admin">Admin</option>
                          <option value="member">Member</option>
                          <option value="viewer">Viewer</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {member.role !== 'Owner' && (
                          <button className="p-2 text-slate-400 hover:text-red-400 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Billing Settings */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Billing & Plans</h2>
              <p className="text-slate-400 mt-1">
                Manage your subscription and payment methods
              </p>
            </div>

            {/* Current Plan */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-white">Professional Plan</h3>
                    <span className="px-2 py-1 bg-blue-600/10 text-blue-500 text-xs font-medium rounded">
                      Current Plan
                    </span>
                  </div>
                  <p className="text-slate-400 mt-1">$99/month • Renews on March 15, 2024</p>
                </div>
                <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors">
                  Change Plan
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-700">
                <h4 className="text-sm font-medium text-slate-300 mb-4">Usage This Month</h4>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-2xl font-bold text-white">8 / 20</p>
                    <p className="text-sm text-slate-400">Connected Codebases</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">145 / 500</p>
                    <p className="text-sm text-slate-400">Transformations</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">5 / 10</p>
                    <p className="text-sm text-slate-400">Team Members</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Payment Method</h3>
              <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-slate-700 rounded flex items-center justify-center text-xs text-slate-300">
                    VISA
                  </div>
                  <div>
                    <p className="text-sm text-white">•••• •••• •••• 4242</p>
                    <p className="text-xs text-slate-400">Expires 12/2025</p>
                  </div>
                </div>
                <button className="text-sm text-blue-500 hover:text-blue-400 font-medium transition-colors">
                  Update
                </button>
              </div>
            </div>
          </div>
        )}

        {/* API Keys */}
        {activeTab === 'api' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">API Keys</h2>
                <p className="text-slate-400 mt-1">
                  Manage API keys for programmatic access
                </p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                <Plus className="w-5 h-5" />
                Create Key
              </button>
            </div>

            <div className="space-y-4">
              {mockApiKeys.map((apiKey) => (
                <div
                  key={apiKey.id}
                  className="bg-slate-800/50 rounded-xl border border-slate-700 p-6"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-white">{apiKey.name}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <code className="px-3 py-1 bg-slate-900 rounded text-sm text-slate-300 font-mono">
                          {showApiKey === apiKey.id
                            ? apiKey.key
                            : apiKey.key.replace(/./g, '•').slice(0, 20) + '...'}
                        </code>
                        <button
                          onClick={() =>
                            setShowApiKey(showApiKey === apiKey.id ? null : apiKey.id)
                          }
                          className="p-1 text-slate-400 hover:text-white transition-colors"
                        >
                          {showApiKey === apiKey.id ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                        <button className="p-1 text-slate-400 hover:text-white transition-colors">
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-red-400 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-sm text-slate-400">
                    <span>Created: {apiKey.created}</span>
                    <span>•</span>
                    <span>Last used: {apiKey.lastUsed}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notifications */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Notification Preferences</h2>
              <p className="text-slate-400 mt-1">
                Choose how you want to be notified
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 space-y-6">
              {[
                { title: 'Transformation completed', description: 'Get notified when a transformation finishes' },
                { title: 'Transformation requires approval', description: 'Get notified when a transformation needs your review' },
                { title: 'Critical findings detected', description: 'Get notified when critical security issues are found' },
                { title: 'Weekly summary', description: 'Receive a weekly summary of activity' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-white">{item.title}</h4>
                    <p className="text-sm text-slate-400">{item.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                  </label>
                </div>
              ))}

              <div className="pt-4 border-t border-slate-700 flex justify-end">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Save className="w-5 h-5" />
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Security */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Security Settings</h2>
              <p className="text-slate-400 mt-1">
                Manage your account security
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 space-y-6">
              <div>
                <h4 className="font-medium text-white mb-4">Change Password</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Current Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">New Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                    Update Password
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-white">Two-Factor Authentication</h4>
                    <p className="text-sm text-slate-400 mt-1">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors">
                    Enable 2FA
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-700">
                <h4 className="font-medium text-white mb-4">Active Sessions</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                    <div>
                      <p className="text-sm text-white">Chrome on macOS</p>
                      <p className="text-xs text-slate-400">San Francisco, CA • Current session</p>
                    </div>
                    <span className="px-2 py-1 bg-green-600/10 text-green-500 text-xs rounded">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                    <div>
                      <p className="text-sm text-white">Firefox on Windows</p>
                      <p className="text-xs text-slate-400">New York, NY • 2 days ago</p>
                    </div>
                    <button className="text-sm text-red-400 hover:text-red-300 transition-colors">
                      Revoke
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
