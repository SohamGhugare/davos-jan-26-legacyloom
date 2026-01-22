
"use client";

import React from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  TrendingDown, 
  TrendingUp,
  ArrowUpRight,
  Zap,
  Clock,
  LucideIcon
} from 'lucide-react';
import { MOCK_HEALTH } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  trend?: string;
  trendType?: 'positive' | 'negative';
  status?: string;
  color: string;
}

export function Dashboard() {
  const pieData = [
    { name: 'Health', value: MOCK_HEALTH.overallScore },
    { name: 'Risk', value: 100 - MOCK_HEALTH.overallScore },
  ];

  const COLORS = ['#3b82f6', '#18181b'];

  const recentActivity = [
    { id: 1, action: 'Validation Check', target: 'PRODUCT', time: '2 mins ago', status: 'warning' },
    { id: 2, action: 'Data Extraction', target: 'BANK_MASTER', time: '15 mins ago', status: 'success' },
    { id: 3, action: 'Mapping Update', target: 'CUSTOMER_2', time: '1 hour ago', status: 'info' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      {/* Top Section: Health Score & Key Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health Score Card */}
        <div className="lg:col-span-1 rounded-3xl bg-zinc-900 border border-zinc-800 p-8 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
            <Zap className="h-24 w-24 text-blue-500" />
          </div>
          
          <h3 className="text-zinc-400 text-sm font-bold tracking-widest mb-6 uppercase">System Health</h3>
          
          <div className="relative h-56 w-56">
            <ResponsiveContainer width="100%" height="100%" minHeight={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  startAngle={90}
                  endAngle={450}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold text-white tracking-tighter">{MOCK_HEALTH.overallScore}%</span>
              <span className="text-xs text-blue-500 font-black tracking-[0.2em] mt-1 italic uppercase">Optimal</span>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 text-zinc-500 text-xs font-bold">
            <TrendingUp className="h-3 w-3 text-green-500" />
            <span className="text-green-500">+4.2%</span> <span className="uppercase tracking-widest">Efficiency boost</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <MetricCard 
            title="Error Density" 
            value={`${MOCK_HEALTH.errorDensity}%`} 
            description="Records requiring intervention"
            icon={AlertCircle}
            trend="-1.2%"
            trendType="positive"
            color="text-amber-500"
          />
          <MetricCard 
            title="Integrity Index" 
            value={`${MOCK_HEALTH.integrityIndex}%`} 
            description="Data consistency score"
            icon={CheckCircle2}
            trend="+0.8%"
            trendType="positive"
            color="text-emerald-500"
          />
          <MetricCard 
            title="Risk Level" 
            value={MOCK_HEALTH.riskLevel} 
            description="Migration delay probability"
            icon={Activity}
            status="Stable"
            color="text-blue-500"
          />
          <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 flex flex-col justify-between group cursor-pointer hover:shadow-lg hover:shadow-blue-600/20 transition-all active:scale-[0.98]">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-blue-200 fill-blue-200" />
                <h3 className="text-white/80 text-xs font-black uppercase tracking-widest">AI Insight</h3>
              </div>
              <p className="text-white text-lg font-bold leading-tight tracking-tight">
                Optimizing "R-102" mapping rule could reduce validation lag by 15%.
              </p>
            </div>
            <div className="flex items-center gap-2 text-white text-sm font-black mt-4 uppercase tracking-tighter italic">
              Deploy Optimization <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Trend & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-3xl bg-zinc-900 border border-zinc-800 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-white text-lg font-bold tracking-tight">Stability Trend</h3>
              <p className="text-zinc-500 text-sm">Health tracking over the last 5 operational cycles</p>
            </div>
            <div className="flex items-center gap-2 bg-black/40 rounded-xl p-1 border border-zinc-800">
              <button className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest bg-zinc-800 text-white rounded-lg shadow-sm">Health</button>
              <button className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-300">Errors</button>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%" minHeight={250}>
              <AreaChart data={MOCK_HEALTH.trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#71717a', fontSize: 10, fontWeight: 700 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#71717a', fontSize: 10 }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px' }}
                  itemStyle={{ color: '#3b82f6', fontWeight: 700 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="health" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorHealth)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl bg-zinc-900 border border-zinc-800 p-8">
          <h3 className="text-white text-lg font-bold tracking-tight mb-6">Live Stream</h3>
          <div className="space-y-6">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-start gap-4 group cursor-pointer">
                <div className={cn(
                  "mt-1 h-2 w-2 rounded-full",
                  item.status === 'success' ? "bg-emerald-500" : 
                  item.status === 'warning' ? "bg-amber-500 animate-pulse" : 
                  "bg-blue-500"
                )} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black text-zinc-200 uppercase tracking-tighter">{item.action}</span>
                    <span className="text-[10px] text-zinc-600 font-mono">{item.time}</span>
                  </div>
                  <div className="text-[10px] font-bold text-zinc-500 group-hover:text-blue-500 transition-colors uppercase tracking-widest">
                    Target: {item.target}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 rounded-xl border border-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all flex items-center justify-center gap-2">
            <Clock className="h-3 w-3" /> View Operational Logs
          </button>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, description, icon: Icon, trend, trendType, status, color }: MetricCardProps) {
  return (
    <div className="rounded-3xl bg-zinc-900 border border-zinc-800 p-8 flex flex-col justify-between hover:border-zinc-700 transition-all group cursor-default">
      <div className="flex items-center justify-between mb-6">
        <div className={cn("p-3 rounded-2xl bg-black/40 border border-zinc-800 group-hover:scale-110 group-hover:shadow-lg transition-all", color)}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-tighter",
            trendType === 'positive' ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
          )}>
            {trendType === 'positive' ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
            {trend}
          </div>
        )}
        {status && (
          <div className="text-[10px] font-black text-zinc-500 bg-zinc-800/50 px-2 py-1 rounded-lg uppercase tracking-widest">
            {status}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">{title}</h3>
        <p className="text-4xl font-bold text-white tracking-tighter">{value}</p>
        <p className="text-xs text-zinc-600 mt-2 font-medium line-clamp-1">{description}</p>
      </div>
    </div>
  );
}
