import React, { useState, useEffect } from 'react';
import { Wifi, Smartphone, Unlock, Sun, Flame, Thermometer, Droplets, Radio, Shield, ShieldAlert, KeyRound } from 'lucide-react';

export const IoTSimulator: React.FC = () => {
  // Simulated hardware state
  const [doorOpen, setDoorOpen] = useState(false);
  const [doorCountdown, setDoorCountdown] = useState(0);
  const [rgbColor, setRgbColor] = useState<'off' | 'yellow' | 'blue' | 'red' | 'strobe'>('off');
  const [temp, setTemp] = useState(26);
  const [humi, setHumi] = useState(58);
  const [lightLevel, setLightLevel] = useState(650);
  
  // 3x4 Keypad & Security state
  const [currentPwd, setCurrentPwd] = useState('123456');
  const [inputBuffer, setInputBuffer] = useState('');
  const [isArmed, setIsArmed] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [webNewPwd, setWebNewPwd] = useState('');
  const [oledMessage, setOledMessage] = useState('智馨家园 · 门禁就绪');
  const [isModifyingPwd, setIsModifyingPwd] = useState(false);
  const [modifyStep, setModifyStep] = useState<1 | 2>(1);
  const [resetCountdown, setResetCountdown] = useState<number | null>(null);
  const [webLogs, setWebLogs] = useState<{ id: string; time: string; action: string; ip: string }[]>([
    { id: '1', time: '10:00:01', action: 'AP热点启动 SSID: SmartHome-IoT', ip: '192.168.4.1' },
    { id: '2', time: '10:00:05', action: '3×4 矩阵键盘驱动就绪 (P2-P16)', ip: '本地GPIO' }
  ]);

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
        setRgbColor('yellow');
        setOledMessage('★ 系统已硬核复位 · 密码: 123456 ★');
        setTimeout(() => setRgbColor('off'), 2000);

        const now = new Date().toLocaleTimeString();
        setWebLogs((prev) => [
          { id: Date.now().toString(), time: now, action: '[安全气囊复位] 掌控板A键长按6秒 -> 密码恢复123456+解除锁定', ip: '实体A键' },
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
        // Trigger old-password verification flow
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
        // Normal door unlock
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

  // High Temp alert
  useEffect(() => {
    if (temp > 30) {
      setRgbColor('red');
      setOledMessage(`高温告警: ${temp}℃ 启动通风`);
    } else if (rgbColor === 'red' && !isArmed) {
      setRgbColor('off');
      setOledMessage('智馨家园 · 门禁就绪');
    }
  }, [temp]);

  // Night light effect
  useEffect(() => {
    if (lightLevel < 250 && !doorOpen && temp <= 30 && !isArmed && rgbColor !== 'strobe') {
      setRgbColor('blue');
    } else if (lightLevel >= 250 && rgbColor === 'blue' && !isArmed) {
      setRgbColor('off');
    }
  }, [lightLevel, doorOpen, temp, isArmed]);

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
            <div className="relative h-64 bg-gradient-to-b from-slate-950 to-slate-900 rounded-xl border border-slate-800 p-4 flex items-end justify-between overflow-hidden">
              {/* Roof slope outline */}
              <div className="absolute top-2 left-4 right-4 h-12 border-t-2 border-r-2 border-slate-700 rounded-tr-3xl opacity-40 pointer-events-none" />

              {/* Entrance Doorway with Top-Mounted Direct-Drive SG90 Servo */}
              <div className="relative w-28 h-52 border-2 border-slate-700 bg-slate-950/80 rounded-t-lg flex flex-col justify-between p-1.5">
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
              <div className="flex flex-col items-center gap-1 bg-slate-950/90 p-2 rounded-xl border border-slate-800 shadow-md">
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
              <div className="w-40 bg-slate-950 border border-slate-700 rounded-xl p-2.5 shadow-xl flex flex-col items-center">
                <div className="w-full flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span>掌控板 1.3寸 OLED</span>
                  <span className={`w-2 h-2 rounded-full ${isArmed ? 'bg-cyan-400 animate-ping' : 'bg-emerald-500'}`} />
                </div>

                {/* Simulated OLED Screen */}
                <div className="w-full h-18 bg-black rounded border-2 border-slate-700 p-1.5 font-mono text-[10px] text-cyan-300 flex flex-col justify-between shadow-inner">
                  <div className="text-[9px] text-amber-400 truncate">{oledMessage}</div>
                  <div className="flex justify-between text-[9px] text-slate-400">
                    <span>{temp}℃ / {humi}%</span>
                    <span>{isArmed ? '布防中' : '就绪'}</span>
                  </div>
                  <div className="text-[9px] text-slate-500">
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
                onClick={() => setTemp((t) => (t >= 32 ? 24 : 33))}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-all active:scale-95"
              >
                <Flame className="w-4 h-4 text-amber-400" />
                <span>{temp >= 32 ? '恢复正常室温' : '哈热气 (>30℃)'}</span>
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
                  <span className="font-mono text-rose-300 font-bold">{temp} ℃</span>
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
                </div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
                <Droplets className="w-6 h-6 text-cyan-400" />
                <div>
                  <div className="text-[10px] text-slate-400">DHT11 相对湿度</div>
                  <div className="text-base font-bold text-white font-mono">{humi} %</div>
                </div>
              </div>
            </div>

            {/* Remote Action Buttons */}
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
