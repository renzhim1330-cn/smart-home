import React from 'react';
import { Thermometer, Zap, Shield, ToggleRight, Sun, BatteryCharging, Wind } from 'lucide-react';
import { Device, EnergyMetrics, SecurityMode } from '../types';

interface OverviewWidgetsProps {
  devices: Device[];
  energy: EnergyMetrics;
  securityMode: SecurityMode;
  onNavigateTab: (tab: 'devices' | 'automations' | 'energy' | 'prototype' | 'architecture') => void;
}

export const OverviewWidgets: React.FC<OverviewWidgetsProps> = ({
  devices,
  energy,
  securityMode,
  onNavigateTab,
}) => {
  const activeCount = devices.filter((d) => {
    if (d.category === 'light') return d.isOn;
    if (d.category === 'media') return d.isPlaying;
    if (d.category === 'vacuum') return d.status === 'cleaning';
    return d.isOnline;
  }).length;

  const totalLightsOn = devices.filter((d) => d.category === 'light' && d.isOn).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* 1. Device Summary Card */}
      <div 
        onClick={() => onNavigateTab('devices')}
        className="group relative bg-slate-900/70 hover:bg-slate-900 border border-slate-800/80 hover:border-indigo-500/40 rounded-2xl p-4.5 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-indigo-500/5"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
            <ToggleRight className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            All Online
          </span>
        </div>
        <div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {activeCount} <span className="text-sm font-normal text-slate-400">/ {devices.length}</span>
          </div>
          <div className="text-xs text-slate-400 font-medium mt-1">
            Active Devices · <span className="text-indigo-400">{totalLightsOn} Lights On</span>
          </div>
        </div>
      </div>

      {/* 2. Climate & Indoor Comfort */}
      <div 
        onClick={() => onNavigateTab('devices')}
        className="group relative bg-slate-900/70 hover:bg-slate-900 border border-slate-800/80 hover:border-amber-500/40 rounded-2xl p-4.5 cursor-pointer transition-all duration-200 shadow-sm"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
            <Thermometer className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <Wind className="w-3.5 h-3.5 text-cyan-400" />
            48% Humidity
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold text-white tracking-tight flex items-baseline gap-2">
            21.5°C 
            <span className="text-xs font-normal text-slate-400">Target 22.0°C</span>
          </div>
          <div className="text-xs text-slate-400 font-medium mt-1">
            Indoor Comfort · <span className="text-amber-400">Outside 18.2°C</span>
          </div>
        </div>
      </div>

      {/* 3. Solar Generation & Battery */}
      <div 
        onClick={() => onNavigateTab('energy')}
        className="group relative bg-slate-900/70 hover:bg-slate-900 border border-slate-800/80 hover:border-emerald-500/40 rounded-2xl p-4.5 cursor-pointer transition-all duration-200 shadow-sm"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
            <Sun className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <BatteryCharging className="w-3 h-3" />
            {energy.batteryPercentage}%
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold text-white tracking-tight flex items-baseline gap-2">
            {energy.solarGenerationKw} <span className="text-sm font-normal text-emerald-400">kW Solar</span>
          </div>
          <div className="text-xs text-slate-400 font-medium mt-1">
            Home Load: <span className="text-slate-300 font-mono">{energy.currentLoadKw} kW</span> (Exporting)
          </div>
        </div>
      </div>

      {/* 4. Security Perimeter Status */}
      <div 
        onClick={() => onNavigateTab('prototype')}
        className="group relative bg-slate-900/70 hover:bg-slate-900 border border-slate-800/80 hover:border-blue-500/40 rounded-2xl p-4.5 cursor-pointer transition-all duration-200 shadow-sm"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
            Zero Breaches
          </span>
        </div>
        <div>
          <div className="text-2xl font-bold text-white tracking-tight capitalize">
            {securityMode.replace('-', ' ')}
          </div>
          <div className="text-xs text-slate-400 font-medium mt-1">
            Deadbolts Locked · Perimeter Armed
          </div>
        </div>
      </div>

    </div>
  );
};
