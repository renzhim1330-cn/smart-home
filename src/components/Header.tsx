import React from 'react';
import { 
  Home, 
  ShieldCheck, 
  ShieldAlert, 
  Activity, 
  Cpu, 
  Flame, 
  Bell, 
  Sliders, 
  Compass, 
  Zap, 
  History 
} from 'lucide-react';
import { SecurityMode, SystemHomeMode } from '../types';

interface HeaderProps {
  currentTab: 'devices' | 'automations' | 'energy' | 'prototype' | 'architecture';
  setCurrentTab: (tab: 'devices' | 'automations' | 'energy' | 'prototype' | 'architecture') => void;
  homeMode: SystemHomeMode;
  setHomeMode: (mode: SystemHomeMode) => void;
  securityMode: SecurityMode;
  onEmergencyTrigger: () => void;
  onOpenActivityLog: () => void;
  unreadAlertsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  homeMode,
  setHomeMode,
  securityMode,
  onEmergencyTrigger,
  onOpenActivityLog,
  unreadAlertsCount,
}) => {
  const modes: SystemHomeMode[] = ['Home', 'Away', 'Night', 'Vacation', 'Cinema', 'Eco'];

  const getSecurityBadge = () => {
    switch (securityMode) {
      case 'armed-away':
        return { text: 'Armed Away', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: ShieldCheck };
      case 'armed-home':
        return { text: 'Armed Home', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: ShieldCheck };
      case 'alarm-triggered':
        return { text: 'ALARM ACTIVE', color: 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse', icon: ShieldAlert };
      case 'emergency-fire':
        return { text: 'FIRE EVACUATION', color: 'bg-red-600/30 text-red-300 border-red-500/50 animate-bounce', icon: Flame };
      case 'lockdown':
        return { text: 'Lockdown', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: ShieldAlert };
      default:
        return { text: 'Disarmed', color: 'bg-slate-800 text-slate-400 border-slate-700', icon: ShieldCheck };
    }
  };

  const badge = getSecurityBadge();
  const BadgeIcon = badge.icon;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Logo and System Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Home className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg text-white tracking-tight">Smart Home OS</h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                  v2.4 Matter
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Mesh Hub Online · Villa Horizon
              </p>
            </div>
          </div>

          {/* Mobile Quick Action Buttons */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onOpenActivityLog}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white relative"
              aria-label="Activity Log"
            >
              <Bell className="w-4 h-4" />
              {unreadAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadAlertsCount}
                </span>
              )}
            </button>
            <button
              onClick={onEmergencyTrigger}
              className="px-2.5 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-1"
            >
              <Flame className="w-3.5 h-3.5" />
              SOS
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800/80 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setCurrentTab('devices')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
              currentTab === 'devices'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Device Dashboard
          </button>
          <button
            onClick={() => setCurrentTab('automations')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
              currentTab === 'automations'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Automations & Scenes
          </button>
          <button
            onClick={() => setCurrentTab('energy')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
              currentTab === 'energy'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Solar & Energy
          </button>
          <button
            onClick={() => setCurrentTab('prototype')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
              currentTab === 'prototype'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-amber-400/90 hover:text-amber-300 hover:bg-slate-800/50'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Logic State Prototype
          </button>
          <button
            onClick={() => setCurrentTab('architecture')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
              currentTab === 'architecture'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Domain & Wayfinder
          </button>
        </nav>

        {/* Mode Selector and System Controls */}
        <div className="hidden md:flex items-center gap-3">
          {/* Security state badge */}
          <div className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 ${badge.color}`}>
            <BadgeIcon className="w-3.5 h-3.5" />
            <span>{badge.text}</span>
          </div>

          {/* Mode Pill Dropdown */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            {modes.slice(0, 3).map((mode) => (
              <button
                key={mode}
                onClick={() => setHomeMode(mode)}
                className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                  homeMode === mode
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Activity Log Button */}
          <button
            onClick={onOpenActivityLog}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 relative transition-colors"
            title="Activity Timeline"
          >
            <History className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {/* Emergency SOS button */}
          <button
            onClick={onEmergencyTrigger}
            className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95"
          >
            <Flame className="w-3.5 h-3.5" />
            Emergency SOS
          </button>
        </div>

      </div>
    </header>
  );
};
