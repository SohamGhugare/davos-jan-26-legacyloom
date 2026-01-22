
"use client";

import React, { useState } from "react";
import { 
  LayoutDashboard, 
  GitBranch, 
  Network, 
  CheckCircle2, 
  History, 
  Menu, 
  X,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  Bell,
  ChevronDown,
  Building2,
  Settings,
  Database as DbIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Dashboard, 
  Lifecycle, 
  DependencyGraph, 
  Reconciliation,
  ObjectSelection 
} from '@/components/migration';

type TabType = 'dashboard' | 'selection' | 'lifecycle' | 'dependency' | 'reconciliation';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('selection');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { id: 'dashboard', label: 'Migration Health', icon: LayoutDashboard },
    { id: 'selection', label: 'Object Selection', icon: DbIcon },
    { id: 'lifecycle', label: 'Migration Lifecycle', icon: GitBranch },
    { id: 'dependency', label: 'Object Dependencies', icon: Network },
    { id: 'reconciliation', label: 'Reconciliation Intelligence', icon: CheckCircle2 },
  ];

  const steps = [
    { id: 'scope', label: 'PROJECT SCOPE', active: false },
    { id: 'analysis', label: 'MIGRATION ANALYSIS', active: true },
    { id: 'deployment', label: 'JIVS IMP DEPLOYMENT', active: false },
    { id: 'implementation', label: 'IMPLEMENTATION', active: false },
  ];

  return (
    <div className="flex h-screen bg-[#09090b] text-zinc-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside 
        className={cn(
          "relative border-r border-zinc-800 bg-[#09090b] transition-all duration-300 ease-in-out z-20",
          isSidebarOpen ? "w-72" : "w-20"
        )}
      >
        <div className="flex h-20 items-center px-6 border-b border-zinc-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.4)]">
              <span className="text-white font-black text-xl tracking-tighter italic">jivs</span>
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight whitespace-nowrap leading-none">
                  OCC <span className="text-zinc-500 font-medium">CONSOLE</span>
                </span>
                <span className="text-[10px] text-zinc-500 font-mono tracking-widest mt-1">v2.4.0 PROD</span>
              </div>
            )}
          </div>
        </div>

        <nav className="mt-8 space-y-1.5 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabType)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-4 py-3.5 transition-all duration-200 group relative",
                  isActive 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110",
                  isActive ? "text-white" : "text-zinc-500"
                )} />
                {isSidebarOpen && (
                  <span className="text-sm font-semibold whitespace-nowrap">{item.label}</span>
                )}
                {isActive && (
                  <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-white rounded-r-full" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-8 left-0 w-full px-4 space-y-4">
          <div className={cn(
            "rounded-2xl bg-zinc-900/50 p-4 border border-zinc-800",
            !isSidebarOpen && "hidden"
          )}>
            <div className="flex items-center gap-2 text-xs text-amber-500 font-bold mb-2 uppercase tracking-widest">
              <AlertTriangle className="h-3 w-3" />
              SYSTEM ALERT
            </div>
            <p className="text-[10px] text-zinc-400 leading-relaxed font-medium">
              Validation lag detected in SAP S/4HANA target. Integrity score impacted by 1.2%.
            </p>
          </div>
          
          <button className={cn(
            "flex items-center gap-3 w-full px-4 py-3 rounded-xl text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all",
            !isSidebarOpen && "justify-center"
          )}>
            <Settings className="h-5 w-5" />
            {isSidebarOpen && <span className="text-sm font-medium">Settings</span>}
          </button>
        </div>

        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-24 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-zinc-400 hover:text-white z-30 transition-transform hover:scale-110 shadow-xl"
        >
          {isSidebarOpen ? <X className="h-3 w-3" /> : <Menu className="h-3 w-3" />}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col bg-black">
        {/* Top Header */}
        <header className="flex h-20 items-center justify-between border-b border-zinc-800 px-8 bg-black/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-blue-500 font-bold text-xs uppercase shadow-inner">
              BUILD
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                S/4 Transformation <span className="text-zinc-500 font-normal">Project</span>
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer">
              <Building2 className="h-3.5 w-3.5" />
              Seeburg AG
              <ChevronDown className="h-3.5 w-3.5 ml-1" />
            </div>
            
            <div className="relative cursor-pointer group">
              <Bell className="h-5 w-5 text-zinc-400 group-hover:text-white transition-colors" />
              <div className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full border-2 border-black" />
            </div>
            
            <div className="h-8 w-[1px] bg-zinc-800 mx-2" />
            
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform">
                TF
              </div>
              <ChevronDown className="h-4 w-4 text-zinc-500 group-hover:text-white transition-colors" />
            </div>
          </div>
        </header>

        {/* Steps Navigation */}
        <div className="flex items-center justify-center border-b border-zinc-800 bg-zinc-900/20 py-4 px-8 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 max-w-5xl w-full justify-between">
            {steps.map((step, idx) => (
              <React.Fragment key={step.id}>
                <div 
                  className={cn(
                    "px-6 py-2 rounded-lg text-xs font-bold tracking-widest transition-all whitespace-nowrap",
                    step.active 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                      : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  {step.label}
                </div>
                {idx < steps.length - 1 && (
                  <div className="h-[1px] flex-1 bg-zinc-800 mx-4 min-w-[20px]" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          <div className="max-w-7xl mx-auto h-full">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'selection' && <ObjectSelection />}
            {activeTab === 'lifecycle' && <Lifecycle />}
            {activeTab === 'dependency' && <DependencyGraph />}
            {activeTab === 'reconciliation' && <Reconciliation />}
          </div>
        </div>

        {/* Bottom Status Bar */}
        <footer className="h-10 border-t border-zinc-800 bg-black px-8 flex items-center justify-between text-[10px] font-mono text-zinc-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              SYSTEM_READY
            </div>
            <div className="h-3 w-[1px] bg-zinc-800" />
            <div className="flex items-center gap-1.5">
              <History className="h-3 w-3" />
              LAST_SYNC: 12 SEC AGO
            </div>
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-zinc-300 cursor-pointer">SOURCE: ecc60_prod</span>
            <span className="hover:text-zinc-300 cursor-pointer">TARGET: s4h_hana_v2</span>
          </div>
        </footer>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
