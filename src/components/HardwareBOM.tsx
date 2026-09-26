import React, { useState } from 'react';
import { HARDWARE_LIST, HardwareItem } from '../data/projectData';
import { ShoppingCart, AlertTriangle, Search, Copy, Check } from 'lucide-react';

export const HardwareBOM: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredItems = HARDWARE_LIST.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.searchKeyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyKeyword = (item: HardwareItem) => {
    navigator.clipboard.writeText(item.searchKeyword);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="space-y-6">
      {/* BOM Summary Bar */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30 flex items-center gap-1">
              <ShoppingCart className="w-3 h-3" /> 创客自购BOM清单
            </span>
            <span className="text-xs text-slate-400">所有硬件材料均可在淘宝/京东自行采购</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            掌控板2.0 智能家居套件与耗材清单
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            核心主控 + 背靠背堆叠拓展板 + 3×4薄膜键盘 + 舵机与传感器 + 3mm发泡板，总预算约 <span className="text-emerald-400 font-bold font-mono">¥160 ~ 210 元</span>
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="搜索器件或关键词..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Buying Pitfalls Alert */}
      <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200/90 space-y-1">
          <div className="font-bold text-amber-300">硬件选购四大致命避坑指南 (必读)：</div>
          <ul className="list-disc list-inside space-y-0.5 text-slate-300">
            <li><strong className="text-white">认准“背靠背铜柱堆叠式”掌控拓展板：</strong> 选购掌控板2.0配套的盛思/标准拓展板，带有3个固定通孔，使用3根双通铜柱与螺丝在背面拧紧紧固，板面厚度仅约1.8cm，可直接立装在发泡板门柱上。</li>
            <li><strong className="text-white">矩阵薄膜键盘选标准 7-Pin 接口：</strong> 购买带 2.54mm 杜邦排线母头的 3×4 矩阵薄膜键盘，撕下背面背胶即可紧密贴附在 3mm 发泡板门边。</li>
            <li><strong className="text-white">舵机务必选“180度角度舵机”：</strong> 淘宝上许多SG90是“360度连续旋转舵机”（用于小车车轮），买错将无法通过程序控制大门停在90度开门位。</li>
            <li><strong className="text-white">电源必须稳定：</strong> 舵机转动瞬间需要大电流，请使用带独立稳压供电的拓展板，将5V独立接到舵机红线，避免主控板反复重启。</li>
          </ul>
        </div>
      </div>

      {/* Items Cards / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-base text-white">{item.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{item.spec}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-mono font-bold text-sm text-emerald-400">{item.estPrice}</div>
                  <div className="text-[11px] text-slate-400">数量: {item.quantity}</div>
                </div>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="text-slate-400 font-semibold">项目作用:</span>
                  <span>{item.purpose}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="text-slate-400 font-semibold">引脚接法:</span>
                  <span className="font-mono text-cyan-300">{item.pinConnect}</span>
                </div>
              </div>

              {/* Pitfall note */}
              <div className="text-[11px] text-rose-300/90 bg-rose-950/30 p-2 rounded border border-rose-900/30 flex items-start gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                <span>避坑提醒: {item.avoidPitfall}</span>
              </div>
            </div>

            {/* Keyword copy footer */}
            <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
              <div className="text-slate-400">
                搜索词: <span className="text-blue-300 font-mono font-semibold">{item.searchKeyword}</span>
              </div>
              <button
                onClick={() => copyKeyword(item)}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                {copiedId === item.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">已复制</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>复制搜词</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
