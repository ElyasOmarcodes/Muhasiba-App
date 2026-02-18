
import React from 'react';

// Lucide icon helper component that uses the global lucide object
export const LucideIcon = ({ name, size = 24, className = "" }: { name: string, size?: number, className?: string }) => {
    // @ts-ignore
    const iconData = window.lucide.icons[name];
    if (!iconData) return null;
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            dangerouslySetInnerHTML={{
                __html: iconData.map(([tag, attrs]: any) => {
                    const attrStr = Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(' ');
                    return `<${tag} ${attrStr}></${tag}>`;
                }).join('')
            }}
        />
    );
};

// Fix: Added InfographicGauge component which was missing from Common.tsx but imported in EvaluationView.tsx
export const InfographicGauge = ({ percentage, size = "normal" }: { percentage: number, size?: "small" | "normal" }) => {
    const dim = size === "small" ? 80 : 140;
    const stroke = size === "small" ? 6 : 10;
    const center = dim / 2;
    const radius = center - stroke;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={dim} height={dim} className="transform -rotate-90 overflow-visible">
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={stroke}
                    fill="transparent"
                    className="text-gray-100 dark:text-slate-800"
                />
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke="var(--primary-color)"
                    strokeWidth={stroke}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out drop-shadow-[0_0_5px_var(--primary-color)]"
                />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
                <span className={`${size === 'small' ? 'text-lg' : 'text-2xl'} font-black dark:text-white`}>{percentage}%</span>
            </div>
        </div>
    );
};

// Mini line chart for historical trends
export const MiniLineChart = ({ data }: { data: number[] }) => {
    // که ډاټا کمه وي، صفرونه ورزیاتوو ترڅو ګراف ډک ښکاره شي
    const points = data.length >= 7 ? data.slice(-7) : [...Array(7 - data.length).fill(0), ...data];
    const width = 200;
    const height = 60;
    const padding = 10;
    
    const xStep = (width - 2 * padding) / (points.length - 1);
    const yMax = 100;
    const yMin = 0;
    
    const pathData = points.map((val, i) => {
        const x = padding + i * xStep;
        const y = height - padding - ((val - yMin) / (yMax - yMin)) * (height - 2 * padding);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    return (
        <div className="w-full flex justify-center py-2">
            <svg width={width} height={height} className="overflow-visible">
                <defs>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="white" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="white" stopOpacity="0.1" />
                    </linearGradient>
                </defs>
                {/* Background Line */}
                <path 
                    d={pathData} 
                    fill="none" 
                    stroke="rgba(255,255,255,0.2)" 
                    strokeWidth="4" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                />
                {/* Active Line */}
                <path 
                    d={pathData} 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                />
                {/* Dots */}
                {points.map((val, i) => (
                    <circle 
                        key={i} 
                        cx={padding + i * xStep} 
                        cy={height - padding - ((val - yMin) / (yMax - yMin)) * (height - 2 * padding)} 
                        r="3" 
                        fill="white" 
                    />
                ))}
            </svg>
        </div>
    );
};

// Linear score bar for daily progress
export const ScoreBar = ({ percentage, rank }: { percentage: number, rank: string }) => {
    return (
        <div className="w-full space-y-3">
            <div className="flex justify-between items-end">
                <span className="text-4xl font-black">{percentage}%</span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] bg-white/20 px-3 py-1 rounded-full">{rank}</span>
            </div>
            <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden p-0.5">
                <div 
                    className="h-full bg-white rounded-full transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(255,255,255,0.8)]"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

// Reusable modal component
export const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children?: React.ReactNode }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade">
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl border border-gray-100 dark:border-slate-800">
                <div className="p-6 border-b border-gray-50 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="text-xl font-black">{title}</h3>
                    <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-slate-800 rounded-full transition-transform active:scale-90">
                        <LucideIcon name="X" size={18} />
                    </button>
                </div>
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};
