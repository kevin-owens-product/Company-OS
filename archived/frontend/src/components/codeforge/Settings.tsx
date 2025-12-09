'use client';

import React, { useState } from 'react';
import { User, Shield, Key, Github, Slack, Mail, Save, Check } from 'lucide-react';

const Settings: React.FC = () => {
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [auditLogEnabled, setAuditLogEnabled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h2 className="text-2xl font-bold text-white">Settings</h2>
        <p className="text-slate-400">Manage your workspace preferences and integrations.</p>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="border-b border-slate-700/50 p-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" />
            Profile Information
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
              <input type="text" defaultValue="John Doe" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
              <input type="email" defaultValue="john.doe@codeforge.ai" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Role</label>
              <input type="text" defaultValue="PE Operating Partner" disabled className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-slate-500 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Organization</label>
              <input type="text" defaultValue="Acme Capital" disabled className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-slate-500 cursor-not-allowed" />
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-slate-900/30 border-t border-slate-700/50 text-right">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ml-auto ${
              saved
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? 'Saved Changes' : isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="border-b border-slate-700/50 p-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-yellow-400" />
            Integrations & API Keys
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-slate-700/30 border border-slate-700 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-800 rounded-lg">
                  <Github className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">GitHub Enterprise</h4>
                  <p className="text-xs text-slate-400">Connected as @acme-admin</p>
                </div>
              </div>
              <button className="text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-1.5 rounded-lg border border-red-500/20 transition-colors">Disconnect</button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-700/30 border border-slate-700 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-800 rounded-lg">
                  <Slack className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">Slack Notifications</h4>
                  <p className="text-xs text-slate-400">Posting to #codeforge-alerts</p>
                </div>
              </div>
              <button className="text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-1.5 rounded-lg border border-red-500/20 transition-colors">Disconnect</button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-700/30 border border-slate-700 rounded-lg opacity-60">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-800 rounded-lg">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">Jira Cloud</h4>
                  <p className="text-xs text-slate-400">Not connected</p>
                </div>
              </div>
              <button className="text-xs bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 px-3 py-1.5 rounded-lg border border-blue-600/20 transition-colors">Connect</button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="border-b border-slate-700/50 p-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            Security
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-white">Two-Factor Authentication</h4>
                <p className="text-xs text-slate-400">Add an extra layer of security to your account.</p>
              </div>
              <div
                onClick={() => setMfaEnabled(!mfaEnabled)}
                className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${mfaEnabled ? 'bg-blue-600' : 'bg-slate-700'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${mfaEnabled ? 'right-1' : 'left-1'}`}></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-white">Audit Log Export</h4>
                <p className="text-xs text-slate-400">Automatically send audit logs to S3.</p>
              </div>
              <div
                onClick={() => setAuditLogEnabled(!auditLogEnabled)}
                className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${auditLogEnabled ? 'bg-blue-600' : 'bg-slate-700'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${auditLogEnabled ? 'right-1' : 'left-1'}`}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
