"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Database as DbIcon,
  Filter,
  ShieldCheck,
  RefreshCw,
  UploadCloud,
  LucideIcon
} from 'lucide-react';
import { MOCK_STEPS, MigrationStatus } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const iconMap: Record<string, LucideIcon> = {
  extract: DbIcon,
  transform: Filter,
  validate: ShieldCheck,
  reconcile: RefreshCw,
  load: UploadCloud
};

interface ErrorRowProps {
  label: string;
  count: number;
  percent: number;
  color: string;
}

interface ImpactRowProps {
  object: string;
  impact: string;
  status: 'success' | 'warning' | 'blocked';
}

export function Lifecycle() {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Migration Pipeline</h2>
          <p className="text-zinc-500 mt-2">Real-time status of the end-to-end migration lifecycle</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">
            <div className="h-2 w-2 rounded-full bg-green-500" /> Success
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">
            <div className="h-2 w-2 rounded-full bg-amber-500" /> Warning
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" /> In Progress
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Connection Line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-800 -translate-y-1/2 z-0 hidden lg:block" />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 relative z-10">
          {MOCK_STEPS.map((step, index) => {
            const Icon = iconMap[step.id] || DbIcon;
            
            return (
              <motion.div 
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className={cn(
                  "h-16 w-16 rounded-2xl flex items-center justify-center mb-6 border-2 transition-all duration-300 group cursor-pointer",
                  step.status === 'success' ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-500" :
                  step.status === 'warning' ? "bg-amber-500/10 border-amber-500/50 text-amber-500" :
                  step.status === 'in_progress' ? "bg-blue-500/10 border-blue-500/50 text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" :
                  "bg-zinc-900 border-zinc-800 text-zinc-600"
                )}>
                  <Icon className={cn(
                    "h-8 w-8",
                    step.status === 'in_progress' && "animate-pulse"
                  )} />
                </div>

                <div className="w-full rounded-2xl bg-zinc-900 border border-zinc-800 p-5 hover:border-zinc-700 transition-colors group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">{step.id}</span>
                    <StatusBadge status={step.status} />
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-1">{step.name}</h3>
                  <p className="text-xs text-zinc-500 mb-4 leading-relaxed">{step.description}</p>
                  
                  <div className="space-y-3 pt-4 border-t border-zinc-800">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500">Processed</span>
                      <span className="text-zinc-200 font-mono">{(step.recordsProcessed / 1000).toFixed(0)}k / {(step.totalRecords / 1000).toFixed(0)}k</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-1000",
                          step.status === 'success' ? "bg-emerald-500" :
                          step.status === 'warning' ? "bg-amber-500" :
                          "bg-blue-500"
                        )}
                        style={{ width: `${(step.recordsProcessed / step.totalRecords) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-1 text-zinc-500">
                        <Clock className="h-3 w-3" />
                        <span>{step.duration}</span>
                      </div>
                      {step.errors > 0 && (
                        <div className="flex items-center gap-1 text-red-400 font-medium">
                          <AlertCircle className="h-3 w-3" />
                          <span>{step.errors} errors</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Details View for Selected Step (Mocking the Transform step details) */}
      <div className="rounded-3xl bg-zinc-900 border border-zinc-800 overflow-hidden">
        <div className="p-8 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/50 flex items-center justify-center text-amber-500">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Validation Step Details</h3>
              <p className="text-zinc-500 text-sm">Identifying bottlenecks in data integrity</p>
            </div>
          </div>
          <button className="text-sm font-medium text-blue-500 hover:underline">View Full Logs</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
          <div className="p-8">
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Top Error Categories</h4>
            <div className="space-y-4">
              <ErrorRow label="Schema Mismatch" count={4250} percent={50} color="bg-red-500" />
              <ErrorRow label="Referential Integrity" count={2100} percent={25} color="bg-orange-500" />
              <ErrorRow label="Missing Mandatory Fields" count={1200} percent={15} color="bg-amber-500" />
              <ErrorRow label="Value Mapping" count={870} percent={10} color="bg-zinc-500" />
            </div>
          </div>
          
          <div className="p-8">
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Object Impact</h4>
            <div className="space-y-4">
              <ImpactRow object="Vendor Master" impact="Critical" status="blocked" />
              <ImpactRow object="Customer Master" impact="High" status="warning" />
              <ImpactRow object="G/L Accounts" impact="Medium" status="warning" />
              <ImpactRow object="Cost Centers" impact="Low" status="success" />
            </div>
          </div>

          <div className="p-8 bg-blue-600/5">
            <h4 className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-4">AI Contextual Insight</h4>
            <div className="p-4 rounded-2xl bg-black/40 border border-blue-500/20">
              <p className="text-sm text-zinc-300 leading-relaxed italic">
                "We've detected a recurring pattern in 85% of 'Schema Mismatch' errors. The legacy SAP source uses a non-standard ISO format for date fields which is currently being rejected by the validation engine. Applying the 'Auto-Convert ISO' rule would unblock 4,250 records."
              </p>
              <button className="mt-4 w-full py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors">
                Apply Fix Automagically
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: MigrationStatus }) {
  const configs = {
    success: { label: 'Complete', class: 'bg-emerald-500/10 text-emerald-500' },
    warning: { label: 'Issues', class: 'bg-amber-500/10 text-amber-500' },
    failed: { label: 'Failed', class: 'bg-red-500/10 text-red-500' },
    in_progress: { label: 'Running', class: 'bg-blue-500/10 text-blue-500' },
    pending: { label: 'Queued', class: 'bg-zinc-800 text-zinc-500' },
  };

  const config = configs[status];
  return (
    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight", config.class)}>
      {config.label}
    </span>
  );
}

function ErrorRow({ label, count, percent, color }: ErrorRowProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-zinc-300">{label}</span>
        <span className="text-zinc-500 font-mono">{count}</span>
      </div>
      <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full", color)} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function ImpactRow({ object, impact, status }: ImpactRowProps) {
  return (
    <div className="flex items-center justify-between group cursor-pointer p-2 -mx-2 rounded-xl hover:bg-zinc-800 transition-colors">
      <div className="flex items-center gap-3">
        <div className={cn(
          "h-2 w-2 rounded-full",
          status === 'blocked' ? "bg-red-500" : status === 'warning' ? "bg-amber-500" : "bg-emerald-500"
        )} />
        <span className="text-xs text-zinc-300">{object}</span>
      </div>
      <span className={cn(
        "text-[10px] font-bold px-1.5 py-0.5 rounded border",
        impact === 'Critical' ? "text-red-400 border-red-500/30" : 
        impact === 'High' ? "text-orange-400 border-orange-500/30" : 
        "text-zinc-500 border-zinc-700"
      )}>
        {impact}
      </span>
    </div>
  );
}
