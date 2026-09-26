import React, { useState } from 'react';
import { PRESENTATION_SCRIPT, JUDGE_QUESTIONS } from '../data/projectData';
import { CheckSquare, Award, Clock, HelpCircle } from 'lucide-react';

export const PresentationGuide: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const checklistItems = [
    { title: '掌控板内置 AP 热点检查', desc: '上电后等待3秒，检查掌控板OLED是否显示 SSID: SmartHome-IoT，用手机连接该热点并打开 192.168.4.1 测试。' },
    { title: '3×4 薄膜键盘与初始密码测试', desc: '在门边键盘依次按 1-2-3-4-5-6 并按 # 键，测试蜂鸣器响且顶置舵机平顺旋转 90° 开门，4秒后自动回弹关门。' },
    { title: '发泡板大门与顶置舵机初始位', desc: '检查发泡板大门在 0° 时是否紧密闭合，微型合页无卡顿，顶置舵机摆臂牢固无松脱。' },
    { title: '离家布防与非触控防盗演练', desc: '在键盘上按 * 键开启离家布防模式（RGB亮蓝光），用手在 PIR 人体红外探头前晃动，测试红蓝爆闪与警笛响动。' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-semibold border border-pink-500/30 flex items-center gap-1">
              <Award className="w-3 h-3" /> 少儿创客比赛实战秘籍
            </span>
            <span className="text-xs text-slate-400">小学展台 5 分钟黄金答辩台本</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            少儿现场演讲台本与评委答辩宝典
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            以日常生活痛点为引子，紧扣结构设计、软硬件协同与动手创新，让评委老师眼前一亮
          </p>
        </div>
      </div>

      {/* 5-minute Script Walkthrough */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" /> 5分钟答辩时间轴与演练台本
          </h3>
          <span className="text-xs text-slate-400">点击分步演练每一分钟的话术与肢体动作</span>
        </div>

        {/* Step buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {PRESENTATION_SCRIPT.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`p-3 rounded-xl border text-left transition-all ${
                activeStep === idx
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="text-[11px] font-mono opacity-80">{item.step}</div>
              <div className="text-xs font-bold mt-1 truncate">{item.title}</div>
            </button>
          ))}
        </div>

        {/* Detailed current step card */}
        <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs px-2.5 py-1 rounded bg-slate-800 text-cyan-300 border border-slate-700 font-semibold">
              {PRESENTATION_SCRIPT[activeStep].step} · {PRESENTATION_SCRIPT[activeStep].title}
            </span>
            <span className="text-xs text-slate-400 font-medium">主讲人角色: 小创客主讲</span>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-xs text-indigo-200 space-y-1">
            <div className="font-bold text-indigo-300">现场动作与手势配合：</div>
            <p>{PRESENTATION_SCRIPT[activeStep].action}</p>
          </div>

          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-slate-400">答辩台词演讲稿 (熟读背诵)：</div>
            <div className="text-sm sm:text-base text-slate-100 leading-relaxed bg-slate-900/90 p-4 rounded-xl border border-slate-800 font-sans">
              {PRESENTATION_SCRIPT[activeStep].script}
            </div>
          </div>
        </div>
      </div>

      {/* Judge Q&A and Inspection Check */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Judge Q&A */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-400" /> 评委高频尖锐提问与满分回答
          </h3>
          <p className="text-xs text-slate-400">
            评委往往会考察孩子是不是真正理解原理，还是家长老师代劳，提前背好这3道核心问答！
          </p>

          <div className="space-y-3">
            {JUDGE_QUESTIONS.map((qa, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                <div className="text-xs font-bold text-amber-300 flex items-start gap-1.5">
                  <span className="font-mono bg-amber-500/20 px-1.5 py-0.5 rounded text-[10px]">问</span>
                  <span>{qa.q}</span>
                </div>
                <div className="text-xs text-slate-300 leading-relaxed pl-5">
                  {qa.a}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Readiness Checklist */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-emerald-400" /> 上场前 10 分钟装备自查清单
          </h3>

          <div className="space-y-3">
            {checklistItems.map((chk, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <div className="font-semibold text-emerald-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {chk.title}
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">{chk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
