
"use client";

import React, { useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  MarkerType,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { MIGRATION_OBJECTS, MigrationStatus } from '@/lib/migration-data';
import { cn } from '@/lib/utils';
import { Database as DbIcon, AlertCircle, CheckCircle2, Clock, Zap, Info } from 'lucide-react';

const statusColors = {
  success: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/50', text: 'text-emerald-500', glow: 'shadow-emerald-500/20' },
  warning: { bg: 'bg-amber-500/10', border: 'border-amber-500/50', text: 'text-amber-500', glow: 'shadow-amber-500/20' },
  failed: { bg: 'bg-red-500/10', border: 'border-red-500/50', text: 'text-red-500', glow: 'shadow-red-500/20' },
  in_progress: { bg: 'bg-blue-500/10', border: 'border-blue-500/50', text: 'text-blue-500', glow: 'shadow-blue-500/20' },
  pending: { bg: 'bg-zinc-900/50', border: 'border-zinc-800', text: 'text-zinc-500', glow: '' },
};

interface CustomNodeData {
  label: string;
  type: string;
  status: MigrationStatus;
  records: number;
  failedRecords: number;
  reconciled: boolean;
  [key: string]: unknown;
}

function CustomNode({ data }: { data: CustomNodeData }) {
  const colors = statusColors[data.status] || statusColors.pending;
  
  return (
    <div className={cn(
      "px-5 py-4 rounded-3xl border-2 min-w-[200px] transition-all duration-300 hover:scale-105 bg-black/80 backdrop-blur-md",
      colors.border,
      data.status !== 'pending' && `shadow-xl ${colors.glow}`
    )}>
      <Handle type="target" position={Position.Top} className="!bg-zinc-700 !border-zinc-600 !w-2 !h-2" />
      
        <div className="flex items-center gap-3 mb-4">
          <div className={cn("p-2.5 rounded-xl border transition-colors", colors.bg, colors.border)}>
            <DbIcon className={cn("h-4 w-4", colors.text)} />
          </div>
          <div className="flex flex-col">
          <h3 className="text-sm font-black text-white tracking-tight uppercase">{data.label}</h3>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{data.type}</span>
        </div>
      </div>
      
      <div className="space-y-2 pt-3 border-t border-zinc-800/50">
        <div className="flex justify-between items-center text-[10px] font-bold">
          <span className="text-zinc-500 uppercase tracking-tighter">Throughput</span>
          <span className="text-zinc-300 font-mono">{data.records.toLocaleString()}</span>
        </div>
        {data.failedRecords > 0 && (
          <div className="flex justify-between items-center text-[10px] font-bold">
            <span className="text-red-500/80 uppercase tracking-tighter">Exceptions</span>
            <span className="text-red-400 font-mono">{data.failedRecords.toLocaleString()}</span>
          </div>
        )}
        <div className="flex items-center gap-2 mt-3 pt-2">
          <div className={cn(
            "h-1.5 w-1.5 rounded-full",
            data.status === 'success' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : 
            data.status === 'warning' ? "bg-amber-500 animate-pulse" : 
            data.status === 'failed' ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" : 
            data.status === 'in_progress' ? "bg-blue-500 animate-pulse" : 
            "bg-zinc-700"
          )} />
          <span className={cn("text-[9px] font-black uppercase tracking-[0.2em]", colors.text)}>
            {data.status === 'success' ? 'Validated' : 
             data.status === 'warning' ? 'Intervention' : 
             data.status === 'failed' ? 'Critical' : 
             data.status === 'in_progress' ? 'Processing' : 
             'Queued'}
          </span>
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} className="!bg-zinc-700 !border-zinc-600 !w-2 !h-2" />
    </div>
  );
}

const nodeTypes = { custom: CustomNode };

export function DependencyGraph() {
  const initialNodes: Node[] = useMemo(() => {
    const positions: Record<string, { x: number; y: number }> = {
      'BANK_MASTER': { x: 500, y: 0 },
      'GL_BALANCE': { x: 500, y: 150 },
      'PRODUCT': { x: 200, y: 350 },
      'VENDOR_2': { x: 500, y: 350 },
      'CUSTOMER_2': { x: 800, y: 350 },
      'CUST_EXT_2': { x: 800, y: 550 },
      'OPEN_ITEM_AP': { x: 500, y: 550 },
      'BATCHES': { x: 50, y: 550 },
      'BOM': { x: 200, y: 550 },
      'ROUTING': { x: 350, y: 550 },
    };
    
    return MIGRATION_OBJECTS.map((obj) => ({
      id: obj.id,
      type: 'custom',
      position: positions[obj.id] || { x: Math.random() * 800, y: Math.random() * 600 },
      data: {
        label: obj.name,
        type: obj.type,
        status: obj.status,
        records: obj.records,
        failedRecords: obj.failedRecords,
        reconciled: obj.reconciled,
      },
    }));
  }, []);

  const initialEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [];
    MIGRATION_OBJECTS.forEach((obj) => {
      obj.dependencies.forEach((dep) => {
        const targetObj = obj;
        
        let strokeColor = '#27272a';
        let animated = false;
        
        if (targetObj.status === 'failed') {
          strokeColor = '#ef4444';
          animated = true;
        } else if (targetObj.status === 'warning') {
          strokeColor = '#f59e0b';
        } else if (targetObj.status === 'success') {
          strokeColor = '#10b981';
        } else if (targetObj.status === 'in_progress') {
          strokeColor = '#3b82f6';
          animated = true;
        }
        
        edges.push({
          id: `${dep}-${obj.id}`,
          source: dep,
          target: obj.id,
          animated,
          style: { stroke: strokeColor, strokeWidth: 2, opacity: 0.6 },
          markerEnd: { type: MarkerType.ArrowClosed, color: strokeColor },
        });
      });
    });
    return edges;
  }, []);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight italic">Relational Topology</h2>
          <p className="text-zinc-500 mt-2 text-sm font-medium">Systemic dependencies and data propagation pathways</p>
        </div>
        <div className="flex items-center gap-3 bg-zinc-900/50 p-2 rounded-2xl border border-zinc-800">
          <LegendItem color="bg-emerald-500" label="Validated" />
          <LegendItem color="bg-amber-500" label="Intervention" />
          <LegendItem color="bg-red-500" label="Blocked" />
          <LegendItem color="bg-blue-500" label="Active" />
        </div>
      </div>

      <div className="rounded-[2.5rem] bg-zinc-950 border border-zinc-800 overflow-hidden relative group" style={{ height: 650 }}>
        <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
          <div className="bg-black/60 backdrop-blur-md border border-zinc-800 p-4 rounded-2xl shadow-2xl">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-3 w-3 text-blue-500 fill-blue-500" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Graph Engine</span>
            </div>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">Active Nodes: {nodes.length}</p>
          </div>
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
          proOptions={{ hideAttribution: true }}
        >
          <Controls className="!bg-zinc-900 !border-zinc-800 !rounded-2xl !p-1 [&>button]:!bg-transparent [&>button]:!border-none [&>button]:!text-zinc-500 [&>button:hover]:!text-white [&>button]:!transition-colors" />
          <MiniMap 
            nodeColor={(n) => {
              const status = n.data?.status as MigrationStatus;
              if (status === 'success') return '#10b981';
              if (status === 'warning') return '#f59e0b';
              if (status === 'failed') return '#ef4444';
              if (status === 'in_progress') return '#3b82f6';
              return '#3f3f46';
            }}
            className="!bg-black/40 !border-zinc-800 !rounded-2xl !backdrop-blur-md"
            maskColor="rgba(0,0,0,0.8)"
          />
          <Background color="#18181b" gap={25} size={1} />
        </ReactFlow>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AnalysisCard 
          icon={AlertCircle}
          iconColor="text-red-500"
          title="Blocking Chain"
          subtitle="Recursive failures"
          content={
            <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 p-3 rounded-xl bg-black/40 border border-zinc-800">
              <span className="text-red-500 font-black tracking-widest uppercase">Customer</span>
              <ArrowRight className="h-3 w-3" />
              <span className="text-red-500 font-black tracking-widest uppercase">Extension</span>
              <span className="text-zinc-600 ml-2">Propagating latency</span>
            </div>
          }
        />

        <AnalysisCard 
          icon={Zap}
          iconColor="text-blue-500"
          title="Flow Impact"
          subtitle="Downstream metrics"
          content={
            <p className="text-xs text-zinc-400 leading-relaxed font-medium">
              <span className="text-blue-500 font-black italic">CUSTOMER_2</span> validation delay is currently impacting 
              <span className="text-white font-black"> 24,560</span> records in dependent child objects.
            </p>
          }
        />

        <div className="rounded-3xl bg-blue-600 p-8 flex flex-col shadow-xl shadow-blue-600/20 group cursor-pointer hover:bg-blue-700 transition-all active:scale-[0.98]">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Info className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-black uppercase tracking-widest text-xs">Architectural Fix</h3>
              <p className="text-blue-200 text-[10px] font-bold">Recommended Sequence</p>
            </div>
          </div>
          <p className="text-sm text-white leading-relaxed font-bold tracking-tight mb-4">
            "Resolve BANK_MASTER reconciliation flags to stabilize the G/L balance propagation chain."
          </p>
          <button className="mt-auto text-[10px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-2 group-hover:gap-3 transition-all">
            Deploy Fix Sequence <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string, label: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-zinc-400">
      <div className={cn("h-1.5 w-1.5 rounded-full", color)} />
      {label}
    </div>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );
}

function AnalysisCard({ icon: Icon, iconColor, title, subtitle, content }: { icon: any, iconColor: string, title: string, subtitle: string, content: React.ReactNode }) {
  return (
    <div className="rounded-3xl bg-zinc-900 border border-zinc-800 p-8 hover:border-zinc-700 transition-all">
      <div className="flex items-center gap-4 mb-6">
        <div className={cn("p-2.5 rounded-2xl bg-black/40 border border-zinc-800", iconColor)}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-white font-black uppercase tracking-widest text-xs">{title}</h3>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-tighter">{subtitle}</p>
        </div>
      </div>
      {content}
    </div>
  );
}
