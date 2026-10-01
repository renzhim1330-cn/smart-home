import React, { useState } from 'react';
import { PINOUT_LIST, WiringPin } from '../data/projectData';
import { GitFork, ShieldCheck, Zap, Info } from 'lucide-react';

export const WiringDiagram: React.FC = () => {
  const [selectedPin, setSelectedPin] = useState<string | null>('P0 (GPIO 0)');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30 flex items-center gap-1">
              <GitFork className="w-3 h-3" /> 引脚走线与电路拓扑
            </span>
            <span className="text-xs text-slate-400">掌控板2.0 + I/O扩展板接口分布</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            智能家居传感器与执行器接线拓扑
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            严格区分3.3V信号线与5V动力电源线，保障小学生接线安全，防止短路与断电重启
          </p>
        </div>

        <div className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 text-xs text-slate-300 space-y-1">
          <div className="text-slate-400 font-semibold">标准三色线序口诀：</div>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className="text-rose-400">● 红色: VCC 正极</span>
            <span className="text-amber-300">● 棕/黑: GND 地线</span>
            <span className="text-emerald-400">● 黄/蓝: Signal 信号</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Diagram & List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Graphic Circuit Visual */}
        <div className="lg:col-span-6 bg-slate-950 border border-slate-800 rounded-2xl p-6 relative flex flex-col items-center justify-center min-h-[460px]">
          <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" /> 掌控板与外设连接拓扑图
          </h3>

          <svg viewBox="0 0 540 400" className="w-full max-w-[520px] h-auto">
            {/* Center: mPython Controller Board + Expansion Board Sandwich */}
            <rect x="180" y="90" width="180" height="200" rx="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
            
            {/* mPython 1.3 inch OLED Screen */}
            <rect x="205" y="110" width="130" height="70" rx="4" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="270" y="135" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
              1.3" OLED 门禁对讲屏
            </text>
            <text x="270" y="155" fill="#bae6fd" fontSize="9" textAnchor="middle">
              实时回显密码 [ * * * ] 与环境
            </text>

            {/* 3 RGB LEDs */}
            <circle cx="230" cy="200" r="7" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1.5" />
            <circle cx="270" cy="200" r="7" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1.5" />
            <circle cx="310" cy="200" r="7" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="270" y="222" fill="#e2e8f0" fontSize="9" textAnchor="middle">
              板载 3 颗 WS2812 状态灯
            </text>

            {/* Standoff Sandwich Label */}
            <rect x="195" y="238" width="150" height="40" rx="4" fill="#1e293b" stroke="#64748b" />
            <text x="270" y="255" fill="#38bdf8" fontSize="9" textAnchor="middle" fontWeight="bold">
              三铜柱螺丝背靠背堆叠
            </text>
            <text x="270" y="270" fill="#94a3b8" fontSize="8" textAnchor="middle">
              拓展板引脚 P0~P16 排针朝内
            </text>

            {/* External Device 1: SG90 Door Servo (Left Top) */}
            <g
              onClick={() => setSelectedPin('P0 (GPIO 0)')}
              className="cursor-pointer group"
            >
              <rect x="15" y="50" width="125" height="58" rx="6" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
              <text x="77" y="74" fill="#f59e0b" fontSize="11" fontWeight="bold" textAnchor="middle">
                SG90 顶置直驱舵机
              </text>
              <text x="77" y="93" fill="#94a3b8" fontSize="8.5" textAnchor="middle">
                P0 控制线 (5V独立动力)
              </text>
              {/* Wire P0 */}
              <path d="M 140 79 Q 160 79 180 115" stroke="#f59e0b" strokeWidth="2" fill="none" strokeDasharray="3 3" />
            </g>

            {/* External Device 2: 3x4 Matrix Keypad (Left Bottom) */}
            <g
              onClick={() => setSelectedPin('P15, P16, P9')}
              className="cursor-pointer group"
            >
              <rect x="15" y="160" width="125" height="75" rx="6" fill="#1e293b" stroke="#eab308" strokeWidth="2" />
              <text x="77" y="185" fill="#eab308" fontSize="11" fontWeight="bold" textAnchor="middle">
                3×4 矩阵薄膜键盘
              </text>
              <text x="77" y="205" fill="#94a3b8" fontSize="8.5" textAnchor="middle">
                P2-P14 行 / P15,P16,P9 列
              </text>
              <text x="77" y="222" fill="#34d399" fontSize="8" textAnchor="middle">
                7P 排线直插拓展板 (原P4改P9)
              </text>
              {/* Wire Keypad */}
              <path d="M 140 197 Q 160 197 180 200" stroke="#eab308" strokeWidth="2.5" fill="none" />
            </g>

            {/* External Device 3: DHT11 Temp & Humi (Right Top) */}
            <g
              onClick={() => setSelectedPin('P1 (GPIO 1)')}
              className="cursor-pointer group"
            >
              <rect x="395" y="50" width="130" height="58" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
              <text x="460" y="74" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
                DHT11 温湿度传感器
              </text>
              <text x="460" y="93" fill="#94a3b8" fontSize="8.5" textAnchor="middle">
                P1 单总线数据 (3.3V供电)
              </text>
              {/* Wire P1 */}
              <path d="M 395 79 Q 375 79 360 115" stroke="#38bdf8" strokeWidth="2" fill="none" />
            </g>

            {/* External Device 4: PIR Motion Sensor (Right Bottom) */}
            <g
              onClick={() => setSelectedPin('P8 (GPIO 18)')}
              className="cursor-pointer group"
            >
              <rect x="395" y="165" width="130" height="65" rx="6" fill="#1e293b" stroke="#ec4899" strokeWidth="2" />
              <text x="460" y="190" fill="#ec4899" fontSize="11" fontWeight="bold" textAnchor="middle">
                PIR 人体红外防盗
              </text>
              <text x="460" y="210" fill="#94a3b8" fontSize="8.5" textAnchor="middle">
                P8 数字电平检测 (非触控)
              </text>
              {/* Wire P8 */}
              <path d="M 395 197 Q 375 197 360 210" stroke="#ec4899" strokeWidth="2" fill="none" strokeDasharray="3 3" />
            </g>

            {/* External Device 5: 5V Power Supply / USB (Bottom Center) */}
            <rect x="200" y="325" width="140" height="42" rx="6" fill="#1e293b" stroke="#10b981" strokeWidth="2" />
            <text x="270" y="348" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">
              5V 充电宝独立动力
            </text>
            <text x="270" y="362" fill="#94a3b8" fontSize="8.5" textAnchor="middle">
              底座暗格平放 · 杜绝舵机重启
            </text>
            <path d="M 270 325 L 270 290" stroke="#10b981" strokeWidth="3" />
          </svg>

          <div className="text-[11px] text-slate-400 mt-2 text-center">
            点击外设模块查看详细引脚电平定义与接线注意事项
          </div>
        </div>

        {/* Right: Detailed Pin List */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
              引脚功能与供电分配表
            </h3>
            <span className="text-xs text-slate-400">共 8 个接口/板载资源</span>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {PINOUT_LIST.map((pin) => {
              const isSelected = selectedPin === pin.pin;
              return (
                <div
                  key={pin.pin}
                  onClick={() => setSelectedPin(pin.pin)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800 border-blue-500 shadow-md ring-1 ring-blue-500/40'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {pin.pin}
                      </span>
                      <span className="font-semibold text-sm text-white">{pin.device}</span>
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                      {pin.vccReq}
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 mt-2">
                    <span className="text-slate-400">功能说明: </span>
                    {pin.function}
                  </div>

                  <div className="text-[11px] text-slate-400 mt-1 flex items-start gap-1">
                    <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>注意事项: {pin.notes}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs text-purple-200 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-purple-300">少儿创客电气安全守则：</strong>
              扩展板接好后，请务必用绝缘电工胶布对裸露金属焊点进行包覆，杜绝掉落的回形针、剪刀等金属物引起短路。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
