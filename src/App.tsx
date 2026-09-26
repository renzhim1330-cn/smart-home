import { useState } from 'react';
import { Navbar, TabKey } from './components/Navbar';
import { WayfinderRoadmap } from './components/WayfinderRoadmap';
import { CardboardBlueprint } from './components/CardboardBlueprint';
import { HardwareBOM } from './components/HardwareBOM';
import { WiringDiagram } from './components/WiringDiagram';
import { CodeWorkspace } from './components/CodeWorkspace';
import { IoTSimulator } from './components/IoTSimulator';
import { PresentationGuide } from './components/PresentationGuide';

export function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('wayfinder');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'wayfinder' && <WayfinderRoadmap onNavigateTab={setActiveTab} />}
        {activeTab === 'blueprint' && <CardboardBlueprint />}
        {activeTab === 'bom' && <HardwareBOM />}
        {activeTab === 'wiring' && <WiringDiagram />}
        {activeTab === 'code' && <CodeWorkspace />}
        {activeTab === 'iot_sim' && <IoTSimulator />}
        {activeTab === 'presentation' && <PresentationGuide />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            基于掌控板2.0 (mPython ESP32) · 少儿创客与小学创新科技展示专项方案
          </div>
          <div className="font-mono text-slate-400">
            模型尺寸标准: 35 × 22 × 26 cm (&lt; 38 × 25 × 34 cm)
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
