export type RoomId = 'all' | 'living-room' | 'kitchen' | 'bedroom' | 'office' | 'patio' | 'garage';

export type DeviceCategory = 
  | 'light' 
  | 'thermostat' 
  | 'lock' 
  | 'sensor' 
  | 'camera' 
  | 'vacuum' 
  | 'curtain' 
  | 'media';

export type SecurityMode = 
  | 'disarmed' 
  | 'armed-home' 
  | 'armed-away' 
  | 'alarm-triggered' 
  | 'emergency-fire' 
  | 'lockdown';

export type SystemHomeMode = 'Home' | 'Away' | 'Night' | 'Vacation' | 'Cinema' | 'Eco';

export interface BaseDevice {
  id: string;
  name: string;
  room: RoomId;
  category: DeviceCategory;
  isOnline: boolean;
  batteryLevel?: number; // percentage
  lastUpdated: string;
}

export interface LightDevice extends BaseDevice {
  category: 'light';
  isOn: boolean;
  brightness: number; // 0-100
  color: string; // hex
  colorTemperature: number; // 2000K - 6500K
}

export interface ThermostatDevice extends BaseDevice {
  category: 'thermostat';
  currentTemp: number; // Celsius
  targetTemp: number; // Celsius
  mode: 'heat' | 'cool' | 'auto' | 'eco' | 'off';
  fanSpeed: 'auto' | 'low' | 'med' | 'high';
  humidity: number; // %
}

export interface LockDevice extends BaseDevice {
  category: 'lock';
  isLocked: boolean;
  autoLockDelaySeconds: number;
  tamperAlert: boolean;
}

export interface SensorDevice extends BaseDevice {
  category: 'sensor';
  sensorType: 'motion' | 'door_window' | 'smoke_co' | 'water_leak' | 'temperature';
  status: 'clear' | 'detected' | 'open' | 'closed' | 'alarm';
  value?: string | number;
}

export interface CameraDevice extends BaseDevice {
  category: 'camera';
  isRecording: boolean;
  motionDetected: boolean;
  nightVision: boolean;
  feedUrl: string;
  lastMotionTime?: string;
}

export interface VacuumDevice extends BaseDevice {
  category: 'vacuum';
  status: 'docked' | 'cleaning' | 'returning' | 'paused' | 'error';
  cleaningMode: 'standard' | 'turbo' | 'quiet' | 'mop';
  cleanAreaSqMeters: number;
}

export interface CurtainDevice extends BaseDevice {
  category: 'curtain';
  position: number; // 0 = closed, 100 = fully open
}

export interface MediaDevice extends BaseDevice {
  category: 'media';
  isPlaying: boolean;
  volume: number; // 0-100
  currentTrack: string;
  artist: string;
  albumArt?: string;
}

export type Device = 
  | LightDevice 
  | ThermostatDevice 
  | LockDevice 
  | SensorDevice 
  | CameraDevice 
  | VacuumDevice 
  | CurtainDevice 
  | MediaDevice;

export interface AutomationRoutine {
  id: string;
  title: string;
  description: string;
  icon: string;
  triggerType: 'schedule' | 'geofence' | 'sensor' | 'manual';
  triggerCondition: string;
  actionsSummary: string;
  isActive: boolean;
  lastRun?: string;
  actions: {
    target: string;
    action: string;
    params?: Record<string, any>;
  }[];
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  category: 'device' | 'security' | 'automation' | 'system';
  severity: 'info' | 'warning' | 'alert' | 'critical';
  title: string;
  details: string;
  source: string;
}

export interface EnergyMetrics {
  currentLoadKw: number;
  solarGenerationKw: number;
  gridImportKw: number;
  batteryPercentage: number;
  dailyTotalKwh: number;
  solarSelfConsumptionPercent: number;
}

// Logic Prototype State Model (Directly matching /.agents/skills/prototype/LOGIC.md)
export interface LogicPrototypeState {
  systemMode: SecurityMode;
  houseOccupied: boolean;
  doorsLocked: boolean;
  smokeDetected: boolean;
  motionInPerimeter: boolean;
  gridPowerActive: boolean;
  emergencySirensActive: boolean;
  lastActionMessage: string;
  stepCount: number;
}

export interface PrototypeWalkthroughStep {
  label: string;
  actionKey: string;
  expectedObservation: string;
}

export interface PrototypeWalkthroughScenario {
  id: string;
  title: string;
  description: string;
  initialStateOverride?: Partial<LogicPrototypeState>;
  steps: PrototypeWalkthroughStep[];
}
