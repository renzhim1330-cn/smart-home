import React, { useState } from 'react';
import { TICKETS, DecisionTicket } from '../data/projectData';
import { Compass, CheckCircle2, ChevronRight, Lock, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const WayfinderRoadmap: React.FC<{ onNavigateTab: (tab: any) => void }> = ({ onNavigateTab }) => {
  const [selectedTicketId, setSelectedTicketId] = useState<string>(TICKETS[0].id);

  const selectedTicket = TICKETS.find((t) => t.id === selectedTicketId) || TICKETS[0];

  const getCategoryColor = (cat: DecisionTicket['category']) => {
    switch (cat) {
      case 'structure':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'hardware':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'wiring':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      case 'software':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'iot':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'presentation':
        return 'text-pink-400 bg-pink-500/10 border-pink-500/30';
    }
  };

  const getCategoryLabel = (cat: DecisionTicket['category']) => {
    switch (cat) {
      case 'structure': return '结构与尺寸';
      case 'hardware': return '硬件BOM';
      case 'wiring': return '引脚拓扑';
      case 'software': return '核心程序';
      case 'iot': return '云端物联';
      case 'presentation': return '展示答辩';
    }
  };

  return (
    <div className="space-y-6">
      {/* Wayfinder Mission Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950/60 p-6 rounded-2xl border border-slate-700/80 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" /> Wayfinder Canonical Map
              </span>
              <span className="text-xs text-slate-400">#MAP-001 · 终点清晰定位</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              掌控板2.0少儿创客项目 · 决策路线图全景
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              根据小学生认知规律、参赛评委评分标准以及严格尺寸（长&lt;38cm、宽&lt;25cm、高&lt;34cm）约束，将项目解构成6大关键决策工单，消除试错迷雾，直接通达落地实物。
            </p>
          </div>
          <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-2 shrink-0">
            <div className="text-left md:text-right">
              <div className="text-xs text-slate-400">决策完成度</div>
              <div className="text-xl font-bold text-emerald-400 font-mono flex items-center gap-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> 6 / 6 决策已推演完毕
              </div>
            </div>
            <div className="text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              前沿探索: <span className="text-white font-medium">即插即用·无短路防反接</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Tickets List & Detailed Ticket Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Tickets Navigation */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
              阶段决策工单 (Decision Tickets)
            </h3>
            <span className="text-xs text-slate-400">点击查看决策详情与答辩技巧</span>
          </div>

          <div className="space-y-2.5">
            {TICKETS.map((ticket, idx) => {
              const isSelected = ticket.id === selectedTicketId;
              return (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-slate-800/90 border-blue-500 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/50'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/50 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-slate-400">
                        0{idx + 1}
                      </span>
                      <span className={`text-[11px] px-2 py-0.5 rounded border font-medium ${getCategoryColor(ticket.category)}`}>
                        {getCategoryLabel(ticket.category)}
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-medium">
                      <CheckCircle2 className="w-3 h-3" /> 已决策
                    </span>
                  </div>

                  <h4 className="font-semibold text-sm text-white mt-2 group-hover:text-blue-300">
                    {ticket.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {ticket.summary}
                  </p>

                  {ticket.blockedBy && ticket.blockedBy.length > 0 && (
                    <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-400">
                      <Lock className="w-3 h-3 text-slate-400" />
                      <span>前置工单:</span>
                      {ticket.blockedBy.map((b) => (
                        <span key={b} className="font-mono text-xs text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded">
                          {b}
                        </span>
                      ))}
                    </div>
                  )}

                  {isSelected && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <ChevronRight className="w-5 h-5 text-blue-400" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Ticket Deep-Dive */}
        <div className="lg:col-span-7">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-blue-400 border border-slate-700 font-semibold">
                    {selectedTicket.id}
                  </span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${getCategoryColor(selectedTicket.category)}`}>
                    {getCategoryLabel(selectedTicket.category)}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mt-2">
                  {selectedTicket.title}
                </h3>
              </div>
              <div className="shrink-0">
                <span className="flex items-center gap-1 text-xs text-emerald-300 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/40">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 经工程验证
                </span>
              </div>
            </div>

            {/* Core Implementation Plan */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> 实施方案与技术规范
              </h4>
              <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 text-sm text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                {selectedTicket.detailedPlan}
              </div>
            </div>

            {/* Key Decisions */}
            <div className="space-y-2">
              <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> 核心权衡与决策依据 (Key Decisions)
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {selectedTicket.keyDecisions.map((kd, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{kd}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Kid Friendly Tip */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold mb-1">
                <Sparkles className="w-4 h-4" /> 小创客答辩加分贴士
              </div>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                {selectedTicket.kidFriendlyTip}
              </p>
            </div>

            {/* Quick Navigation to specialized views */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">查看配套的交互模块：</span>
              {selectedTicket.category === 'structure' && (
                <button
                  onClick={() => onNavigateTab('blueprint')}
                  className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20"
                >
                  打开硬纸板切割蓝图 <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              {selectedTicket.category === 'hardware' && (
                <button
                  onClick={() => onNavigateTab('bom')}
                  className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20"
                >
                  打开硬件采购清单 <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              {selectedTicket.category === 'wiring' && (
                <button
                  onClick={() => onNavigateTab('wiring')}
                  className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20"
                >
                  打开电路引脚拓扑图 <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              {selectedTicket.category === 'software' && (
                <button
                  onClick={() => onNavigateTab('code')}
                  className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20"
                >
                  查看完整程序源码 <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              {selectedTicket.category === 'iot' && (
                <button
                  onClick={() => onNavigateTab('iot_sim')}
                  className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20"
                >
                  打开IoT模拟控制台 <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              {selectedTicket.category === 'presentation' && (
                <button
                  onClick={() => onNavigateTab('presentation')}
                  className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20"
                >
                  演练5分钟答辩台本 <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
