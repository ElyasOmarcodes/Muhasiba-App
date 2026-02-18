
import React, { useState, useEffect, useMemo } from 'react';
import { getStorage, setStorage, getFormattedDate, calculateScore } from './utils';
import { INITIAL_DAY_STATE } from './constants';
import { HomeView } from './components/HomeView';
import { EvaluationView } from './components/EvaluationView';
import { HistoryView } from './components/HistoryView';
import { SettingsView } from './components/SettingsView';
import { AboutView } from './components/AboutView';
import { Modal, LucideIcon } from './components/Common';

const App = () => {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('home');
    const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
    const [viewOffset, setViewOffset] = useState(0);
    const [isSinType, setIsSinType] = useState(false);
    
    const [settings, setSettings] = useState(() => getStorage('mohasiba_settings_v4', { 
        theme: 'system', 
        colorId: 'emerald', 
        primaryHex: '#059669', 
        offset: 0,
        calendarType: 'lunar' 
    }));
    const [history, setHistory] = useState(() => getStorage('mohasiba_history_v3', {}));
    const [customActions, setCustomActions] = useState(() => getStorage('mohasiba_custom_v3', []));
    
    const currentDates = getFormattedDate(settings.offset + viewOffset);
    const currentDayData = history[currentDates.rawKey] || INITIAL_DAY_STATE;

    useEffect(() => { 
        const timer = setTimeout(() => setLoading(false), 3000); 
        return () => clearTimeout(timer); 
    }, []);
    
    useEffect(() => {
        const applyTheme = () => {
            let themeToApply = settings.theme;
            if (settings.theme === 'system') {
                themeToApply = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }
            if (themeToApply === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            const meta = document.getElementById('theme-color-meta');
            if (meta) meta.setAttribute('content', themeToApply === 'dark' ? '#000000' : settings.primaryHex);
        };

        applyTheme();
        document.documentElement.style.setProperty('--primary-color', settings.primaryHex);
        setStorage('mohasiba_settings_v4', settings);

        if (settings.theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = () => applyTheme();
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [settings]);

    useEffect(() => setStorage('mohasiba_history_v3', history), [history]);
    useEffect(() => setStorage('mohasiba_custom_v3', customActions), [customActions]);

    const updateDayData = (category: string, field: string, value: any, targetKey?: string) => {
        const key = targetKey || currentDates.rawKey;
        const targetData = history[key] || INITIAL_DAY_STATE;
        const updatedDay = { 
            ...targetData, 
            [category]: { ...targetData[category], [field]: value } 
        };
        setHistory((prev: any) => ({ ...prev, [key]: updatedDay }));
        if (navigator.vibrate) navigator.vibrate(5);
    };

    const addCustomAction = (name: string, points: string) => {
        let numericPoints = parseInt(points) || 5;
        if (isSinType) {
            numericPoints = -Math.abs(numericPoints);
        } else {
            numericPoints = Math.abs(numericPoints);
        }
        
        const newAction = { id: Date.now().toString(), name, points: numericPoints };
        setCustomActions([...customActions, newAction]);
        setIsCustomModalOpen(false);
        setIsSinType(false);
    };

    const clearHistory = () => { 
        if (confirm('آیا واقعاً غواړئ ټوله تاریخچه پاکه کړئ؟')) { 
            setHistory({}); 
            setCustomActions([]); 
        } 
    };

    const handleExport = () => {
        const data = { history, customActions, settings, version: '4.0' };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mohasiba_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importedData = JSON.parse(event.target?.result as string);
                if (importedData.history && importedData.customActions) {
                    setHistory(importedData.history);
                    setCustomActions(importedData.customActions);
                    if (importedData.settings) setSettings(importedData.settings);
                    alert('ډاټا په بریالیتوب سره وارد شوه!');
                } else { alert('ناسم فایل بڼه!'); }
            } catch (error) { alert('د فایل په لوستلو کې تېروتنه رامنځته شوه!'); }
        };
        reader.readAsText(file);
    };

    const scoreInfo = useMemo(() => calculateScore(currentDayData, customActions), [currentDayData, customActions]);

    if (loading) return (
        <div className="fixed inset-0 bg-white dark:bg-black flex flex-col items-center justify-center z-[999] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/20 via-transparent to-blue-50/20 dark:from-emerald-950/20 dark:to-blue-950/20 opacity-60"></div>
            <div className="absolute inset-0 islamic-pattern"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center px-12">
                <div className="relative mb-16">
                    <div className="absolute inset-0 primary-bg rounded-[48px] animate-pulse-soft"></div>
                    <div className="w-40 h-40 primary-bg rounded-[52px] flex items-center justify-center shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] rotate-6 animate-bounce transition-transform duration-700">
                        <div className="-rotate-6 flex flex-col items-center text-white">
                            <LucideIcon name="Scale" size={64} className="mb-2 drop-shadow-lg" />
                        </div>
                    </div>
                </div>
                
                <h1 className="text-6xl font-black tracking-tight text-gray-900 dark:text-white mb-4 animate-fade">مُحاسِبه</h1>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.5em] mb-12 opacity-80 animate-fade [animation-delay:0.3s]">خپل ځان ارزوئ</p>
                
                <div className="flex gap-3">
                    <div className="w-2.5 h-2.5 primary-bg rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2.5 h-2.5 primary-bg rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2.5 h-2.5 primary-bg rounded-full animate-bounce"></div>
                </div>
            </div>
            
            <div className="absolute bottom-12 text-[10px] font-black text-gray-400 dark:text-slate-600 uppercase tracking-widest animate-fade [animation-delay:0.6s]">
                Elyas Omar • v4.0.0
            </div>
        </div>
    );

    const NavItem = ({ id, icon, label }: any) => (
        <button onClick={() => { setActiveTab(id); setViewOffset(0); }}
            className={`flex flex-col items-center justify-center flex-1 py-4 transition-all relative ${activeTab === id ? 'primary-text scale-110 font-black' : 'text-gray-400 dark:text-slate-500'}`}
        >
            <LucideIcon name={icon} size={22} className={activeTab === id ? 'animate-bounce' : ''} />
            <span className="text-[9px] mt-1.5 uppercase tracking-wider font-black">{label}</span>
            {activeTab === id && (
                <div className="absolute top-0 w-12 h-1 primary-bg rounded-b-full shadow-[0_4px_12px_rgba(5,150,105,0.4)]"></div>
            )}
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-500">
            <main className="max-w-md mx-auto min-h-screen bg-white dark:bg-black shadow-2xl relative overflow-x-hidden border-x border-gray-100 dark:border-slate-900">
                {activeTab === 'home' && (
                    <HomeView 
                        data={currentDayData} 
                        updateData={updateDayData} 
                        scoreInfo={scoreInfo} 
                        customActions={customActions} 
                        openCustomModal={() => setIsCustomModalOpen(true)}
                        settings={settings}
                        history={history}
                        viewOffset={viewOffset}
                        setViewOffset={setViewOffset}
                    />
                )}
                {activeTab === 'eval' && (
                    <EvaluationView 
                        history={history} 
                        customActions={customActions} 
                        settings={settings}
                    />
                )}
                {activeTab === 'history' && (
                    <HistoryView 
                        history={history} 
                        customActions={customActions} 
                        settings={settings} 
                        onEditDay={(offset: number) => { setViewOffset(offset); setActiveTab('home'); }}
                        updateDayData={updateDayData}
                    />
                )}
                {activeTab === 'settings' && <SettingsView settings={settings} setSettings={setSettings} clearHistory={clearHistory} onExport={handleExport} onImport={handleImport} />}
                {activeTab === 'about' && <AboutView />}

                <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 dark:bg-black/95 backdrop-blur-2xl border-t border-gray-100 dark:border-slate-900 flex justify-around items-center safe-area-bottom z-50 rounded-t-[32px] shadow-[0_-8px_32px_rgba(0,0,0,0.05)]">
                    <NavItem id="home" icon="Home" label="کور" />
                    <NavItem id="history" icon="Calendar" label="تاریخچه" />
                    <NavItem id="eval" icon="PieChart" label="ارزونه" />
                    <NavItem id="settings" icon="Settings" label="تنظیمات" />
                    <NavItem id="about" icon="User" label="په اړه" />
                </nav>
            </main>

            <Modal isOpen={isCustomModalOpen} onClose={() => { setIsCustomModalOpen(false); setIsSinType(false); }} title="نوی عمل ثبت کړئ">
                <form onSubmit={(e: any) => {
                    e.preventDefault();
                    // @ts-ignore
                    addCustomAction(e.target.actionName.value, e.target.actionPoints.value);
                }} className="space-y-6">
                    <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 mb-4">
                        <p className="text-[11px] font-black text-emerald-800 dark:text-emerald-400 leading-relaxed text-center">تاسو کولای شئ نیک عملونه او یا هم ګناهونه ثبت کړئ.</p>
                    </div>

                    <div className="flex p-1 bg-gray-100 dark:bg-slate-900 rounded-2xl border border-transparent dark:border-slate-800">
                        <button 
                            type="button"
                            onClick={() => setIsSinType(false)}
                            className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${!isSinType ? 'bg-white dark:bg-slate-800 primary-text shadow-sm' : 'text-gray-400 dark:text-slate-500'}`}
                        >
                            نیک عمل
                        </button>
                        <button 
                            type="button"
                            onClick={() => setIsSinType(true)}
                            className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${isSinType ? 'bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 shadow-sm' : 'text-gray-400 dark:text-slate-500'}`}
                        >
                            ګناه
                        </button>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-gray-400 dark:text-slate-500 mb-2 uppercase tracking-widest">د عمل نوم</label>
                        <input name="actionName" required className="w-full p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl border-none text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="نوم ولیکئ..." />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 dark:text-slate-500 mb-2 uppercase tracking-widest">نمرې</label>
                        <input name="actionPoints" type="number" defaultValue={isSinType ? "10" : "5"} className="w-full p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl border-none text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20" />
                    </div>
                    <button type="submit" className={`w-full py-5 rounded-3xl font-black shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 text-white ${isSinType ? 'bg-red-600 shadow-red-600/30' : 'primary-bg shadow-emerald-600/30'}`}>
                        <LucideIcon name="Save" size={20} /> ثبت کړئ
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default App;
