
"use client";

import React, { useState } from 'react';
import { 
  Plus, 
  ChevronDown, 
  ArrowRight, 
  AlertCircle,
  Info,
  Search,
  Filter,
  Check,
  Database as DbIcon
} from 'lucide-react';
import { MIGRATION_OBJECTS, MigrationObject } from '@/lib/migration-data';
import { cn } from '@/lib/utils';

export function ObjectSelection() {
  const [selectedObjectId, setSelectedObjectId] = useState('PRODUCT');
  const [objects, setObjects] = useState<MigrationObject[]>(MIGRATION_OBJECTS as MigrationObject[]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');

  const filteredObjects = objects.filter(obj => {
    const matchesSearch = obj.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         obj.sapName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'All' || obj.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const selectedObject = objects.find(obj => obj.id === selectedObjectId) || objects[0];

  const toggleActive = (id: string) => {
    setObjects(prev => prev.map(obj => 
      obj.id === id ? { ...obj, active: !obj.active } : obj
    ));
  };

  const types = ['All', 'Master Data', 'Transactional'];

  return (
    <div className="flex flex-col h-full gap-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold text-white tracking-tight italic">Migration Inventory</h2>
          <div className="h-8 w-[1px] bg-zinc-800 hidden md:block" />
          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 cursor-pointer hover:bg-zinc-800 transition-colors">
            <span className="text-xs font-mono text-zinc-500">CLIENT_P01</span>
            <div className="h-1.5 w-12 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
            </div>
            <ChevronDown className="h-3 w-3 text-zinc-500" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search SAP objects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 w-64 transition-all"
            />
          </div>
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1">
            {types.map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                  filterType === type ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full min-h-0">
        {/* Objects Grid */}
        <div className="lg:col-span-3 overflow-y-auto pr-2 custom-scrollbar">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Validated Business Entities</h3>
            <span className="text-[10px] text-zinc-500 font-bold">{filteredObjects.length} OBJECTS FOUND</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredObjects.map((obj) => (
              <div 
                key={obj.id}
                onClick={() => setSelectedObjectId(obj.id)}
                className={cn(
                  "relative rounded-2xl p-5 border transition-all duration-300 cursor-pointer group flex flex-col justify-between h-44 overflow-hidden",
                  selectedObjectId === obj.id 
                    ? "bg-zinc-800/80 border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.15)]" 
                    : "bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/60",
                  obj.error && "border-red-500/30"
                )}
              >
                  {/* Background Decor */}
                  <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <DbIcon className="h-24 w-24 text-white" />
                  </div>

                <div className="flex justify-between items-start mb-2 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      obj.active ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-zinc-700"
                    )} />
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{obj.type}</span>
                  </div>
                  {obj.error && <AlertCircle className="h-4 w-4 text-red-500 animate-pulse" />}
                  {obj.active && !obj.error && selectedObjectId !== obj.id && (
                    <Check className="h-3 w-3 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
                
                <div className="relative z-10">
                  <h4 className={cn(
                    "text-lg font-bold tracking-tight truncate",
                    obj.error ? "text-red-500" : "text-zinc-100"
                  )}>
                    {obj.name}
                  </h4>
                  <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-tighter mt-0.5">{obj.sapName}</p>
                </div>

                <div className="flex items-center justify-between mt-auto relative z-10">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-tighter">Capacity</span>
                    <span className="text-xs font-bold text-zinc-400">{obj.count} Recs</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleActive(obj.id);
                      }}
                      className={cn(
                        "relative h-5 w-10 rounded-full transition-all duration-300 border",
                        obj.active ? "bg-blue-600 border-blue-500" : "bg-zinc-800 border-zinc-700"
                      )}
                    >
                      <div className={cn(
                        "absolute top-0.5 left-0.5 h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-300",
                        obj.active ? "translate-x-5" : "translate-x-0"
                      )} />
                    </button>
                  </div>
                </div>
                
                {selectedObjectId === obj.id && (
                  <div className="absolute top-0 right-0 h-1.5 w-1.5 bg-blue-500 rounded-bl-lg" />
                )}
              </div>
            ))}

            <button className="rounded-2xl border-2 border-dashed border-zinc-800 p-5 flex flex-col items-center justify-center gap-3 hover:border-zinc-600 hover:bg-zinc-900/40 transition-all group h-44">
              <div className="h-10 w-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:scale-110 group-hover:bg-zinc-800 transition-all">
                <Plus className="h-5 w-5 text-zinc-500 group-hover:text-blue-500" />
              </div>
              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] group-hover:text-zinc-400">Custom Object</span>
            </button>
          </div>
        </div>

        {/* Details Panel */}
        <div className="rounded-3xl bg-zinc-900 border border-zinc-800 p-8 flex flex-col shadow-2xl">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full bg-blue-600" />
              <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Selected Entity</h3>
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tighter leading-tight">{selectedObject.name}</h2>
            <p className="text-xs text-blue-500 font-bold mt-1 uppercase tracking-widest">{selectedObject.sapName}</p>
          </div>

          <div className="space-y-6 flex-1">
            <DetailItem label="Functional Type" value={selectedObject.type} />
            <DetailItem label="Data Structure" value={`${selectedObject.tables} Tables Associated`} />
            <DetailItem 
              label="Primary Components" 
              value={selectedObject.details?.tables?.slice(0, 3).join(', ') || 'Standard SAP Mapping'} 
            />
            <div className="grid grid-cols-2 gap-4">
              <DetailItem label="Record Set" value={selectedObject.count} />
              <DetailItem label="Disk Usage" value={selectedObject.size} />
            </div>
          </div>

          <div className="mt-auto pt-8 border-t border-zinc-800">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-blue-600/5 border border-blue-500/20 mb-6">
              <div className="h-10 w-10 rounded-xl bg-blue-600/10 flex items-center justify-center flex-shrink-0">
                <Info className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-[10px] text-zinc-400 leading-relaxed font-medium">
                Object ready for high-fidelity transformation analysis and schema validation.
              </p>
            </div>
            <button className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white px-4 py-4 rounded-2xl text-sm font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 group active:scale-[0.98]">
              INITIALIZE ANALYSIS <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="group">
      <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] block mb-1 group-hover:text-zinc-500 transition-colors">{label}</span>
      <span className="text-sm text-zinc-200 font-bold tracking-tight">{value}</span>
    </div>
  );
}
