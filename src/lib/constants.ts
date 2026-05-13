import { Level } from "../types";

export const LEVELS: Level[] = [
  { id: 'sd-3-4', title: 'SD 3-4', subtitle: 'Mekanik', color: 'border-blue-500' },
  { id: 'sd-5-6', title: 'SD 5-6', subtitle: 'Coding Visual', color: 'border-emerald-500' },
  { id: 'smp', title: 'SMP', subtitle: 'Sensor + OLED', color: 'border-purple-500' },
  { id: 'sma', title: 'SMA', subtitle: 'Logika Lanjut', color: 'border-orange-500' },
];

export const QUICK_PROBLEMS = [
  "Tidak bisa belok", 
  "Sensor tidak terbaca", 
  "Motor tidak jalan", 
  "OLED blank", 
  "Program aneh"
];