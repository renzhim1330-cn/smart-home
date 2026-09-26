import React from 'react';
import { Home, Compass, Cpu, Layers, GitFork, Code2, Wifi, Sparkles, CheckCircle2 } from 'lucide-react';

export type TabKey = 'wayfinder' | 'blueprint' | 'bom' | 'wiring' | 'code' | 'iot_sim' | 'presentation';

interface NavbarProps {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const navItems: { key: TabKey; label: string; icon: React.ReactNode; badge?: string }[] = [
    { key: 'wayfinder', label: 'Wayfinder 路线图', icon: <Compass className="w-4 h-4" />, badge: '6个决策' },
    { key: 'blueprint', label: '发泡板尺寸与图纸', icon: <Layers className="w-4 h-4" />, badge: '<38×25×34cm' },
    { key: 'bom', label: '硬件BOM与选购', icon: <Cpu className="w-4 h-4" /> },
    { key: 'wiring', label: '引脚走线与电路', icon: <GitFork className="w-4 h-4" /> },
    { key: 'code', label: 'VS Code + AI Python', icon: <Code2 className="w-4 h-4" /> },
    { key: 'iot_sim', label: 'IoT与沙盘仿真', icon: <Wifi className="w-4 h-4" />, badge: '可互动' },
    { key: 'presentation', label: '少儿5分钟答辩台本', icon: <Sparkles className="w-4 h-4" /> },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Home className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg text-white tracking-tight">掌控板2.0 智能家居IoT项目全案</h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3 h-3" /> 小学创客Demo
              </span>
            </div>
            <p className="text-xs text-slate-400">
              0.3cm PC/PVC发泡板模型 · 掌控板+拓展板三铜柱堆叠 · 严格尺寸 (长35 × 宽22 × 高26 cm)
            </p>
          </div>
        </div>

        {/* Size Badge */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs">
          <span className="text-slate-400">展品极限尺寸:</span>
          <span className="font-mono text-cyan-300 font-semibold">&lt;38 × &lt;25 × &lt;34 cm</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">方案选定:</span>
          <span className="font-mono text-emerald-300 font-semibold">35 × 22 × 26 cm</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-x-auto scrollbar-none flex gap-1 border-t border-slate-800/60 pt-1 pb-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? 'bg-blue-800/80 text-blue-200'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
