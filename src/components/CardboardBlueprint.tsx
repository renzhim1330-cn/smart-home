import React, { useState } from 'react';
import { Box, Check, Ruler, Eye, Scissors, Info, Sparkles } from 'lucide-react';

export const CardboardBlueprint: React.FC = () => {
  const [activeView, setActiveView] = useState<'3d' | 'elevation' | 'cutlist'>('3d');
  const [highlightZone, setHighlightZone] = useState<string | null>(null);

  const cutPieces = [
    { name: '① 底盘主基板 (发泡板)', dim: '35 cm × 22 cm', qty: '1 片', desc: '0.3cm高密度发泡板，整栋小屋承重底板，支撑整个结构' },
    { name: '② 室内高架二层地板', dim: '35 cm × 22 cm', qty: '1 片', desc: '抬高5cm形成下沉电源暗格，平放充电宝并开孔向下引线' },
    { name: '③ 左右侧立墙 (斜角梯形)', dim: '底宽22 cm × 前高16 cm × 后高26 cm', qty: '2 片', desc: '构成现代坡屋顶侧墙，左墙可开天窗百叶' },
    { name: '④ 室内后背遮挡主墙', dim: '35 cm × 26 cm', qty: '1 片', desc: '后方主背景墙，可手绘或贴“智馨家园”展板' },
    { name: '⑤ 坡面斜屋顶 (半开敞式)', dim: '36 cm × 14 cm', qty: '1 片', desc: '只盖住后半部分，前半部分敞开便于俯视互动' },
    { name: '⑥ 智能旋转入户门', dim: '6.5 cm × 11 cm', qty: '1 片', desc: '3mm发泡板门叶，门轴用微型活页合页固定，顶部与SG90直驱轴心嵌合' },
    { name: '⑦ 门禁立柱 (嵌装掌控板+拓展板堆叠总成)', dim: '8 cm × 14 cm (留方孔 5×5cm)', qty: '1 片', desc: '立式嵌装3铜柱紧固的三明治总成，正面露屏，右侧或下方贴装3×4薄膜键盘' },
    { name: '⑧ 展台互动操作指南立牌', dim: '12 cm × 8 cm (附三角形支脚)', qty: '1 片', desc: '放置在沙盘正前方，印/贴门禁键盘输入规则与离家布防说明' },
    { name: '⑨ 手机AP直连二维码立牌', dim: '10 cm × 7 cm (附三角形支脚)', qty: '1 片', desc: '放置在沙盘侧前方，印/贴Wi-Fi热点SSID与网页直连控制二维码' },
  ];

  return (
    <div className="space-y-6">
      {/* Constraints Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">
              0.3cm (3mm) PC/PVC发泡板高精蓝图
            </span>
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> 100%符合展台尺寸规则
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            微缩沙盘尺寸：35 cm (长) × 22 cm (宽) × 26 cm (高)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            采用白色高密度 3mm PVC/PC 发泡板（雪弗板），切面光滑白洁、高刚度防潮，搭配掌控板+拓展板铜柱堆叠总成
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700 shrink-0">
          <button
            onClick={() => setActiveView('3d')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeView === '3d' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Box className="w-3.5 h-3.5" /> 空间立体透视图
          </button>
          <button
            onClick={() => setActiveView('elevation')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeView === 'elevation' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Ruler className="w-3.5 h-3.5" /> 正视立面图与开孔
          </button>
          <button
            onClick={() => setActiveView('cutlist')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeView === 'cutlist' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" /> 发泡板裁切单 (7件)
          </button>
        </div>
      </div>

      {/* Main Structural Visual Canvas */}
      {activeView === '3d' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl p-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[460px]">
            {/* Legend / Status */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2 text-[11px]">
              <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> 35×22×26 cm 模型沙盘
              </span>
              <span className="px-2.5 py-1 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-400" /> 底座5cm下沉暗格机房
              </span>
              <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> 半开敞式斜屋顶
              </span>
            </div>

            {/* Isometric SVG Diagram */}
            <svg viewBox="0 0 600 400" className="w-full max-w-[560px] h-auto drop-shadow-2xl">
              <defs>
                <linearGradient id="wallGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#334155" />
                  <stop offset="100%" stopColor="#1e293b" />
                </linearGradient>
                <linearGradient id="roofGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#b45309" />
                  <stop offset="100%" stopColor="#78350f" />
                </linearGradient>
                <linearGradient id="baseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
                <linearGradient id="floorGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.05" />
                </linearGradient>
              </defs>

              {/* Grid guides */}
              <line x1="50" y1="360" x2="550" y2="360" stroke="#334155" strokeDasharray="3 3" opacity="0.4" />

              {/* 1. Base Cavity / Basement (Underground 5cm) */}
              <g
                onMouseEnter={() => setHighlightZone('basement')}
                onMouseLeave={() => setHighlightZone(null)}
                className="cursor-pointer transition-opacity"
                opacity={highlightZone === 'basement' || !highlightZone ? 1 : 0.4}
              >
                {/* Basement Box */}
                <polygon points="120,310 400,270 480,310 200,350" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.5" />
                <polygon points="120,310 200,350 200,380 120,340" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5" />
                <polygon points="200,350 480,310 480,340 200,380" fill="#111827" stroke="#3b82f6" strokeWidth="1.5" />
                
                {/* Cable Cavity Text */}
                <text x="320" y="355" fill="#60a5fa" fontSize="12" fontWeight="bold" textAnchor="middle">
                  下沉式暗格 (高 5cm) · 平放收纳充电宝与全屋理线
                </text>
              </g>

              {/* 2. House Back Wall & Left Wall */}
              <g
                onMouseEnter={() => setHighlightZone('walls')}
                onMouseLeave={() => setHighlightZone(null)}
                className="cursor-pointer transition-opacity"
                opacity={highlightZone === 'walls' || !highlightZone ? 1 : 0.4}
              >
                {/* Back Wall */}
                <polygon points="120,310 400,270 400,100 120,140" fill="url(#wallGrad)" stroke="#475569" strokeWidth="1.5" />
                
                {/* Left Wall (Trapezoid from high back to lower front) */}
                <polygon points="120,310 200,350 200,200 120,140" fill="#2d3748" stroke="#64748b" strokeWidth="1.5" />
                
                {/* Living Room Area Floor */}
                <polygon points="135,305 385,270 465,305 215,340" fill="url(#floorGrad)" stroke="#38bdf8" strokeDasharray="2 2" />
                <text x="300" y="300" fill="#94a3b8" fontSize="11" textAnchor="middle">客厅展区 (摆放温湿度AHT20与RGB氛围灯)</text>
              </g>

              {/* 3. Roof (Half open) */}
              <g
                onMouseEnter={() => setHighlightZone('roof')}
                onMouseLeave={() => setHighlightZone(null)}
                className="cursor-pointer transition-opacity"
                opacity={highlightZone === 'roof' || !highlightZone ? 1 : 0.4}
              >
                <polygon points="110,135 410,95 430,160 130,200" fill="url(#roofGrad)" stroke="#d97706" strokeWidth="2" opacity="0.85" />
                <text x="270" y="150" fill="#fde68a" fontSize="11" fontWeight="bold">半开敞式斜屋檐 (高 26cm)</text>
              </g>

              {/* 4. Smart Entrance & mPython 2.0 Door Station */}
              <g
                onMouseEnter={() => setHighlightZone('door')}
                onMouseLeave={() => setHighlightZone(null)}
                className="cursor-pointer transition-opacity"
                opacity={highlightZone === 'door' || !highlightZone ? 1 : 0.4}
              >
                {/* Door Frame */}
                <polygon points="220,345 280,335 280,240 220,250" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
                
                {/* Rotating Door Panel (driven by SG90) */}
                <polygon points="220,345 250,370 250,275 220,250" fill="#f59e0b" fillOpacity="0.4" stroke="#fbbf24" strokeWidth="2" />
                <circle cx="222" cy="298" r="3" fill="#ef4444" />
                <text x="235" y="320" fill="#fbbf24" fontSize="10" fontWeight="bold">入户门</text>

                {/* mPython Controller embedded on Door Wall */}
                <rect x="290" y="245" width="45" height="55" rx="3" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                <rect x="297" y="255" width="31" height="22" rx="2" fill="#0284c7" />
                <text x="312" y="270" fill="#ffffff" fontSize="7" textAnchor="middle" fontWeight="bold">OLED</text>
                <circle cx="300" cy="287" r="2.5" fill="#eab308" />
                <circle cx="312" cy="287" r="2.5" fill="#eab308" />
                <circle cx="324" cy="287" r="2.5" fill="#eab308" />
                <text x="312" y="315" fill="#38bdf8" fontSize="9" textAnchor="middle" fontWeight="bold">掌控板+扩展板总成</text>
              </g>

              {/* Dimension Annotations */}
              {/* Length: 35cm */}
              <line x1="200" y1="395" x2="480" y2="355" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrow)" />
              <text x="340" y="390" fill="#34d399" fontSize="12" fontWeight="bold">长 35 cm (&lt; 38 cm)</text>

              {/* Width: 22cm */}
              <line x1="105" y1="345" x2="185" y2="385" stroke="#10b981" strokeWidth="2" />
              <text x="130" y="380" fill="#34d399" fontSize="11" fontWeight="bold">宽 22 cm</text>

              {/* Height: 26cm */}
              <line x1="90" y1="310" x2="90" y2="140" stroke="#10b981" strokeWidth="2" />
              <text x="45" y="230" fill="#34d399" fontSize="12" fontWeight="bold">高 26 cm</text>
            </svg>

            <div className="text-xs text-slate-400 mt-2 text-center">
              💡 鼠标悬停在上方模型区域，可高亮查看各个关键功能区的结构设计与走线
            </div>
          </div>

          {/* Right Column: Zone Insights */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <h3 className="font-bold text-sm text-white flex items-center gap-2 mb-3">
                <Eye className="w-4 h-4 text-blue-400" /> 结构亮点深度解析
              </h3>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                  <div className="font-semibold text-blue-300 flex items-center gap-1.5">
                    <span>1. 双层底座暗格（平放充电宝与走线槽）</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    掌控板2.0与拓展板采用三根双通铜柱螺丝背靠背紧固，形成约1.8cm厚的刚性三明治总成。立式嵌装在入户门门禁柱上。底座5厘米暗格专门用于平放收纳5V充电宝，并将所有传感器与键盘排线垂直引至暗格内，桌面无任何外露飞线。
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                  <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
                    <span>2. 门禁立柱一体嵌装与 3×4 矩阵键盘</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    在大门侧面开出 5cm×5cm 方孔，掌控板屏幕朝外当作“可视门禁对讲屏”；门边贴装标准 3×4 薄膜键盘，用于输入6位数字密码及“*”一键布防；门梁横梁开槽倒扣安装 SG90 舵机，轴心同轴直接带动大门旋转，无连杆晃动。
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                  <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                    <span>3. 半开敞式斜屋檐与双展台立牌</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    后高26cm、前高16cm的坡形设计，屋顶仅覆盖后半截，评委低头即可一览无余地看清舵机转动与RGB灯效。沙盘前配置“操作指南立牌”与“AP扫码立牌”，即使评委不听讲解也能自助体验连网与按键开门。
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-800/40 rounded-2xl p-4 text-xs text-indigo-200">
              <div className="flex items-center gap-1.5 font-bold mb-1 text-indigo-300">
                <Sparkles className="w-4 h-4" /> 0.3cm 发泡板制作小窍门
              </div>
              <p className="leading-relaxed">
                发泡板切割时，使用大号美工刀贴紧钢尺轻划2~3刀即可整齐裁下，切口平整洁白；板件直角拼接推荐使用 502 快干胶，瞬间冷焊固化，结构强度高且无胶痕。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Elevation View */}
      {activeView === 'elevation' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Ruler className="w-4 h-4 text-blue-400" /> 正视立面图与开孔坐标
            </h3>
            <span className="text-xs text-slate-400 font-mono">单位: 厘米 (cm)</span>
          </div>

          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 flex items-center justify-center">
            <svg viewBox="0 0 700 320" className="w-full max-w-[650px] h-auto">
              {/* Outer Boundary Frame */}
              <rect x="50" y="30" width="600" height="260" fill="#0f172a" stroke="#475569" strokeWidth="2" rx="4" />

              {/* Basement floor line */}
              <line x1="50" y1="240" x2="650" y2="240" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 2" />
              <text x="350" y="265" fill="#60a5fa" fontSize="13" fontWeight="bold" textAnchor="middle">
                底座走线隐藏夹层 (高度: 5 cm)
              </text>

              {/* Entrance Door Hole */}
              <rect x="80" y="90" width="90" height="150" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" rx="2" />
              {/* SG90 Servo embedded in transom beam */}
              <rect x="95" y="80" width="35" height="15" fill="#3b82f6" stroke="#93c5fd" strokeWidth="1" rx="1" />
              <text x="112" y="91" fill="#ffffff" fontSize="7" textAnchor="middle">SG90顶置</text>
              <text x="125" y="165" fill="#f59e0b" fontSize="12" fontWeight="bold" textAnchor="middle">
                入户门开孔
              </text>
              <text x="125" y="185" fill="#94a3b8" fontSize="9" textAnchor="middle">
                宽 6.5cm × 高 11cm
              </text>

              {/* 3x4 Membrane Keypad Mounted Beside Door */}
              <rect x="180" y="105" width="45" height="60" fill="#0f172a" stroke="#eab308" strokeWidth="1.5" rx="3" />
              <text x="202" y="118" fill="#eab308" fontSize="7" textAnchor="middle" fontWeight="bold">3×4薄膜键盘</text>
              <g fill="#475569" stroke="#64748b" strokeWidth="0.5">
                {[0, 1, 2, 3].map((r) =>
                  [0, 1, 2].map((c) => (
                    <rect key={`${r}-${c}`} x={186 + c * 11} y={122 + r * 10} width="8" height="7" rx="1" />
                  ))
                )}
              </g>
              <text x="202" y="172" fill="#94a3b8" fontSize="6.5" textAnchor="middle">开孔排线入暗格</text>

              {/* mPython 2.0 Station cutout */}
              <rect x="235" y="100" width="75" height="95" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" rx="4" />
              <rect x="248" y="112" width="48" height="35" fill="#0284c7" rx="2" />
              <text x="272" y="133" fill="#ffffff" fontSize="9" textAnchor="middle" fontWeight="bold">
                OLED开孔
              </text>
              <text x="272" y="170" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">
                掌控板+拓展板
              </text>
              <text x="272" y="183" fill="#64748b" fontSize="7" textAnchor="middle">
                (背面三铜柱堆叠)
              </text>

              {/* Window Cutout */}
              <rect x="360" y="80" width="120" height="90" fill="#1e293b" stroke="#10b981" strokeWidth="2" rx="2" />
              <line x1="420" y1="80" x2="420" y2="170" stroke="#10b981" strokeWidth="1.5" />
              <line x1="360" y1="125" x2="480" y2="125" stroke="#10b981" strokeWidth="1.5" />
              <text x="420" y="195" fill="#34d399" fontSize="11" textAnchor="middle">
                通风窗 / 自动百叶
              </text>

              {/* PIR Sensor hole */}
              <circle cx="560" cy="120" r="16" fill="#1e293b" stroke="#ec4899" strokeWidth="2" />
              <text x="560" y="155" fill="#f472b6" fontSize="10" textAnchor="middle">
                PIR红外探头 (Φ 2.3cm)
              </text>

              {/* Dimension Callouts */}
              {/* Total Width 35cm */}
              <line x1="50" y1="15" x2="650" y2="15" stroke="#10b981" strokeWidth="1.5" />
              <text x="350" y="12" fill="#34d399" fontSize="11" textAnchor="middle" fontWeight="bold">
                总长度: 35 cm
              </text>

              {/* Total Height 26cm */}
              <line x1="30" y1="30" x2="30" y2="290" stroke="#10b981" strokeWidth="1.5" />
              <text x="25" y="160" fill="#34d399" fontSize="11" textAnchor="middle" fontWeight="bold" transform="rotate(-90,25,160)">
                总高: 26 cm
              </text>
            </svg>
          </div>
        </div>
      )}

      {/* Cutlist View */}
      {activeView === 'cutlist' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Scissors className="w-4 h-4 text-amber-400" /> 0.3cm PC/PVC发泡板精确裁切下料单
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                准备2~3张40×60cm的3mm白色高密度发泡板（雪弗板），用钢直尺与大号美工刀按尺寸下料，502快干胶粘接
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
              共 9 块发泡板组件 (含2块展台立牌)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/50">
                  <th className="py-3 px-4 font-semibold">组件序号与名称</th>
                  <th className="py-3 px-4 font-semibold">裁切长宽尺寸</th>
                  <th className="py-3 px-4 font-semibold">数量</th>
                  <th className="py-3 px-4 font-semibold">功能与安装定位</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {cutPieces.map((p, i) => (
                  <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-medium text-white">{p.name}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-cyan-300">{p.dim}</td>
                    <td className="py-3 px-4 font-mono text-amber-300">{p.qty}</td>
                    <td className="py-3 px-4 text-slate-300">{p.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3 text-xs text-blue-200">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-blue-300">发泡板施工与少儿加分建议：</span>
              发泡板与发泡板之间使用 502 胶水可达到瞬间冷焊熔接效果，坚固平整且毫无胶痕；板面洁白平整，建议让孩子用马克笔在白色墙面上亲手绘制窗帘、门牌或花园绿植，既有工程级的工整刚度，又富有小学生真实动手创作的童趣加分项！
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
