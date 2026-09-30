import React, { useState, useEffect } from 'react';
import { Wifi, Smartphone, Unlock, Sun, Flame, Thermometer, Droplets, Radio, Shield, ShieldAlert, KeyRound, Lightbulb, Fan, Mic, Volume2 } from 'lucide-react';

export const IoTSimulator: React.FC = () => {
  // Simulated hardware state
  const [doorOpen, setDoorOpen] = useState(false);
  const [doorCountdown, setDoorCountdown] = useState(0);
  const [rgbColor, setRgbColor] = useState<'off' | 'yellow' | 'blue' | 'red' | 'strobe'>('off');
  const [temp, setTemp] = useState(24);
  const [humi, setHumi] = useState(54);
  const [lightLevel, setLightLevel] = useState(650);

  // Ceiling Light (P11) & Mini DC Fan (P5)
  const [lightOn, setLightOn] = useState(false);
  const [fanOn, setFanOn] = useState(false);
  const [autoFanTriggered, setAutoFanTriggered] = useState(false);
  const [voiceBubble, setVoiceBubble] = useState<string | null>(null);
  
  // 3x4 Keypad & Security state
  const [currentPwd, setCurrentPwd] = useState('123456');
  const [inputBuffer, setInputBuffer] = useState('');
  const [isArmed, setIsArmed] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [webNewPwd, setWebNewPwd] = useState('');
  const [oledMessage, setOledMessage] = useState('智馨家园 · 系统就绪');
  const [isModifyingPwd, setIsModifyingPwd] = useState(false);
  const [modifyStep, setModifyStep] = useState<1 | 2>(1);
  const [resetCountdown, setResetCountdown] = useState<number | null>(null);
  const [webLogs, setWebLogs] = useState<{ id: string; time: string; action: string; ip: string }[]>([
    { id: '1', time: '10:00:01', action: 'AP热点启动 SSID: SmartHome-IoT', ip: '192.168.4.1' },
    { id: '2', time: '10:00:03', action: '离线语音模块 UART1 监听就绪 (P6/P7)', ip: '串口UART' },
    { id: '3', time: '10:00:05', action: '客厅实体吊灯(P11)与排风扇(P5)就绪', ip: '拓展板GPIO' }
  ]);

  // Handle Offline Voice Command
  const handleVoiceCommand = (cmdText: string, actionType: 'LIGHT_ON' | 'LIGHT_OFF' | 'FAN_ON' | 'FAN_OFF') => {
    setVoiceBubble(`“${cmdText}” ➔ 语音芯片播报: 在呢!`);
    setTimeout(() => setVoiceBubble(null), 3500);

    const now = new Date().toLocaleTimeString();
    if (actionType === 'LIGHT_ON') {
      setLightOn(true);
      setOledMessage('语音指令: 客厅吊灯已开启');
      setWebLogs((prev) => [
        { id: Date.now().toString(), time: now, action: `[离线语音UART] 识别成功 -> 点亮客厅吊灯 (P11)`, ip: '语音芯片' },
        ...prev.slice(0, 9)
      ]);
    } else if (actionType === 'LIGHT_OFF') {
      setLightOn(false);
      setOledMessage('语音指令: 客厅吊灯已关闭');
      setWebLogs((prev) => [
        { id: Date.now().toString(), time: now, action: `[离线语音UART] 识别成功 -> 关闭客厅吊灯 (P11)`, ip: '语音芯片' },
        ...prev.slice(0, 9)
      ]);
    } else if (actionType === 'FAN_ON') {
      setFanOn(true);
      setAutoFanTriggered(false);
      setOledMessage('语音指令: 微型风扇已启动');
      setWebLogs((prev) => [
        { id: Date.now().toString(), time: now, action: `[离线语音UART] 识别成功 -> 启动微型风扇 (P5)`, ip: '语音芯片' },
        ...prev.slice(0, 9)
      ]);
    } else if (actionType === 'FAN_OFF') {
      setFanOn(false);
      setAutoFanTriggered(false);
      setOledMessage('语音指令: 微型风扇已停止');
      setWebLogs((prev) => [
        { id: Date.now().toString(), time: now, action: `[离线语音UART] 识别成功 -> 停止微型风扇 (P5)`, ip: '语音芯片' },
        ...prev.slice(0, 9)
      ]);
    }
  };

  // High Temp > 28℃ Auto-Fan override
  useEffect(() => {
    if (temp > 28) {
      if (!fanOn) {
        setFanOn(true);
        setAutoFanTriggered(true);
        setOledMessage(`高温 ${temp}℃ > 28℃: 自动排风中`);
        setRgbColor('red');
        const now = new Date().toLocaleTimeString();
        setWebLogs((prev) => [
          { id: Date.now().toString(), time: now, action: `[温控联动] DHT11检测到${temp}℃ > 28℃ -> 自动急速排风 (P5)`, ip: 'DHT11温控' },
          ...prev.slice(0, 9)
        ]);
      }
    } else if (autoFanTriggered && temp <= 27.5) {
      setFanOn(false);
      setAutoFanTriggered(false);
      setRgbColor('off');
      setOledMessage('室温恢复正常 · 排风停止');
    }
  }, [temp, fanOn, autoFanTriggered]);

  // Handle Button A 6-Second Reset (Safety Airbag)
  const triggerButtonAReset = () => {
    if (resetCountdown !== null) return;
    setResetCountdown(6);
    setOledMessage('! 恢复出厂设置中 ! 按住A键: 6 秒...');

    let count = 6;
    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setResetCountdown(count);
        setOledMessage(`! 恢复出厂设置中 ! 按住A键: ${count} 秒...`);
      } else {
        clearInterval(interval);
        setResetCountdown(null);
        setCurrentPwd('123456');
        setDoorOpen(false);
        setDoorCountdown(0);
        setIsArmed(false);
        setWrongAttempts(0);
        setInputBuffer('');
        setIsModifyingPwd(false);
        setLightOn(false);
        setFanOn(false);
        setAutoFanTriggered(false);
        setRgbColor('yellow');
        setOledMessage('★ 系统已硬核复位 · 密码: 123456 ★');
        setTimeout(() => setRgbColor('off'), 2000);

        const now = new Date().toLocaleTimeString();
        setWebLogs((prev) => [
          { id: Date.now().toString(), time: now, action: '[安全气囊复位] 掌控板A键长按6秒 -> 出厂123456+全设备复位', ip: '实体A键' },
          ...prev.slice(0, 9)
        ]);
      }
    }, 1000);
  };

  // Handle Door Open
  const triggerDoorOpen = (source: string) => {
    setDoorOpen(true);
    setDoorCountdown(4);
    setRgbColor('yellow');
    setIsArmed(false);
    setWrongAttempts(0);
    setInputBuffer('');
    setIsModifyingPwd(false);
    setOledMessage('★ 密码验证通过 ★ 欢迎回家!');

    const now = new Date().toLocaleTimeString();
    setWebLogs((prev) => [
      { id: Date.now().toString(), time: now, action: `[验证通过] 门梁舵机直驱90°开门 (${source})`, ip: '192.168.4.1' },
      ...prev.slice(0, 9)
    ]);
  };

  // Trigger Security Alarm (Non-touch)
  const triggerSecurityAlarm = (reason: string) => {
    setRgbColor('strobe');
    setOledMessage(`! 警报: ${reason} !`);
    const now = new Date().toLocaleTimeString();
    setWebLogs((prev) => [
      { id: Date.now().toString(), time: now, action: `[紧急警报] ${reason} -> 红蓝爆闪+警笛!`, ip: '安防系统' },
      ...prev.slice(0, 9)
    ]);
    setTimeout(() => {
      setRgbColor(isArmed ? 'blue' : 'off');
      setOledMessage(isArmed ? '【智馨家园·布防中】' : '智馨家园 · 门禁就绪');
    }, 4000);
  };

  // Handle 3x4 Matrix Keypad Press
  const handleKeypadPress = (key: string) => {
    if (doorOpen || resetCountdown !== null) return;

    if (key.match(/[0-9]/)) {
      if (inputBuffer.length < 6) {
        const next = inputBuffer + key;
        setInputBuffer(next);
        if (isModifyingPwd) {
          setOledMessage(modifyStep === 1 ? `验原密: [ ${'*'.repeat(next.length)} ]` : `设新密: [ ${'*'.repeat(next.length)} ]`);
        } else {
          setOledMessage(`密码输入: [ ${'*'.repeat(next.length)} ]`);
        }
      }
    } else if (key === '*') {
      if (inputBuffer.length > 0) {
        setInputBuffer('');
        setIsModifyingPwd(false);
        setOledMessage('输入已清空 · 请输6位密码');
      } else {
        setIsModifyingPwd(true);
        setModifyStep(1);
        setInputBuffer('');
        setOledMessage('【修改密码】请输原密码并按#');
      }
    } else if (key === '#') {
      if (isModifyingPwd) {
        if (modifyStep === 1) {
          if (inputBuffer === currentPwd) {
            setModifyStep(2);
            setInputBuffer('');
            setOledMessage('原密码正确! 请输6位新密码按#');
          } else {
            setIsModifyingPwd(false);
            setInputBuffer('');
            setOledMessage('✘ 原密码错误 退出修改');
          }
        } else if (modifyStep === 2) {
          if (inputBuffer.length === 6) {
            const nextPwd = inputBuffer;
            setCurrentPwd(nextPwd);
            setIsModifyingPwd(false);
            setInputBuffer('');
            setOledMessage(`★ 密码修改成功: ${nextPwd} ★`);
            const now = new Date().toLocaleTimeString();
            setWebLogs((prev) => [
              { id: Date.now().toString(), time: now, action: `[键盘改密] 校验通过 -> 新密码 [${nextPwd}]`, ip: '3×4键盘' },
              ...prev.slice(0, 9)
            ]);
          } else {
            setOledMessage('新密码必须为6位数字!');
          }
        }
      } else {
        if (inputBuffer === currentPwd) {
          triggerDoorOpen('3×4 矩阵键盘按键');
        } else {
          const attempts = wrongAttempts + 1;
          setWrongAttempts(attempts);
          setInputBuffer('');
          if (attempts >= 3) {
            triggerSecurityAlarm('密码连续输错3次锁定');
            setWrongAttempts(0);
          } else {
            setRgbColor('red');
            setOledMessage(`✘ 密码错误 (剩${3 - attempts}次)`);
            setTimeout(() => {
              setRgbColor('off');
              setOledMessage('智馨家园 · 请重新输入');
            }, 1500);
          }
        }
      }
    }
  };

  // Door auto-close countdown
  useEffect(() => {
    if (doorCountdown > 0) {
      const timer = setTimeout(() => {
        setDoorCountdown((c) => c - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (doorOpen && doorCountdown === 0) {
      setDoorOpen(false);
      setRgbColor('off');
      setOledMessage('大门已关闭 · 门禁就绪');
    }
  }, [doorCountdown, doorOpen]);

  // Handle Web Change Password
  const handleWebChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (webNewPwd.length === 6 && /^\d+$/.test(webNewPwd)) {
      setCurrentPwd(webNewPwd);
      setWebNewPwd('');
      setOledMessage(`手机更新密码: ${webNewPwd}`);
      const now = new Date().toLocaleTimeString();
      setWebLogs((prev) => [
        { id: Date.now().toString(), time: now, action: `HTTP GET /setpwd -> 新密码 [${webNewPwd}]`, ip: '192.168.4.2' },
        ...prev.slice(0, 9)
      ]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/30 via-slate-900 to-indigo-900/30 border border-blue-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30 flex items-center gap-1">
              <Wifi className="w-3.5 h-3.5 text-blue-400" /> AP局域网直连 (SmartHome-IoT)
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
              3×4 矩阵键盘门禁
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
              顶置门梁同轴直驱
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1">
            智能门禁与沙盘实时互动仿真器 (默认密码: {currentPwd})
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            在下方 3×4 矩阵键盘上点击按键输入密码按 # 确认；或按 * 开启离家布防并测试 PIR 红外防盗！
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleKeypadPress('*')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isArmed
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 animate-pulse'
                : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{isArmed ? '【布防中 - 点击撤防】' : '点击开启【离家布防】'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 3D Miniature Model & Hardware Box */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-blue-400" />
                沙盘实物动态透视 (35×22×26 cm 发泡板)
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400">门状态:</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-bold ${
                    doorOpen ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {doorOpen ? `已开启 (90°) [${doorCountdown}s后自动关闭]` : '闭合锁定 (0°)'}
                </span>
              </div>
            </div>

            {/* Visual House Silhouette */}
            <div className={`relative h-72 rounded-xl border border-slate-800 p-4 flex items-end justify-between overflow-hidden transition-all duration-700 ${
              lightOn
                ? 'bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-900 shadow-[inset_0_0_80px_rgba(251,191,36,0.15)]'
                : 'bg-gradient-to-b from-slate-950 to-slate-900'
            }`}>
              {/* Roof slope outline */}
              <div className="absolute top-2 left-4 right-4 h-12 border-t-2 border-r-2 border-slate-700 rounded-tr-3xl opacity-40 pointer-events-none" />

              {/* Ceiling Light (P11) hanging from roof */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                <div className="w-0.5 h-6 bg-slate-500" />
                <div className={`relative flex items-center justify-center p-2 rounded-full border transition-all duration-500 ${
                  lightOn
                    ? 'bg-amber-100 border-amber-300 shadow-[0_0_40px_#fde047] scale-110'
                    : 'bg-slate-800 border-slate-600'
                }`}>
                  <Lightbulb className={`w-5 h-5 ${lightOn ? 'text-amber-500 animate-pulse' : 'text-slate-500'}`} />
                  {lightOn && (
                    <div className="absolute top-8 w-48 h-36 bg-gradient-to-b from-amber-300/25 via-amber-400/10 to-transparent pointer-events-none rounded-b-full blur-[2px]" />
                  )}
                </div>
                <span className="text-[9px] font-bold text-amber-300 bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-700 mt-1">
                  P11 客厅吊灯: {lightOn ? '大亮' : '灭'}
                </span>
              </div>

              {/* Mini DC Fan (P5) mounted on back wall */}
              <div className="absolute top-4 right-32 flex flex-col items-center z-10">
                <div className={`p-2 rounded-xl border transition-all duration-300 ${
                  fanOn
                    ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                    : 'bg-slate-900 border-slate-700'
                }`}>
                  <Fan className={`w-6 h-6 ${fanOn ? 'text-cyan-300 animate-spin' : 'text-slate-500'}`} />
                </div>
                <span className="text-[9px] font-bold text-cyan-300 bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-700 mt-1">
                  P5 风扇: {fanOn ? (autoFanTriggered ? '高温排风' : '吹风中') : '停止'}
                </span>
              </div>

              {/* Voice Speech Bubble (when triggered) */}
              {voiceBubble && (
                <div className="absolute top-14 left-6 z-20 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xl border border-blue-400 animate-bounce flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-amber-300" />
                  <span>{voiceBubble}</span>
                </div>
              )}

              {/* Entrance Doorway with Top-Mounted Direct-Drive SG90 Servo */}
              <div className="relative w-28 h-52 border-2 border-slate-700 bg-slate-950/80 rounded-t-lg flex flex-col justify-between p-1.5 z-10">
                {/* Top-mounted Servo inside transom beam */}
                <div className="w-full bg-slate-800/90 rounded border border-slate-700 p-1 flex items-center justify-between text-[9px] text-amber-300">
                  <span>SG90 顶置直驱</span>
                  <span className="font-mono">{doorOpen ? '90°' : '0°'}</span>
                </div>

                {/* Rotating Door Leaf */}
                <div
                  className={`w-full h-38 bg-gradient-to-r from-slate-200 to-white text-slate-800 rounded font-bold text-xs flex flex-col items-center justify-center shadow-lg transition-all duration-700 origin-left border-l-4 border-amber-600 ${
                    doorOpen
                      ? 'scale-x-15 -skew-y-12 opacity-80 shadow-2xl translate-x-1'
                      : 'scale-x-100 opacity-100'
                  }`}
                >
                  <div className="text-[10px] text-slate-500">3mm发泡板</div>
                  <div className="text-xs">入户大门</div>
                  <div className="w-2 h-2 rounded-full bg-slate-800 absolute right-2 top-16" />
                </div>

                <div className="text-[9px] text-center text-slate-400">门轴微型合页</div>
              </div>

              {/* 3x4 Matrix Keypad Mounted on Wall */}
              <div className="flex flex-col items-center gap-1 bg-slate-950/90 p-2 rounded-xl border border-slate-800 shadow-md z-10">
                <span className="text-[9px] text-slate-400 font-semibold flex items-center gap-1">
                  <KeyRound className="w-3 h-3 text-amber-400" /> 3×4 薄膜键盘
                </span>
                <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1.5 rounded-lg border border-slate-700">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((k) => (
                    <button
                      key={k}
                      onClick={() => handleKeypadPress(k)}
                      className={`w-7 h-7 text-xs font-bold rounded flex items-center justify-center transition-all active:scale-90 ${
                        k === '#'
                          ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                          : k === '*'
                          ? 'bg-amber-600 text-white hover:bg-amber-500'
                          : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                      }`}
                    >
                      {k}
                    </button>
                  ))}
                </div>
                <span className="text-[8px] text-slate-500">按 # 确认，按 * 清空/布防</span>
              </div>

              {/* MPython 2.0 Screen & Stacked Board */}
              <div className="w-40 bg-slate-950 border border-slate-700 rounded-xl p-2.5 shadow-xl flex flex-col items-center z-10">
                <div className="w-full flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span>掌控板 1.3寸 OLED</span>
                  <span className={`w-2 h-2 rounded-full ${isArmed ? 'bg-cyan-400 animate-ping' : 'bg-emerald-500'}`} />
                </div>

                {/* Simulated OLED Screen */}
                <div className="w-full h-20 bg-black rounded border-2 border-slate-700 p-1.5 font-mono text-[9px] text-cyan-300 flex flex-col justify-between shadow-inner">
                  <div className="text-[9px] text-amber-400 truncate font-bold">{oledMessage}</div>
                  <div className="flex justify-between text-[8px] text-slate-400">
                    <span>{temp}℃/{humi}%</span>
                    <span>{temp > 28 ? '高温排风' : (isArmed ? '布防中' : '就绪')}</span>
                  </div>
                  <div className="text-[8px] text-emerald-400 truncate">
                    门:{doorOpen ? '开' : '关'} 灯:{lightOn ? '亮' : '灭'} 扇:{fanOn ? '转' : '停'}
                  </div>
                  <div className="text-[8px] text-slate-500">
                    密: {inputBuffer.length > 0 ? '*'.repeat(inputBuffer.length) : '[待输入]'}
                  </div>
                </div>

                {/* 3 Virtual RGB LEDs */}
                <div className="flex gap-3 py-1 mt-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full border transition-all duration-300 ${
                        rgbColor === 'yellow'
                          ? 'bg-amber-400 border-amber-300 shadow-[0_0_12px_#fbbf24]'
                          : rgbColor === 'blue'
                          ? 'bg-cyan-400 border-cyan-300 shadow-[0_0_12px_#22d3ee]'
                          : rgbColor === 'red'
                          ? 'bg-rose-500 border-rose-300 shadow-[0_0_12px_#f43f5e]'
                          : rgbColor === 'strobe'
                          ? 'bg-rose-600 border-cyan-300 shadow-[0_0_16px_#ef4444] animate-bounce'
                          : 'bg-slate-800 border-slate-700'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[8px] text-slate-500">三铜柱堆叠于背面</span>
              </div>
            </div>

            {/* Offline Voice Commands Bar */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Mic className="w-4 h-4 text-indigo-400 animate-pulse" />
                  “小智同学” 离线语音管家体验区 (免外网 · 串口直驱)
                </span>
                <span className="text-[10px] text-slate-500 font-mono">UART1: P6/P7 (9600)</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => handleVoiceCommand('小智同学，打开客厅灯', 'LIGHT_ON')}
                  className="px-2.5 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center justify-center gap-1 transition-all active:scale-95"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>喊：“打开客厅灯”</span>
                </button>
                <button
                  onClick={() => handleVoiceCommand('小智同学，关闭客厅灯', 'LIGHT_OFF')}
                  className="px-2.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1 transition-all active:scale-95"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-slate-500" />
                  <span>喊：“关闭客厅灯”</span>
                </button>
                <button
                  onClick={() => handleVoiceCommand('小智同学，打开风扇', 'FAN_ON')}
                  className="px-2.5 py-2 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center justify-center gap-1 transition-all active:scale-95"
                >
                  <Fan className="w-3.5 h-3.5 text-cyan-400" />
                  <span>喊：“打开风扇”</span>
                </button>
                <button
                  onClick={() => handleVoiceCommand('小智同学，关闭风扇', 'FAN_OFF')}
                  className="px-2.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1 transition-all active:scale-95"
                >
                  <Fan className="w-3.5 h-3.5 text-slate-500" />
                  <span>喊：“关闭风扇”</span>
                </button>
              </div>
            </div>

            {/* Non-Touch Security & Interactive Trigger Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
              <button
                onClick={() => {
                  setInputBuffer(currentPwd);
                  setTimeout(() => triggerDoorOpen('快捷输入密码'), 250);
                }}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-all active:scale-95"
              >
                <Unlock className="w-4 h-4 text-emerald-400" />
                <span>一键输密码 ({currentPwd})</span>
              </button>

              <button
                onClick={() => {
                  if (isArmed) {
                    triggerSecurityAlarm('PIR 人体红外感应到有人靠近');
                  } else {
                    triggerSecurityAlarm('检测到门前人员逗留');
                  }
                }}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${
                  isArmed
                    ? 'bg-rose-600/30 text-rose-300 border-rose-500/50 hover:bg-rose-600/40'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>PIR红外入侵检测</span>
              </button>

              <button
                onClick={() => setTemp((t) => (t >= 29 ? 24 : 31))}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${
                  temp >= 29
                    ? 'bg-rose-600/30 text-rose-300 border-rose-500/50'
                    : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                }`}
              >
                <Flame className="w-4 h-4 text-amber-400" />
                <span>{temp >= 29 ? '恢复正常室温 (24℃)' : '哈热气 (>28℃排风)'}</span>
              </button>

              <button
                onClick={triggerButtonAReset}
                disabled={resetCountdown !== null}
                className={`flex items-center justify-center gap-1.5 p-3 rounded-xl text-xs font-semibold border transition-all ${
                  resetCountdown !== null
                    ? 'bg-rose-950/80 text-rose-200 border-rose-500 animate-pulse'
                    : 'bg-indigo-950/40 hover:bg-indigo-900/50 text-indigo-200 border-indigo-700/60 active:scale-95'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                <span>
                  {resetCountdown !== null
                    ? `A键按住中 (${resetCountdown}s)...`
                    : '长按A键6秒 (安全气囊)'}
                </span>
              </button>
            </div>

            {/* Sliders */}
            <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-rose-400" /> DHT11 室内温度调控:
                  </span>
                  <span className="font-mono text-rose-300 font-bold">{temp} ℃ {temp > 28 && '(>28℃自动排风)'}</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="40"
                  value={temp}
                  onChange={(e) => setTemp(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Sun className="w-3.5 h-3.5 text-amber-400" /> 自然采光强度:
                  </span>
                  <span className="font-mono text-amber-300 font-bold">{lightLevel} Lux</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  value={lightLevel}
                  onChange={(e) => setLightLevel(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Simulated Mobile Phone AP Local Web Page */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl p-5 shadow-2xl space-y-4 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-blue-400" />
                <span className="font-bold text-sm text-white">手机 AP 直连控制台 (无需外网)</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-mono">
                <Radio className="w-3 h-3" /> AP: 192.168.4.1
              </span>
            </div>

            {/* Sensor Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
                <Thermometer className="w-6 h-6 text-rose-400" />
                <div>
                  <div className="text-[10px] text-slate-400">DHT11 实时温度</div>
                  <div className="text-base font-bold text-white font-mono">{temp} ℃</div>
                  <div className="text-[9px] text-slate-500">&gt;28℃ 自动排风</div>
                </div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
                <Droplets className="w-6 h-6 text-cyan-400" />
                <div>
                  <div className="text-[10px] text-slate-400">DHT11 相对湿度</div>
                  <div className="text-base font-bold text-white font-mono">{humi} %</div>
                  <div className="text-[9px] text-slate-500">室内舒适</div>
                </div>
              </div>
            </div>

            {/* Device Toggles (Light & Fan) */}
            <div className="space-y-2">
              <div className="text-xs text-slate-400 font-semibold flex items-center justify-between">
                <span>智能照明与通风 (手机与语音实时同步)</span>
                <span className="text-[10px] text-emerald-400">毫秒同步</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    const next = !lightOn;
                    setLightOn(next);
                    setOledMessage(next ? '手机开启客厅吊灯' : '手机关闭客厅吊灯');
                    const now = new Date().toLocaleTimeString();
                    setWebLogs((prev) => [
                      { id: Date.now().toString(), time: now, action: `HTTP GET /toggle_light -> ${next ? '点亮吊灯' : '熄灭吊灯'}`, ip: '192.168.4.2' },
                      ...prev.slice(0, 9)
                    ]);
                  }}
                  className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all active:scale-95 ${
                    lightOn
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <Lightbulb className={`w-4 h-4 ${lightOn ? 'text-amber-400' : 'text-slate-500'}`} />
                  <span>客厅吊灯: {lightOn ? '开启中' : '已关闭'}</span>
                </button>

                <button
                  onClick={() => {
                    const next = !fanOn;
                    setFanOn(next);
                    setAutoFanTriggered(false);
                    setOledMessage(next ? '手机启动排风扇' : '手机停止排风扇');
                    const now = new Date().toLocaleTimeString();
                    setWebLogs((prev) => [
                      { id: Date.now().toString(), time: now, action: `HTTP GET /toggle_fan -> ${next ? '启动风扇' : '停止风扇'}`, ip: '192.168.4.2' },
                      ...prev.slice(0, 9)
                    ]);
                  }}
                  className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all active:scale-95 ${
                    fanOn
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <Fan className={`w-4 h-4 ${fanOn ? 'text-cyan-400 animate-spin' : 'text-slate-500'}`} />
                  <span>排风扇: {fanOn ? '吹风中' : '已关闭'}</span>
                </button>
              </div>
            </div>

            {/* Remote Door & Security Actions */}
            <div className="space-y-2">
              <div className="text-xs text-slate-400 font-semibold">掌控板内嵌 Web 遥控 (HTTP 请求)</div>

              <button
                onClick={() => triggerDoorOpen('手机浏览器 HTTP GET /open')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
              >
                <Unlock className="w-4 h-4" />
                <span>★ 手机一键开门 (顶置舵机90°)</span>
              </button>

              <button
                onClick={() => {
                  const nextArmed = !isArmed;
                  setIsArmed(nextArmed);
                  setRgbColor(nextArmed ? 'blue' : 'off');
                  setOledMessage(nextArmed ? '【手机开启离家布防】' : '【手机解除布防】');
                }}
                className={`w-full py-2.5 rounded-xl font-medium text-xs flex items-center justify-center gap-2 border active:scale-95 transition-all ${
                  isArmed
                    ? 'bg-rose-600/30 text-rose-300 border-rose-500/50'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                <Shield className="w-4 h-4 text-amber-400" />
                <span>{isArmed ? '手机一键【解除布防模式】' : '手机一键【开启离家布防】'}</span>
              </button>
            </div>

            {/* Password Management on Web */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-white flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5 text-purple-400" /> 在线修改门禁密码
                </span>
                <span className="text-[10px] text-slate-500 font-mono">当前: {currentPwd}</span>
              </div>
              <form onSubmit={handleWebChangePassword} className="flex gap-2">
                <input
                  type="text"
                  placeholder="输入6位新密码"
                  maxLength={6}
                  value={webNewPwd}
                  onChange={(e) => setWebNewPwd(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono text-center"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold transition-all shrink-0"
                >
                  确认改密
                </button>
              </form>
            </div>

            {/* Live Web Server Socket Logs */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>掌控板内嵌 Socket 日志</span>
                <span className="font-mono text-[10px] text-emerald-400">192.168.4.1:80/tcp</span>
              </div>
              <div className="bg-black/80 rounded-xl p-3 max-h-32 overflow-y-auto space-y-1 font-mono text-[10px]">
                {webLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-1.5 leading-tight">
                    <span className="text-slate-500">[{log.time}]</span>
                    <span className="text-amber-400">{log.ip}</span>
                    <span className="text-slate-300 break-all">{log.action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
