import React, { useState } from 'react';
import { PYTHON_CODE } from '../data/projectData';
import { Code2, Copy, Check, FileCode, Terminal, Sparkles, Cpu, CheckCircle2, ChevronRight, Zap, ExternalLink } from 'lucide-react';

export const CodeWorkspace: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'main_code' | 'vscode_setup' | 'ai_prompts'>('vscode_setup');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

  const copyCode = (text: string, isPrompt = false, promptId = '') => {
    navigator.clipboard.writeText(text);
    if (isPrompt) {
      setCopiedPrompt(promptId);
      setTimeout(() => setCopiedPrompt(null), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const aiPrompts = [
    {
      id: 'p1',
      title: '提示词 1：让 AI 增加一个新传感器功能（如雨滴/火焰）',
      prompt: `你是一名精通 ESP32 和掌控板 2.0 (mPython) 的 MicroPython 资深工程师。
现在我的智能家居项目中，在 P2 引脚新增了一个数字雨滴传感器（高电平表示无雨，低电平表示下雨）。
请在我的 main.py 主循环中：
1. 每隔 1 秒检测一次 P2 引脚状态；
2. 当检测到下雨时，驱动 P1 引脚的百叶天窗舵机自动转到 0 度关闭天窗，并在 1.3寸 OLED 屏上显示“下雨自动关窗中”；
3. 保持现有的非阻塞结构与舵机平滑转动，不要使用 time.sleep 导致整个程序卡死。
请直接给出修改后的关键函数与整合代码。`
    },
    {
      id: 'p2',
      title: '提示词 2：让 AI 优化 MQTT 手机远程控制指令',
      prompt: `我在用 VS Code 编写掌控板 2.0 智能家居的 MicroPython 代码，正在对接 Easy IoT 物联网平台。
当前已订阅主题 smart_home/ctrl。请帮我扩充 on_mqtt_message 回调函数：
1. 收到 "SOS_ALARM" 时：板载 3 颗 WS2812 RGB 灯红蓝交替爆闪 10 次，蜂鸣器发出防盗警报音阶，OLED 显示“紧急防盗警报”；
2. 收到 "CHECK_STATUS" 时：将当前温度、湿度、门状态打包成标准 JSON 字符串，发布到 smart_home/status 主题。
请注意掌控板 2.0 板载模块名为 mpython，RGB 控制使用 rgb.fill() 与 rgb.write()。`
    },
    {
      id: 'p3',
      title: '提示词 3：让 AI 编写炫酷的 OLED 开机仪式感动画',
      prompt: `请为掌控板 2.0 (mPython MicroPython 固件) 编写一段优雅的开机启动动画与自检函数 boot_animation()：
1. 依次点亮板载的 3 颗 WS2812 RGB 全彩灯（从冷蓝渐变到翠绿）；
2. 在 1.3 寸 OLED (128x64) 屏幕上用居中艺术字显示项目名称：“★ 智 馨 家 园 ★” 与版本号 “mPython 2.0 IoT”；
3. 绘制进度条从 0% 加载到 100%；
4. 蜂鸣器播放一段轻快的开机和弦音；
5. 完成后舵机自动寻零复位，屏幕自动切换至实时监控仪表盘。`
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30 flex items-center gap-1">
              <Zap className="w-3 h-3" /> 纯 MicroPython + AI 方案已激活
            </span>
            <span className="text-xs text-slate-400">已告别手动拖拽积木 · 拥抱现代 AI 驱动开发</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            VS Code + AI (Copilot/Cursor) 掌控板 2.0 开发系统
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            代码完全由 AI 智能生成与维护，利用 VS Code 插件实现一键直连、串口烧录与真机调试
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700 shrink-0">
          <button
            onClick={() => setActiveSubTab('vscode_setup')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeSubTab === 'vscode_setup' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" /> VS Code vs Thonny 与插件配置
          </button>
          <button
            onClick={() => setActiveSubTab('main_code')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeSubTab === 'main_code' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" /> main.py 完整落地源码
          </button>
          <button
            onClick={() => setActiveSubTab('ai_prompts')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeSubTab === 'ai_prompts' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> AI 写代码提示词模版
          </button>
        </div>
      </div>

      {/* 1. VS Code vs Thonny & Setup Guide */}
      {activeSubTab === 'vscode_setup' && (
        <div className="space-y-6">
          {/* Comparison Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" /> 为什么选 VS Code？AI 支持度与生态全方位对比
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* VS Code */}
              <div className="bg-slate-950/80 p-5 rounded-xl border-2 border-emerald-500/50 space-y-3 relative overflow-hidden">
                <div className="absolute top-2 right-2 text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                  强烈推荐 (AI 绝配)
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
                    VS
                  </div>
                  <h4 className="font-bold text-white text-sm">Visual Studio Code (或 Cursor)</h4>
                </div>
                <ul className="text-xs text-slate-300 space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>顶级 AI 生态：</strong> 完美支持 GitHub Copilot、Continue、Claude Code 等插件，在编辑器内直接对 AI 提需求即可生成完整代码。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>掌控板一键烧录插件：</strong> 安装 <code>MicroPico</code> 插件后，按 <code>Ctrl+Alt+R</code> 直接将代码传到掌控板上运行。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>现代专业度：</strong> 支持 Git 版本管理、多文件工程结构与代码语法高亮。</span>
                  </li>
                </ul>
              </div>

              {/* Thonny */}
              <div className="bg-slate-950/50 p-5 rounded-xl border border-slate-800 space-y-3 opacity-75">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-slate-700 flex items-center justify-center font-bold text-slate-300 text-xs">
                    TH
                  </div>
                  <h4 className="font-bold text-slate-300 text-sm">Thonny IDE</h4>
                </div>
                <ul className="text-xs text-slate-400 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold shrink-0">✕</span>
                    <span><strong>几乎无现代 AI 插件：</strong> 没有 Copilot，无法在编辑器里呼出侧边栏让 AI 直接改文件，必须手动在网页复制粘贴。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold shrink-0">△</span>
                    <span><strong>仅适合初学者：</strong> 界面极其简陋，缺少现代化重构、代码片段与多窗口对比能力。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold shrink-0">✓</span>
                    <span><strong>唯一优点：</strong> 自带 Python 与免驱动串口识别，但随着 VS Code MicroPico 插件成熟，这一优势已不复存在。</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step-by-Step VS Code Setup */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Terminal className="w-4 h-4 text-blue-400" /> VS Code 极简三步上手掌控板 2.0 (纯 MicroPython)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 w-6 h-6 rounded flex items-center justify-center border border-blue-500/20">
                  1
                </div>
                <h4 className="font-bold text-sm text-white">安装 MicroPico 扩展</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  打开 VS Code 左侧扩展市场 (Ctrl+Shift+X)，搜索并安装：<strong className="text-blue-300">MicroPico</strong> (或 <strong className="text-blue-300">RT-Thread MicroPython</strong>)。同时安装你喜爱的 AI 助手（如 Copilot 或 Continue）。
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 w-6 h-6 rounded flex items-center justify-center border border-blue-500/20">
                  2
                </div>
                <h4 className="font-bold text-sm text-white">Type-C 连线插电脑</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  用附带的数据线将掌控板 2.0 插入电脑 USB 口。在 VS Code 底部状态栏点击 <code className="text-emerald-300">MicroPico: Connect</code>，状态栏变为绿色的 <code className="text-emerald-300">mPython Connected</code> 即连接成功！
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 w-6 h-6 rounded flex items-center justify-center border border-blue-500/20">
                  3
                </div>
                <h4 className="font-bold text-sm text-white">一键运行与写入</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  新建文件 <code className="text-amber-300">main.py</code>，粘贴下方代码。按快捷键 <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">Ctrl+Alt+R</kbd> 直接在板上实时运行；或右键选择 <strong className="text-amber-300">Upload project to Pico</strong> 保存为开机自动运行！
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. MicroPython Code */}
      {activeSubTab === 'main_code' && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="bg-slate-900 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-xs font-semibold text-slate-200">main.py (放入掌控板 2.0 根目录)</span>
            </div>
            <button
              onClick={() => copyCode(PYTHON_CODE)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors"
            >
              {copiedCode ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>已复制代码</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>一键复制代码</span>
                </>
              )}
            </button>
          </div>
          <div className="p-5 overflow-x-auto max-h-[600px] overflow-y-auto">
            <pre className="font-mono text-xs text-slate-300 leading-relaxed whitespace-pre">
              {PYTHON_CODE}
            </pre>
          </div>
        </div>
      )}

      {/* 3. AI Prompts Cheat Sheet */}
      {activeSubTab === 'ai_prompts' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" /> 专为掌控板 2.0 定制的 AI 编程提示词库
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  在 VS Code 中打开 AI 插件对话框，直接复制以下提示词发给 AI，让 AI 替你写代码，杜绝语法错误！
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {aiPrompts.map((p) => (
                <div key={p.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-cyan-300">{p.title}</h4>
                    <button
                      onClick={() => copyCode(p.prompt, true, p.id)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                    >
                      {copiedPrompt === p.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">已复制提示词</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>复制提示词</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-3 bg-slate-900 rounded-lg text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed border border-slate-800/80">
                    {p.prompt}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
