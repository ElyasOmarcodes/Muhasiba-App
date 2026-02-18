
import React from 'react';
import { LucideIcon, ScoreBar, MiniLineChart } from './Common';
import { CATEGORIES } from '../constants';
import { getFormattedDate, calculateScore } from '../utils';

/**
 * Sub-components defined first to avoid hoisting/ReferenceError issues
 */

const PrayerItem = ({ name, status, onChange }: any) => {
    const states = [
        { id: 'jamaat', label: 'جماعت', color: 'emerald' },
        { id: 'ada', label: 'اداء', color: 'blue' },
        { id: 'qaza', label: 'قضاء', color: 'red' }
    ];
    const active: any = states.find(s => s.id === status) || states[1];
    return (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-[36px] border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-center mb-6">
                <span className="font-black text-gray-800 dark:text-white text-base">{name}</span>
                <div className={`px-5 py-2 rounded-full text-[9px] font-black text-white bg-${active.color}-600 shadow-lg shadow-${active.color}-600/20 transition-all uppercase tracking-widest`}>
                    {active.label}
                </div>
            </div>
            <div className="flex gap-2.5">
                {states.map(s => (
                    <button key={s.id} onClick={() => onChange(s.id)}
                        className={`flex-1 py-3.5 rounded-2xl text-[10px] font-black border transition-all ${status === s.id ? `bg-${s.color}-600 border-${s.color}-600 text-white shadow-xl scale-[1.02]` : 'bg-gray-50/80 dark:bg-zinc-800 border-gray-100 dark:border-zinc-700 text-gray-400 dark:text-zinc-500 hover:bg-white dark:hover:bg-zinc-700'}`}
                    >
                        {s.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

const CheckboxItem = ({ label, checked, onChange, penalty }: any) => (
    <div onClick={() => onChange(!checked)}
        className={`flex items-center justify-between p-5 rounded-[30px] border cursor-pointer transition-all duration-300 ${checked ? (penalty ? 'bg-red-50 dark:bg-red-950/20 border-red-300 dark:border-red-900 shadow-lg' : 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-400/50 dark:border-emerald-900 shadow-lg') : 'bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 shadow-sm'}`}
    >
        <span className={`text-xs font-black transition-colors ${checked ? (penalty ? 'text-red-700 dark:text-red-400' : 'primary-text') : 'text-gray-600 dark:text-zinc-300'}`}>{label}</span>
        <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${checked ? (penalty ? 'bg-red-500 border-red-500 scale-110 shadow-xl' : 'primary-bg primary-border scale-110 shadow-xl') : 'border-gray-200 dark:border-zinc-800'}`}>
            {checked && <LucideIcon name="Check" size={16} className="text-white" />}
        </div>
    </div>
);

/**
 * Main HomeView Component
 */
export const HomeView = ({ data, updateData, scoreInfo, customActions, openCustomModal, settings, history, viewOffset, setViewOffset }: any) => {
    const dates = getFormattedDate(settings.offset + viewOffset);
    
    const primaryDate = settings.calendarType === 'lunar' ? dates.lunar : 
                       settings.calendarType === 'solar' ? dates.solar : dates.gregorian;
    
    const secondaryDate = settings.calendarType === 'gregorian' ? dates.lunar : dates.gregorian;

    const last7DaysScores = Object.keys(history)
        .sort()
        .slice(-7)
        .map(key => calculateScore(history[key], customActions).percentage);

    const goodCustomActions = customActions.filter((a: any) => a.points >= 0);
    const badCustomActions = customActions.filter((a: any) => a.points < 0);

    return (
        <div className="animate-fade pb-24 bg-gray-50 dark:bg-black min-h-screen">
            <div className="relative pt-12 pb-16 px-8 mb-4 overflow-hidden shadow-2xl">
                <div className="absolute inset-0 primary-bg transition-colors duration-700"></div>
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-black/10 rounded-full blur-2xl"></div>
                
                <div className="relative z-10 text-white">
                    <div className="flex justify-between items-start mb-8">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">نننۍ معنوي ورځ</span>
                            
                            {/* Date with Navigation */}
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => setViewOffset(viewOffset - 1)}
                                    className="p-1 hover:bg-white/10 rounded-full transition-colors active:scale-75 text-white"
                                    title="تېره ورځ"
                                >
                                    <LucideIcon name="ChevronRight" size={20} />
                                </button>
                                <h2 className="text-3xl font-black leading-tight text-white">{primaryDate}</h2>
                                <button 
                                    onClick={() => setViewOffset(viewOffset + 1)}
                                    className="p-1 hover:bg-white/10 rounded-full transition-colors active:scale-75 text-white"
                                    title="راتلونکې ورځ"
                                >
                                    <LucideIcon name="ChevronLeft" size={20} />
                                </button>
                            </div>
                            
                            <p className="text-white/60 text-xs font-bold tracking-widest mr-8">{secondaryDate}</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl">
                             <LucideIcon name="Sparkles" size={24} className="text-white" />
                        </div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-lg rounded-[40px] p-6 border border-white/10 shadow-2xl mb-6">
                        <MiniLineChart data={last7DaysScores.length > 0 ? last7DaysScores : [scoreInfo.percentage]} />
                        <div className="mt-4">
                            <ScoreBar percentage={scoreInfo.percentage} rank={scoreInfo.rank} />
                        </div>
                    </div>
                    
                    <div className="flex items-start gap-3 bg-black/20 backdrop-blur-md p-4 rounded-[28px] border border-white/5">
                        <div className="text-yellow-400 mt-1"><LucideIcon name="Quote" size={16} /></div>
                        <p className="text-xs font-bold leading-relaxed italic opacity-90 text-white">
                            {scoreInfo.msg}
                        </p>
                    </div>
                    
                    {viewOffset !== 0 && (
                        <button 
                            onClick={() => setViewOffset(0)}
                            className="mt-4 mx-auto block text-[10px] font-black bg-white/20 px-3 py-1 rounded-full uppercase tracking-widest hover:bg-white/30 transition-all text-white"
                        >
                            اوسنۍ نیټې ته راګرځېدل
                        </button>
                    )}
                </div>
            </div>

            <div className="px-6 space-y-10">
                <section>
                    <div className="flex items-center justify-between mb-6 px-2">
                        <h3 className="text-lg font-black text-gray-800 dark:text-white flex items-center gap-3">
                            <span className="w-2 h-2 primary-bg rounded-full"></span>
                            {CATEGORIES.PRAYERS}
                        </h3>
                    </div>
                    <div className="space-y-4">
                        {Object.entries({ 'سهار': 'fajr', 'ماسپښین': 'dhuhr', 'مازیګر': 'asr', 'ماښام': 'maghrib', 'ماسختن': 'isha' })
                        .map(([label, key]) => (
                            <PrayerItem key={key} name={label} status={data.prayers[key]} onChange={(val: any) => updateData('prayers', key, val)} />
                        ))}
                    </div>
                </section>

                <section>
                    <div className="flex items-center justify-between mb-6 px-2">
                        <h3 className="text-lg font-black text-gray-800 dark:text-white flex items-center gap-3">
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                            {CATEGORIES.NAFILS}
                        </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {Object.entries({ 'تهجد': 'tahajjud', 'اوابین': 'awwabin', 'تحية المسجد': 'masjid', 'تحية الوضوء': 'wudu' })
                        .map(([l, k]) => (
                            <CheckboxItem key={k} label={l} checked={data.nafils[k]} onChange={(v: any) => updateData('nafils', k, v)} />
                        ))}
                    </div>
                </section>

                <section>
                    <div className="flex items-center justify-between mb-6 px-2">
                        <h3 className="text-lg font-black text-gray-800 dark:text-white flex items-center gap-3">
                            <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                            {CATEGORIES.ADHKAR}
                        </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {Object.entries({ 'تسبیح او تهلیل': 'tasbih', 'استغفار': 'istighfar', 'تلاوت': 'tilawat', 'درود شريف': 'durud', 'اذکار': 'postSalah', 'دعا': 'dua' })
                        .map(([l, k]) => (
                            <CheckboxItem key={k} label={l} checked={data.adhkar[k]} onChange={(v: any) => updateData('adhkar', k, v)} />
                        ))}
                    </div>
                </section>

                <section>
                    <div className="flex items-center justify-between mb-6 px-2">
                        <h3 className="text-lg font-black text-gray-800 dark:text-white flex items-center gap-3">
                            <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                            {CATEGORIES.GOOD_DEEDS}
                        </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {Object.entries({ 'خپلوي پالل': 'kinship', 'د ژبې ساتنه': 'speech', 'د مريض پوښتنه': 'sick', 'امر بالمعروف': 'amr', 'د قبرونو لیدل': 'graves', 'صدقه': 'sadaqah', 'ښې خبرې': 'kindWords' })
                        .map(([l, k]) => (
                            <CheckboxItem key={k} label={l} checked={data.deeds[k]} onChange={(v: any) => updateData('deeds', k, v)} />
                        ))}
                    </div>
                </section>

                <section>
                    <div className="flex items-center justify-between mb-6 px-2">
                        <h3 className="text-lg font-black text-gray-800 dark:text-white flex items-center gap-3">
                            <span className="w-2 h-2 bg-violet-600 rounded-full"></span>
                            {CATEGORIES.CUSTOM}
                        </h3>
                        <button onClick={openCustomModal} className="flex items-center gap-2 px-4 py-2 bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-2xl text-[10px] font-black hover:bg-violet-100 transition-all">
                            <LucideIcon name="PlusCircle" size={14} />
                            نوی عمل
                        </button>
                    </div>
                    
                    {customActions.length > 0 ? (
                        <div className="space-y-6">
                            {goodCustomActions.length > 0 && (
                                <div className="space-y-3">
                                    <p className="text-[9px] font-black text-emerald-600/60 uppercase tracking-[0.4em] px-3">نیک عملونه</p>
                                    <div className="grid grid-cols-1 gap-3">
                                        {goodCustomActions.map((action: any) => (
                                            <CheckboxItem 
                                                key={action.id} 
                                                label={`${action.name} (+${action.points})`} 
                                                checked={!!data.custom[action.id]} 
                                                onChange={(v: any) => updateData('custom', action.id, v)} 
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {badCustomActions.length > 0 && (
                                <div className="space-y-3 bg-red-50/30 dark:bg-red-950/20 p-6 rounded-[40px] border border-red-100/50 dark:border-red-900/20">
                                    <p className="text-[9px] font-black text-red-600/60 uppercase tracking-[0.4em] px-3">شخصي ګناهونه</p>
                                    <div className="grid grid-cols-1 gap-3">
                                        {badCustomActions.map((action: any) => (
                                            <CheckboxItem 
                                                key={action.id} 
                                                label={`${action.name} (${action.points})`} 
                                                checked={!!data.custom[action.id]} 
                                                onChange={(v: any) => updateData('custom', action.id, v)} 
                                                penalty
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div onClick={openCustomModal} className="p-16 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-[48px] text-center cursor-pointer group hover:border-violet-500 transition-all bg-white dark:bg-zinc-900">
                            <div className="w-16 h-16 bg-gray-50 dark:bg-zinc-800 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <LucideIcon name="Plus" size={32} className="text-gray-300 group-hover:text-violet-500" />
                            </div>
                            <p className="text-xs font-black text-gray-400">دلته خپل شخصي عبادات اضافه کړئ</p>
                        </div>
                    )}
                </section>

                <section className="bg-red-50 dark:bg-red-950/20 p-8 rounded-[56px] border border-red-100 dark:border-red-900/40 shadow-xl relative overflow-hidden mb-12">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl"></div>
                    <div className="flex items-center gap-3 mb-8 relative z-10">
                        <div className="w-10 h-10 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-red-600/20">
                            <LucideIcon name="ShieldAlert" size={20} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-red-800 dark:text-red-400">{CATEGORIES.SINS}</h3>
                            <p className="text-[9px] font-black text-red-600/40 uppercase tracking-widest mt-1">حذر او توبه وباسئ</p>
                        </div>
                    </div>
                    <div className="space-y-3 relative z-10 grid grid-cols-1 gap-3">
                        {Object.entries({ 'درواغ': 'lies', 'چغل خوري': 'gossip', 'زنا': 'adultery', 'لواطت': 'sodomy', 'غلا': 'theft', 'دوکه': 'fraud', 'فحش خبرې': 'obscenity', 'ساز اورېدل': 'music', 'نور ګناهونه': 'others' })
                        .map(([l, k]) => (
                            <CheckboxItem key={k} label={l} checked={data.sins[k]} onChange={(v: any) => updateData('sins', k, v)} penalty />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};
