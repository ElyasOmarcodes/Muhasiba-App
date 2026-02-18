
import React, { useState, useMemo } from 'react';
import { LucideIcon, Modal, ScoreBar } from './Common';
import { calculateScore, formatDateFromKey } from '../utils';
import { CATEGORIES } from '../constants';

const ITEMS_PER_PAGE = 10;

export const HistoryView = ({ history, customActions, settings, onEditDay, updateDayData }: any) => {
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
    const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);
    
    const allKeys = useMemo(() => Object.keys(history).sort((a,b) => b.localeCompare(a)), [history]);
    const displayedKeys = allKeys.slice(0, visibleCount);
    const hasMore = visibleCount < allKeys.length;

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + ITEMS_PER_PAGE);
    };

    const selectedDayData = selectedDayKey ? history[selectedDayKey] : null;
    const selectedDayScore = selectedDayData ? calculateScore(selectedDayData, customActions) : null;
    
    const getDisplayDateForKey = (key: string) => {
        return formatDateFromKey(key, settings.calendarType);
    };

    const DetailItem = ({ label, items, category }: any) => {
        if (!items || Object.keys(items).length === 0) return null;
        
        const displayLabels: any = {
            fajr: 'سهار', dhuhr: 'ماسپښین', asr: 'مازیګر', maghrib: 'ماښام', isha: 'ماسختن',
            tahajjud: 'تهجد', awwabin: 'اوابین', masjid: 'تحية المسجد', wudu: 'تحية الوضوء',
            tasbih: 'تسبیح او تهلیل', istighfar: 'استغفار', tilawat: 'تلاوت', durud: 'درود شريف', postSalah: 'اذکار', dua: 'دعا',
            kinship: 'خپلوي پالل', speech: 'د ژبې ساتنه', sick: 'د مريض پوښتنه', amr: 'امر بالمعروف', graves: 'د قبرونو لیدل', sadaqah: 'صدقه', kindWords: 'ښې خبرې',
            lies: 'درواغ', gossip: 'چغل خوري', adultery: 'زنا', sodomy: 'لواطت', theft: 'غلا', fraud: 'دوکه', obscenity: 'فحش خبرې', music: 'ساز اورېدل', others: 'نور ګناهونه'
        };

        const activeItems = Object.entries(items).filter(([k, v]) => v && v !== 'qaza');
        if (activeItems.length === 0 && category !== 'prayers') return null;

        return (
            <div className="mb-4">
                <h4 className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-2 px-1">{label}</h4>
                <div className="flex flex-wrap gap-2">
                    {Object.entries(items).map(([k, v]: [string, any]) => {
                        let statusColor = "bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400";
                        let statusLabel = displayLabels[k] || k;

                        if (category === 'prayers') {
                            if (v === 'jamaat') statusColor = "bg-emerald-500 text-white";
                            else if (v === 'ada') statusColor = "bg-blue-500 text-white";
                            else statusColor = "bg-red-500 text-white";
                        } else if (v === true) {
                            statusColor = category === 'sins' ? "bg-red-500 text-white" : "primary-bg text-white";
                        } else if (v === false) {
                            return null;
                        }

                        return (
                            <span key={k} className={`text-[10px] font-bold px-3 py-1.5 rounded-xl ${statusColor}`}>
                                {statusLabel} {category === 'prayers' && (v === 'jamaat' ? '(ج)' : v === 'ada' ? '(ا)' : '(ق)')}
                            </span>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="animate-fade p-6 pb-24 min-h-screen bg-gray-50 dark:bg-black">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black text-emerald-900 dark:text-emerald-400">تاریخچه</h2>
                <div className="bg-white/50 dark:bg-zinc-900 px-4 py-1 rounded-full border border-gray-100 dark:border-zinc-800">
                    <span className="text-[10px] font-black dark:text-zinc-500">{allKeys.length} ورځې</span>
                </div>
            </div>

            {allKeys.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 opacity-30 text-center">
                    <LucideIcon name="History" size={64} className="mb-4 text-gray-400 dark:text-zinc-600" />
                    <div className="font-black text-sm uppercase tracking-widest text-gray-400 dark:text-zinc-600">تر اوسه هیڅ ډاټا نشته</div>
                </div>
            ) : (
                <div className="space-y-4">
                    {displayedKeys.map((key: any) => {
                        const day = history[key];
                        const info = calculateScore(day, customActions);
                        const displayDate = getDisplayDateForKey(key);

                        return (
                            <div 
                                key={key} 
                                onClick={() => setSelectedDayKey(key)}
                                className="bg-white dark:bg-zinc-900 p-5 rounded-[32px] border border-gray-100 dark:border-zinc-800 shadow-lg flex items-center gap-5 transition-all active:scale-[0.98] cursor-pointer hover:border-primary-color/50"
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-white shadow-xl ${info.percentage > 70 ? 'bg-emerald-500 shadow-emerald-500/20' : info.percentage > 40 ? 'bg-amber-500 shadow-amber-500/20' : 'bg-red-500 shadow-red-500/20'}`}>
                                    {info.percentage}%
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-black text-gray-800 dark:text-white">{displayDate}</div>
                                    <div className="text-[10px] font-black opacity-50 dark:text-zinc-500 uppercase tracking-widest">{info.rank}</div>
                                </div>
                                <LucideIcon name="ChevronLeft" size={16} className="text-gray-300 dark:text-zinc-700" />
                            </div>
                        );
                    })}

                    {hasMore && (
                        <button 
                            onClick={handleLoadMore}
                            className="w-full py-6 mt-4 bg-white dark:bg-zinc-900 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-[32px] text-xs font-black text-gray-400 dark:text-zinc-600 hover:border-primary-color transition-all active:scale-95"
                        >
                            نوره تاریخچه وګورئ...
                        </button>
                    )}
                </div>
            )}

            <Modal 
                isOpen={!!selectedDayKey} 
                onClose={() => setSelectedDayKey(null)} 
                title={selectedDayKey ? getDisplayDateForKey(selectedDayKey) : ""}
            >
                {selectedDayData && selectedDayScore && (
                    <div className="space-y-6">
                        <div className="bg-primary-color/10 p-6 rounded-[32px] border border-primary-color/20 text-center mb-6">
                            <div className="text-4xl font-black primary-text mb-1">{selectedDayScore.percentage}%</div>
                            <div className="text-[10px] font-black uppercase tracking-widest opacity-60 dark:text-white/60">{selectedDayScore.rank}</div>
                        </div>

                        <div className="space-y-4 max-h-[50vh] overflow-y-auto px-1">
                            <DetailItem label={CATEGORIES.PRAYERS} items={selectedDayData.prayers} category="prayers" />
                            <DetailItem label={CATEGORIES.NAFILS} items={selectedDayData.nafils} category="nafils" />
                            <DetailItem label={CATEGORIES.ADHKAR} items={selectedDayData.adhkar} category="adhkar" />
                            <DetailItem label={CATEGORIES.GOOD_DEEDS} items={selectedDayData.deeds} category="deeds" />
                            <DetailItem label={CATEGORIES.CUSTOM} items={selectedDayData.custom} category="custom" />
                            <DetailItem label={CATEGORIES.SINS} items={selectedDayData.sins} category="sins" />
                        </div>

                        <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 flex gap-3">
                            <button 
                                onClick={() => {
                                    const [y, m, d] = selectedDayKey!.split('-').map(Number);
                                    const today = new Date();
                                    today.setHours(0,0,0,0);
                                    
                                    import('react-date-object').then(({ default: DateObject }) => {
                                        import('react-date-object/calendars/persian').then(({ default: persian }) => {
                                            const solarDate = new DateObject({ calendar: persian, year: y, month: m, day: d });
                                            const gregDate = solarDate.toDate();
                                            gregDate.setHours(0,0,0,0);
                                            
                                            const diffInMs = gregDate.getTime() - today.getTime();
                                            const diffInDays = Math.round(diffInMs / 86400000);
                                            
                                            onEditDay(diffInDays - settings.offset);
                                            setSelectedDayKey(null);
                                        });
                                    });
                                }}
                                className="flex-1 primary-bg text-white py-4 rounded-2xl font-black text-xs shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <LucideIcon name="Edit3" size={16} />
                                تغیر ورکړئ (ایډیټ)
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};
