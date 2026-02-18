
import React, { useRef } from 'react';
import { LucideIcon } from './Common';
import { COLOR_PRESETS, CALENDAR_TYPES } from '../constants';

export const SettingsView = ({ settings, setSettings, clearHistory, onExport, onImport }: any) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="animate-fade p-6 pb-24 bg-gray-50 dark:bg-black min-h-screen">
            <h2 className="text-3xl font-black mb-8 text-emerald-900 dark:text-emerald-400">تنظیمات</h2>
            
            <div className="bg-white dark:bg-zinc-900 rounded-[40px] border border-gray-100 dark:border-zinc-800 p-8 shadow-xl mb-6 space-y-8">
                {/* Calendar Type Selector */}
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center text-amber-600">
                            <LucideIcon name="Calendar" size={20} />
                        </div>
                        <span className="font-black text-gray-700 dark:text-zinc-200">د تاریخ بڼه</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 bg-gray-50 dark:bg-zinc-950/50 p-2 rounded-[24px] border dark:border-zinc-800">
                        {CALENDAR_TYPES.map((c) => (
                            <button
                                key={c.id}
                                onClick={() => setSettings({ ...settings, calendarType: c.id })}
                                className={`flex flex-col items-center gap-2 py-4 rounded-[18px] transition-all ${settings.calendarType === c.id ? 'bg-white dark:bg-zinc-800 shadow-md primary-text' : 'text-gray-400 dark:text-zinc-500'}`}
                            >
                                <span className="text-[10px] font-black">{c.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Theme Selector */}
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600">
                            <LucideIcon name="Monitor" size={20} />
                        </div>
                        <span className="font-black text-gray-700 dark:text-zinc-200">اپلیکیشن ټم</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 bg-gray-50 dark:bg-zinc-950/50 p-2 rounded-[24px] border dark:border-zinc-800">
                        {[
                            { id: 'system', icon: 'Monitor', label: 'سیستم' },
                            { id: 'light', icon: 'Sun', label: 'روښانه' },
                            { id: 'dark', icon: 'Moon', label: 'تاریک' }
                        ].map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setSettings({ ...settings, theme: t.id })}
                                className={`flex flex-col items-center gap-2 py-3 rounded-[18px] transition-all ${settings.theme === t.id ? 'bg-white dark:bg-zinc-800 shadow-md primary-text' : 'text-gray-400 dark:text-zinc-500'}`}
                            >
                                <LucideIcon name={t.icon} size={18} />
                                <span className="text-[10px] font-black">{t.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Color Palette */}
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600">
                            <LucideIcon name="Palette" size={20} />
                        </div>
                        <span className="font-black text-gray-700 dark:text-zinc-200">مرکزي رنګ انتخاب کړئ</span>
                    </div>
                    <div className="grid grid-cols-5 gap-3">
                        {COLOR_PRESETS.map(c => (
                            <button key={c.id} onClick={() => setSettings({...settings, colorId: c.id, primaryHex: c.hex})}
                                className={`aspect-square rounded-2xl border-4 transition-all active:scale-90 shadow-sm ${settings.colorId === c.id ? 'border-white dark:border-zinc-500 scale-110 ring-2 primary-ring ring-offset-2 ring-offset-white dark:ring-offset-zinc-950' : 'border-transparent opacity-60'}`}
                                style={{ backgroundColor: c.hex }}
                            />
                        ))}
                    </div>
                </div>

                {/* Hijri Offset */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600">
                            <LucideIcon name="Settings" size={20} />
                        </div>
                        <span className="font-black text-gray-700 dark:text-zinc-200">نیټه سمول (Offset)</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-950 p-1.5 rounded-2xl shadow-inner border dark:border-zinc-800">
                        <button onClick={() => setSettings({...settings, offset: settings.offset - 1})} className="w-8 h-8 flex items-center justify-center font-black text-lg hover:bg-white dark:hover:bg-zinc-800 rounded-xl transition-colors dark:text-white">-</button>
                        <span className="text-[10px] font-black w-10 text-center dark:text-white">{settings.offset} ورځ</span>
                        <button onClick={() => setSettings({...settings, offset: settings.offset + 1})} className="w-8 h-8 flex items-center justify-center font-black text-lg hover:bg-white dark:hover:bg-zinc-800 rounded-xl transition-colors dark:text-white">+</button>
                    </div>
                </div>
            </div>

            <div className="space-y-4 font-black">
                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={onExport}
                        className="flex flex-col items-center justify-center bg-blue-600 text-white p-6 rounded-[32px] font-black shadow-lg active:scale-[0.98] transition-all gap-2"
                    >
                        <LucideIcon name="Download" size={24} />
                        <span className="text-xs font-black">بیک اپ واخلئ</span>
                    </button>
                    
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={onImport} 
                        accept=".json" 
                        className="hidden" 
                    />
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center justify-center bg-amber-600 text-white p-6 rounded-[32px] font-black shadow-lg active:scale-[0.98] transition-all gap-2"
                    >
                        <LucideIcon name="Upload" size={24} />
                        <span className="text-xs font-black">بیک اپ وارد کړئ</span>
                    </button>
                </div>

                <button onClick={clearHistory} className="w-full bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 py-5 rounded-[32px] font-black border border-red-100 dark:border-red-900 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                    <LucideIcon name="Trash2" size={20} />
                    ټوله تاریخچه پاکه کړئ
                </button>
            </div>
        </div>
    );
};
