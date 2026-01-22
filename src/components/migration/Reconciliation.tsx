
"use client";

import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend
} from 'recharts';
import { 
  CheckCircle2, 
  Lightbulb, 
  ArrowUpRight,
  FileSearch,
  Zap,
  Filter,
  ShieldAlert,
  Search
} from 'lucide-react';
import { RECON_DATA, TEST_RULE_DATA } from '@/lib/migration-data';
import { cn } from '@/lib/utils';

export function Reconciliation() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReconData = RECON_DATA.filter(item => 
    item.sourceObj.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.targetObj.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSource = RECON_DATA.reduce((acc, curr) => acc + curr.sourceCount, 0);
  const totalTarget = RECON_DATA.reduce((acc, curr) => acc + curr.totalCount, 0);
  const totalNotOk = RECON_DATA.reduce((acc, curr) => acc + curr.notOkCount, 0);
  
  const matchRate = totalTarget > 0 ? (((totalTarget - totalNotOk) / totalTarget) * 100).toFixed(1) : "0.0";

  const pieData = [
    { name: 'Validated', value: Math.max(0, totalTarget - totalNotOk), color: '#3b82f6' },
    { name: 'Discrepancy', value: totalNotOk, color: '#ef4444' },
  ];

  const barData = RECON_DATA.filter((v, i, a) => a.findIndex(t => t.targetObj === v.targetObj) === i).map(item => ({
    name: item.targetObj,
    source: RECON_DATA.filter(d => d.targetObj === item.targetObj).reduce((acc, curr) => acc + curr.sourceCount, 0),
    target: RECON_DATA.filter(d => d.targetObj === item.targetObj).reduce((acc, curr) => acc + curr.totalCount, 0),
  }));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight italic">Reconciliation Intelligence</h2>
          <p className="text-zinc-500 mt-2 text-sm font-medium">ECC60 Source vs S4HANA Target Audit</p>
        </div>
        <div className="flex gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Filter by object..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-blue-600 w-48 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95 group">
            <Zap className="h-4 w-4 fill-white" />
            Visual Prompt
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-all">
            <FileSearch className="h-4 w-4" />
            Full Audit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Match Rate Card */}
        <div className="lg:col-span-1 rounded-3xl bg-zinc-900 border border-zinc-800 p-8 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <CheckCircle2 className="h-40 w-40 text-blue-500" />
          </div>
          
          <h3 className="text-zinc-500 text-[10px] font-black tracking-[0.2em] mb-6 uppercase">Integrity Coefficient</h3>
          
          <div className="relative h-56 w-56">
            <ResponsiveContainer width="100%" height="100%" minHeight={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                  startAngle={90}
                  endAngle={450}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold text-white tracking-tighter">{matchRate}%</span>
              <span className="text-[10px] text-blue-500 font-black tracking-[0.2em] mt-1 uppercase italic">Verified</span>
            </div>
          </div>

          <div className="w-full mt-8 space-y-3 relative z-10">
            <MetricSummaryRow 
              label="Target Load" 
              value={totalTarget.toLocaleString()} 
              color="bg-blue-500" 
            />
            <MetricSummaryRow 
              label="Discrepancies" 
              value={totalNotOk.toLocaleString()} 
              color="bg-red-500" 
              highlight={totalNotOk > 0}
            />
          </div>
        </div>

        {/* Comparison Chart */}
        <div className="lg:col-span-2 rounded-3xl bg-zinc-900 border border-zinc-800 p-8 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-white text-lg font-bold tracking-tight">System Delta Analysis</h3>
              <p className="text-zinc-500 text-sm font-medium uppercase tracking-tighter">Source (ECC) vs Target (S4)</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-zinc-700" />
                <span className="text-[10px] font-black text-zinc-500 uppercase">ECC Source</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="text-[10px] font-black text-zinc-500 uppercase">S4 Target</span>
              </div>
            </div>
          </div>

          <div className="h-64 flex-1">
            <ResponsiveContainer width="100%" height="100%" minHeight={250}>
              <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                <XAxis 
                  dataKey="name" 
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
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)' }}
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                />
                <Bar dataKey="source" fill="#27272a" radius={[6, 6, 0, 0]} barSize={24} />
                <Bar dataKey="target" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-zinc-800/50">
            <DetailStat label="Source Gross" value={totalSource.toLocaleString()} />
            <DetailStat label="Target Gross" value={totalTarget.toLocaleString()} />
            <DetailStat label="Audited Objects" value={barData.length.toString()} />
            <DetailStat label="Status" value="SYNCING" color="text-blue-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rule Validation List */}
        <div className="rounded-3xl bg-zinc-900 border border-zinc-800 overflow-hidden flex flex-col">
          <div className="p-8 border-b border-zinc-800 flex items-center justify-between bg-black/20">
            <div>
              <h3 className="text-white font-bold tracking-tight">Active Audit Rules</h3>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Real-time schema validation</p>
            </div>
            <ShieldAlert className="h-5 w-5 text-zinc-600" />
          </div>
          <div className="divide-y divide-zinc-800/30 overflow-y-auto custom-scrollbar max-h-[400px]">
            {TEST_RULE_DATA.map((rule, idx) => (
              <div key={idx} className="p-6 hover:bg-zinc-800/30 transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center border transition-all group-hover:scale-110",
                      rule.notOkCount > 0 ? "bg-red-500/10 border-red-500/30 text-red-500" : "bg-blue-500/10 border-blue-500/30 text-blue-500"
                    )}>
                      <Zap className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-zinc-100 uppercase tracking-tight">{rule.targetObj}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-zinc-500 font-mono">{rule.targetField}</span>
                        <div className="h-1 w-1 rounded-full bg-zinc-700" />
                        <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter italic">{rule.sqlCode}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={cn(
                      "text-sm font-mono font-black",
                      rule.notOkCount > 0 ? "text-red-500" : "text-blue-500"
                    )}>
                      {rule.notOkCount.toLocaleString()} ERRORS
                    </div>
                    <div className="text-[9px] text-zinc-600 font-bold uppercase mt-1">
                      SCANNING {rule.totalCount.toLocaleString()} DATA POINTS
                    </div>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full transition-all duration-1000 ease-out",
                      rule.notOkCount > 0 ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]" : "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]"
                    )}
                    style={{ width: `${((rule.totalCount - rule.notOkCount) / rule.totalCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insight Engine */}
        <div className="rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 p-8 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Zap className="h-32 w-32 text-blue-500 fill-blue-500" />
          </div>
          
          <div className="flex items-center gap-4 mb-8 relative z-10">
            <div className="h-14 w-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-600/40 animate-pulse">
              <Lightbulb className="h-7 w-7 text-white" />
            </div>
            <div>
              <h3 className="text-white text-xl font-bold tracking-tight">AI Reconciliation Hub</h3>
              <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1 italic">Precision Auditing Active</p>
            </div>
          </div>

          <div className="space-y-4 flex-1 relative z-10">
            <RecommendationCard 
              text={`Detected critical mapping failure in PRODUCT for ${TEST_RULE_DATA[2]?.notOkCount.toLocaleString() || 0} records. Field 'MATNR' requires v2 conversion logic.`} 
              action="Deploy V2 Mapping"
              severity="high"
            />
            <RecommendationCard 
              text="Cross-system latency detected in BANK_MASTER. 29 records pending reconciliation due to S_BNKA table lock."
              action="Force Sync"
              severity="medium"
            />
            <RecommendationCard 
              text="Consistency scan complete for VENDOR_2. Integrity score 100% across all 2,583 loaded records."
              action="Seal Audit"
              severity="low"
            />
          </div>

          <button className="w-full mt-10 flex items-center justify-center gap-3 bg-white text-black px-4 py-5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-2xl group active:scale-[0.98] relative z-10">
            EXECUTE INTELLIGENT RESOLUTION <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
}

function MetricSummaryRow({ label, value, color, highlight }: { label: string, value: string, color: string, highlight?: boolean }) {
  return (
    <div className={cn(
      "flex items-center justify-between p-4 rounded-2xl bg-black/40 border transition-all",
      highlight ? "border-red-500/20" : "border-zinc-800/50 hover:border-zinc-700"
    )}>
      <div className="flex items-center gap-3">
        <div className={cn("h-2 w-2 rounded-full", color, highlight && "animate-pulse")} />
        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{label}</span>
      </div>
      <span className={cn("text-sm font-mono font-bold", highlight ? "text-red-500" : "text-zinc-100")}>{value}</span>
    </div>
  );
}

function DetailStat({ label, value, color }: { label: string, value: string, color?: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-1">{label}</span>
      <span className={cn("text-xl font-bold tracking-tight", color || "text-zinc-100")}>{value}</span>
    </div>
  );
}

function RecommendationCard({ text, action, severity }: { text: string, action: string, severity: 'high' | 'medium' | 'low' }) {
  const colors = {
    high: "border-red-500/20 text-red-500 bg-red-500/5",
    medium: "border-blue-500/20 text-blue-500 bg-blue-500/5",
    low: "border-emerald-500/20 text-emerald-500 bg-emerald-500/5"
  };

  return (
    <div className={cn("p-5 rounded-2xl border transition-all cursor-pointer group backdrop-blur-sm", colors[severity])}>
      <p className="text-xs text-zinc-300 leading-relaxed font-bold mb-4 opacity-90">
        "{text}"
      </p>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest">{action}</span>
        <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
      </div>
    </div>
  );
}
