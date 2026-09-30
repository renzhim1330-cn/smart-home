import React, { useState } from 'react';
import { PYTHON_CODE } from '../data/projectData';
import { Code2, Copy, Check, FileCode, Terminal, Sparkles, Cpu, CheckCircle2, ChevronRight, Zap, ExternalLink } from 'lucide-react';

export const CodeWorkspace: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'main_code' | 'vscode_setup' | 'unit_tests' | 'ai_prompts'>('vscode_setup');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);
  const [activeUnitTest, setActiveUnitTest] = useState<'keypad' | 'servo' | 'sensors' | 'fan_light' | 'voice'>('keypad');

  const unitTestScripts = {
    keypad: {
      name: 'test_keypad.py',
      title: '3×4 矩阵薄膜键盘独立测试',
      desc: '插好 P2~P16 排线后运行，按下 1~9、0、*、#，测试屏幕回显与按 123456# 验证',
      code: `# ==============================================================================
# 单元测试 1：3×4 矩阵薄膜键盘独立扫描测试
# 用途：测试 P2, P3, P13, P14 (行) 与 P15, P16, P4 (列) 连线
# ==============================================================================
from mpython import *
import time
from machine import Pin

ROW_PINS = [Pin(Pin.P2, Pin.IN, Pin.PULL_UP), Pin(Pin.P3, Pin.IN, Pin.PULL_UP),
            Pin(Pin.P13, Pin.IN, Pin.PULL_UP), Pin(Pin.P14, Pin.IN, Pin.PULL_UP)]
COL_PINS = [Pin(Pin.P15, Pin.OUT), Pin(Pin.P16, Pin.OUT), Pin(Pin.P4, Pin.OUT)]

KEY_MAP = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#']
]

def scan():
    for c_idx, col in enumerate(COL_PINS):
        for c in COL_PINS: c.value(1)
        col.value(0)
        time.sleep_us(25)
        for r_idx, row in enumerate(ROW_PINS):
            if row.value() == 0:
                for c in COL_PINS: c.value(1)
                return KEY_MAP[r_idx][c_idx]
    return None

oled.fill(0)
oled.DispChar("3x4 键盘测试启动", 15, 15)
oled.DispChar("请按实体键输入...", 10, 35)
oled.show()

buf = ""
while True:
    k = scan()
    if k:
        if k == '*': buf = ""
        elif k == '#':
            oled.fill(0)
            oled.DispChar("验证: " + buf, 15, 20)
            oled.show()
            try: buzzer.pitch(1000 if buf == "123456" else 400, 200)
            except: pass
            time.sleep(1.2)
            buf = ""
        else:
            if len(buf) < 6: buf += k
        oled.fill(0)
        oled.DispChar("按键: " + k + " 缓存: " + buf, 10, 25)
        oled.show()
        try: buzzer.pitch(800, 50)
        except: pass
        time.sleep(0.28)`
    },
    servo: {
      name: 'test_servo.py',
      title: 'SG90 门梁顶置直驱舵机测试',
      desc: '插好 P0 信号线与外接 5V 动力电后运行，测试大门在 0°(关) 与 90°(开) 平顺旋转',
      code: `# ==============================================================================
# 单元测试 2：SG90 微型舵机开门与闭门角度测试
# 用途：测试 P0 信号线与外接 5V 独立供电稳定性，杜绝舵机拉垮主控
# ==============================================================================
from mpython import *
import time
from machine import Pin, PWM

servo_pwm = PWM(Pin(Pin.P0), freq=50)

def set_angle(angle):
    duty = int(25 + (angle / 180.0) * 100)
    servo_pwm.duty(duty)

oled.fill(0)
oled.DispChar("SG90 舵机测试中", 12, 15)
oled.show()

while True:
    oled.fill(0)
    oled.DispChar("舵机: 0度 (关门)", 15, 25)
    oled.show()
    set_angle(0)
    time.sleep(3)

    oled.fill(0)
    oled.DispChar("舵机: 90度 (开门)", 15, 25)
    oled.show()
    set_angle(90)
    try: buzzer.pitch(880, 100)
    except: pass
    time.sleep(3)`
    },
    sensors: {
      name: 'test_sensors.py',
      title: 'DHT11温湿度与PIR防盗测试',
      desc: 'DHT11接P1、PIR接P8；对着传感器哈气观察升温>28℃，在探头前挥手观察报警',
      code: `# ==============================================================================
# 单元测试 3：DHT11 温湿度与 PIR 人体红外防盗测试
# 用途：测试 P1 单总线与 P8 红外探头，少儿哈热气升温 >28℃ 触发红灯
# ==============================================================================
from mpython import *
import time
import dht
from machine import Pin

dht_dev = dht.DHT11(Pin(Pin.P1))
pir_dev = Pin(Pin.P8, Pin.IN)

while True:
    t, h = 25.0, 50.0
    try:
        dht_dev.measure()
        t = dht_dev.temperature()
        h = dht_dev.humidity()
    except Exception:
        pass

    pir_val = pir_dev.value()

    oled.fill(0)
    oled.DispChar("温度:{:.1f}C 湿度:{}%".format(t, int(h)), 6, 12)
    if t > 28.0:
        oled.DispChar("! 高温 >28C 自动排风 !", 5, 32)
        rgb.fill((255, 0, 0)) # 红灯
        rgb.write()
    elif pir_val == 1:
        oled.DispChar("! PIR感应入侵 !", 10, 32)
        rgb.fill((0, 150, 255)) # 蓝灯
        rgb.write()
    else:
        oled.DispChar("环境正常 守卫中", 12, 32)
        rgb.fill((0, 0, 0))
        rgb.write()
    oled.show()
    time.sleep(1.5)`
    },
    fan_light: {
      name: 'test_fan_light.py',
      title: '实体客厅吊灯 (P11) 与排风扇 (P5) 测试',
      desc: 'P11接吊灯模块，P5接微型风扇；自动循环测试：仅开灯、仅开扇、全开、全关',
      code: `# ==============================================================================
# 单元测试 4：客厅实体吸顶吊灯 (P11) 与智能微型风扇 (P5) 测试
# 用途：测试 P11 实体白光 LED 照亮室内 与 P5 微型直流风扇旋转吹风
# ==============================================================================
from mpython import *
import time
from machine import Pin

light_pin = Pin(Pin.P11, Pin.OUT)
fan_pin = Pin(Pin.P5, Pin.OUT)

step = 0
while True:
    step = (step + 1) % 4
    if step == 0:
        light_pin.value(1); fan_pin.value(0)
        oled.fill(0); oled.DispChar("客厅吊灯: [开启]", 15, 20); oled.DispChar("风扇: [关闭]", 20, 40); oled.show()
    elif step == 1:
        light_pin.value(0); fan_pin.value(1)
        oled.fill(0); oled.DispChar("客厅吊灯: [关闭]", 15, 20); oled.DispChar("风扇: [吹风中]", 15, 40); oled.show()
    elif step == 2:
        light_pin.value(1); fan_pin.value(1)
        oled.fill(0); oled.DispChar("【全开模式】", 20, 20); oled.DispChar("吊灯:亮 风扇:转", 10, 40); oled.show()
    else:
        light_pin.value(0); fan_pin.value(0)
        oled.fill(0); oled.DispChar("【节能全关】", 20, 20); oled.DispChar("吊灯:灭 风扇:停", 10, 40); oled.show()
    time.sleep(3)`
    },
    voice: {
      name: 'test_voice.py',
      title: '离线语音识别模块 (ASR01) 串口测试',
      desc: 'P6(RX)/P7(TX) 接语音模块，唤醒“小智同学”，说“打开客厅灯”，观察串口指令与回显',
      code: `# ==============================================================================
# 单元测试 5：离线语音识别模块 (ASR01/HLK-V20) 串口通信测试
# 用途：测试 P6 (RX) / P7 (TX) 串口，听懂“小智同学”与“打开客厅灯/风扇”
# ==============================================================================
from mpython import *
import time
from machine import UART

uart = UART(1, baudrate=9600, rx=Pin.P6, tx=Pin.P7)
oled.fill(0)
oled.DispChar("语音模块监听中", 15, 15)
oled.DispChar("请喊:【小智同学】", 10, 35)
oled.show()

while True:
    if uart.any():
        raw = uart.read()
        print("收到语音数据:", raw)
        oled.fill(0)
        oled.DispChar("收到语音口令!", 15, 15)
        oled.DispChar(str(raw), 10, 35)
        oled.show()
        try: buzzer.pitch(1000, 100)
        except: pass
        time.sleep(1.5)
        oled.fill(0)
        oled.DispChar("继续监听语音...", 15, 25)
        oled.show()
    time.sleep(0.05)`
    }
  };

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
        <div className="flex flex-wrap bg-slate-800/80 p-1 rounded-xl border border-slate-700 shrink-0 gap-1">
          <button
            onClick={() => setActiveSubTab('vscode_setup')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeSubTab === 'vscode_setup' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" /> VS Code 安装与固化指南
          </button>
          <button
            onClick={() => setActiveSubTab('unit_tests')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeSubTab === 'unit_tests' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" /> 门外汉独立测试脚本 (3个)
          </button>
          <button
            onClick={() => setActiveSubTab('main_code')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeSubTab === 'main_code' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" /> main.py 全功能源码
          </button>
          <button
            onClick={() => setActiveSubTab('ai_prompts')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeSubTab === 'ai_prompts' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> AI 编程提示词
          </button>
        </div>
      </div>

      {/* Unit Tests Tab */}
      {activeSubTab === 'unit_tests' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" /> 接好一个测一个 · 零基础单元测试程序
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                避免一次性插完所有线导致无法排查故障。每插好一个硬件模块，就在 VS Code 中运行对应的测试脚本！
              </p>
            </div>

            <div className="flex flex-wrap bg-slate-950 p-1 rounded-xl border border-slate-800 gap-1">
              {(['keypad', 'servo', 'sensors', 'fan_light', 'voice'] as const).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveUnitTest(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeUnitTest === key
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {unitTestScripts[key].name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-slate-900 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-emerald-400 mr-2">
                  {unitTestScripts[activeUnitTest].name}
                </span>
                <span className="text-xs text-slate-300 font-semibold">
                  {unitTestScripts[activeUnitTest].title}
                </span>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  测试要点: {unitTestScripts[activeUnitTest].desc}
                </div>
              </div>

              <button
                onClick={() => copyCode(unitTestScripts[activeUnitTest].code)}
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
                    <span>复制测试代码</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-5 overflow-x-auto max-h-[460px] overflow-y-auto">
              <pre className="font-mono text-xs text-slate-300 leading-relaxed whitespace-pre">
                {unitTestScripts[activeUnitTest].code}
              </pre>
            </div>
          </div>
        </div>
      )}

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
