'use client';

import React from 'react';
import Link from 'next/link';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { ShieldAlert, TrendingDown, Clock, CheckCircle2, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const dataDebt = [
  { name: 'Mon', value: 4000 },
  { name: 'Tue', value: 3000 },
  { name: 'Wed', value: 2780 },
  { name: 'Thu', value: 2400 },
  { name: 'Fri', value: 2100 },
  { name: 'Sat', value: 1800 },
  { name: 'Sun', value: 1600 },
];

const dataRisks = [
  { name: 'Critical', value: 12 },
  { name: 'High', value: 25 },
  { name: 'Medium', value: 45 },
  { name: 'Low', value: 80 },
];

const COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6'];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Executive Overview</h2>
          <p className="text-slate-400">Portfolio health and modernization progress.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/codeforge/analysis"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg border border-slate-700 transition-colors"
          >
            Export Report
          </Link>
          <Link
            href="/codeforge/codebases"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-lg shadow-blue-900/20 transition-colors"
          >
            New Assessment
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/codeforge/analysis" className="bg-slate-800 p-5 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-colors cursor-pointer">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium">Technical Debt Score</p>
              <h3 className="text-2xl font-bold text-white mt-1">B- <span className="text-lg font-normal text-slate-500">/ 72</span></h3>
            </div>
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <TrendingDown className="w-5 h-5 text-yellow-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs">
            <span className="text-green-400 flex items-center font-medium">
              <ArrowDownRight className="w-3 h-3 mr-1" />
              12%
            </span>
            <span className="text-slate-500 ml-2">improvement since last month</span>
          </div>
        </Link>

        <Link href="/codeforge/analysis" className="bg-slate-800 p-5 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-colors cursor-pointer">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium">Vulnerabilities</p>
              <h3 className="text-2xl font-bold text-white mt-1">47</h3>
            </div>
            <div className="p-2 bg-red-500/10 rounded-lg">
              <ShieldAlert className="w-5 h-5 text-red-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs">
            <span className="text-red-400 flex items-center font-medium">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              3 new
            </span>
            <span className="text-slate-500 ml-2">critical CVEs detected</span>
          </div>
        </Link>

        <Link href="/codeforge/transformations" className="bg-slate-800 p-5 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-colors cursor-pointer">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium">Time to Modernize</p>
              <h3 className="text-2xl font-bold text-white mt-1">4.2 <span className="text-sm font-normal text-slate-500">months</span></h3>
            </div>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs">
            <span className="text-green-400 flex items-center font-medium">
              <ArrowDownRight className="w-3 h-3 mr-1" />
              2.1 mo
            </span>
            <span className="text-slate-500 ml-2">faster than manual</span>
          </div>
        </Link>

        <Link href="/codeforge/transformations" className="bg-slate-800 p-5 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-colors cursor-pointer">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium">Auto-Refactored</p>
              <h3 className="text-2xl font-bold text-white mt-1">84%</h3>
            </div>
            <div className="p-2 bg-green-500/10 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs">
            <span className="text-green-400 flex items-center font-medium">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              5%
            </span>
            <span className="text-slate-500 ml-2">increase in automation</span>
          </div>
        </Link>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-800 p-6 rounded-xl border border-slate-700/50">
          <h3 className="text-lg font-semibold text-white mb-6">Technical Debt Reduction</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataDebt}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#fff' }}
                />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700/50">
          <h3 className="text-lg font-semibold text-white mb-6">Risk Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataRisks}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dataRisks.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {dataRisks.map((item, index) => (
              <div key={item.name} className="flex items-center text-xs text-slate-300">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index] }}></div>
                {item.name}: {item.value}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700/50">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-white">Active Transformations</h3>
          <Link href="/codeforge/transformations" className="text-sm text-blue-400 hover:text-blue-300">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-700 text-xs uppercase tracking-wider text-slate-500">
                <th className="pb-3 pl-2">Project</th>
                <th className="pb-3">Playbook</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Impact</th>
                <th className="pb-3 text-right pr-2">ETA</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-slate-700/50 hover:bg-slate-700/20 cursor-pointer">
                <td className="py-4 pl-2 font-medium text-white">Legacy CRM Core</td>
                <td className="py-4 text-slate-300">PB-101: Frontend Consolidation</td>
                <td className="py-4">
                  <span className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20">
                    In Progress (45%)
                  </span>
                </td>
                <td className="py-4 text-slate-300">High (Critical Path)</td>
                <td className="py-4 text-right pr-2 text-slate-400">2 Weeks</td>
              </tr>
              <tr className="border-b border-slate-700/50 hover:bg-slate-700/20 cursor-pointer">
                <td className="py-4 pl-2 font-medium text-white">Auth Service</td>
                <td className="py-4 text-slate-300">PB-203: Auth Modernization</td>
                <td className="py-4">
                  <span className="px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-xs font-medium border border-yellow-500/20">
                    Pending Approval
                  </span>
                </td>
                <td className="py-4 text-slate-300">Critical (Security)</td>
                <td className="py-4 text-right pr-2 text-slate-400">On Hold</td>
              </tr>
              <tr className="hover:bg-slate-700/20 cursor-pointer">
                <td className="py-4 pl-2 font-medium text-white">Inventory API</td>
                <td className="py-4 text-slate-300">PB-102: Microservices</td>
                <td className="py-4">
                  <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20">
                    Completed
                  </span>
                </td>
                <td className="py-4 text-slate-300">Medium</td>
                <td className="py-4 text-right pr-2 text-slate-400">Done</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
