import React from 'react';
import { LightbulbOff, Lock, Leaf, Play, ShieldAlert, Sparkles, Check } from 'lucide-react';

interface QuickActionsBarProps {
  onAllLightsOff: () => void;
  onLockAllDoors: () => void;
  onSetEcoTemp: () => void;
  onRunRoboVac: () => void;
  onTriggerTestAlarm: () => void;
  onRunCinemaScene: () => void;
  lastActionFeedback?: string | null;
}

export const QuickActionsBar: React.FC<QuickActionsBarProps> = ({
  onAllLightsOff,
  onLockAllDoors,
  onSetEcoTemp,
  onRunRoboVac,
  onTriggerTestAlarm,
  onRunCinemaScene,
  lastActionFeedback,
}) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5 mb-6 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Quick Home Controls:</span>
          {lastActionFeedback && (
            <span className="flex items-center gap-1 text-[11px] font-normal text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 animate-fade-in">
              <Check className="w-3 h-3" /> {lastActionFeedback}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={onAllLightsOff}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-medium transition-all active:scale-95 whitespace-nowrap"
          >
            <LightbulbOff className="w-3.5 h-3.5 text-amber-400" />
            All Lights Off
          </button>

          <button
            onClick={onLockAllDoors}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-medium transition-all active:scale-95 whitespace-nowrap"
          >
            <Lock className="w-3.5 h-3.5 text-blue-400" />
            Lock All Doors
          </button>

          <button
            onClick={onSetEcoTemp}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-medium transition-all active:scale-95 whitespace-nowrap"
          >
            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
            Eco Climate 19°C
          </button>

          <button
            onClick={onRunCinemaScene}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-medium transition-all active:scale-95 whitespace-nowrap"
          >
            <Play className="w-3.5 h-3.5 text-purple-400" />
            Cinema Scene
          </button>

          <button
            onClick={onTriggerTestAlarm}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-950/70 text-red-300 hover:text-red-200 border border-red-800/50 text-xs font-medium transition-all active:scale-95 whitespace-nowrap"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            Test Siren
          </button>
        </div>
      </div>
    </div>
  );
};
