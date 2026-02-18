
import React, { useMemo } from 'react';
import { LucideIcon, InfographicGauge } from './Common';
import { calculateScore, getFormattedDate } from '../utils';

export const EvaluationView = ({ history, customActions, settings }: any) => {
    // مجموعي اوسط د ټولو ثبت شویو ورځو لپاره
    const avg = useMemo(() => {
        const scores = Object.values(history).map((day: any) => calculateScore(day, customActions).percentage);
        return scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    }, [history, customActions]);

    const activeDaysCount = Object.keys(history).length;
    const maxScore = useMemo(() => {
        const scores = Object.values(history).map((day: any) => calculateScore(day, customActions).percentage);
        return scores.length ? Math.max(...scores) : 0;
    }, [history, customActions]);

    /**
     * د تقویم په اساس د تېرو ورځو نمرې ترلاسه کول
     * دا فنکشن ډاډ ترلاسه کوي چې که یوه ورځ خالي وي، نو ګراف کې صفر ښکاري، نه دا چې له پامه وغورځول شي.
     */
    const getCalendarTrend = (count: number) => {
        const trend = [];
        for (let i = count - 1; i >= 0; i--) {
            // د نن ورځې تاریخ څخه په شا ځو (د settings.offset په پام کې نیولو سره)
            const dateInfo = getFormattedDate(settings.offset - i);
            const dayData = history[dateInfo.rawKey];
            const score = dayData ? calculateScore(dayData, customActions).percentage : 0;
            trend.push({ key: dateInfo.rawKey, score, hasData: !!dayData });
        }
        return trend;
    };

    const weeklyTrend = getCalendarTrend(7);
    const monthlyTrend = getCalendarTrend(30);

    const renderGraph = (trendData: any[], title: string) => {
        const count = trendData.length;
        return (
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-[40px] border border-gray-100 dark:border-zinc-800 shadow-xl mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-black text-gray-700 dark:text-zinc-300 text-sm">{title}</h3>
                    <span className="text-[10px] font-black primary-text bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-lg">وروستي {count} ورځې</span>
                </div>
                <div className="flex items-end gap-1.5 h-40 px-2 border-b border-gray-100 dark:border-zinc-800 pb-2">
                    {trendData.map((day, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center group h-full justify-end">
                            <div 
                                className={`w-full primary-bg rounded-t-xl transition-all relative ${!day.hasData ? 'h-1 opacity-10' : day.score === 0 ? 'h-1 opacity-20' : ''}`} 
                                style={{ height: day.hasData ? `${day.score}%` : '4px' }}
                            >
                                {day.hasData && (
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md whitespace-nowrap z-10">
                                        {day.score}%
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between mt-3 text-[8px] font-black text-gray-400 uppercase tracking-widest px-1">
                    <span>{count} ورځې وړاندې</span>
                    <span>نن</span>
                </div>
            </div>
        );
    };

    return (
        <div className="animate-fade p-6 pb-24 min-h-screen bg-gray-50 dark:bg-black">
            <h2 className="text-3xl font-black mb-8 text-emerald-900 dark:text-emerald-400">تحلیلي ارزونه</h2>
            
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-[40px] border border-gray-100 dark:border-zinc-800 shadow-2xl mb-8 flex items-center justify-between gap-6">
                <div className="flex-1">
                    <h3 className="text-lg font-black dark:text-white mb-2 leading-tight">مجموعي روحاني اوسط</h3>
                    <p className="text-xs text-gray-400 font-black leading-relaxed">ستاسو د ټولو ثبت شویو ورځو د معنوي کچې اوسط.</p>
                </div>
                <div className="flex-shrink-0">
                    <InfographicGauge percentage={avg} size="small" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-[32px] border border-blue-100 dark:border-blue-800/50 text-center shadow-sm">
                    <div className="text-blue-700 dark:text-blue-400 text-4xl font-black mb-1 leading-none">{activeDaysCount}</div>
                    <div className="text-[10px] font-black text-blue-600/60 uppercase tracking-widest">فعاله ورځې</div>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/10 p-6 rounded-[32px] border border-emerald-100 dark:border-emerald-800/50 text-center shadow-sm">
                    <div className="primary-text text-4xl font-black mb-1 leading-none">{maxScore}%</div>
                    <div className="text-[10px] font-black primary-text/60 uppercase tracking-widest">اعظمي ریکارډ</div>
                </div>
            </div>

            {renderGraph(weeklyTrend, 'اونیز معنوي سیر')}
            {renderGraph(monthlyTrend, 'مياشتنی معنوي سیر')}
            
            <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-[32px] border border-amber-100 dark:border-amber-900/20 shadow-sm flex items-start gap-4">
                <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-2xl text-amber-600">
                    <LucideIcon name="Lightbulb" size={24} />
                </div>
                <div>
                    <h4 className="font-black text-amber-800 dark:text-amber-400 text-sm mb-1">روحاني لارښود</h4>
                    <p className="text-[11px] text-amber-700 dark:text-amber-500/80 leading-relaxed font-black">
                        {activeDaysCount < 5 
                            ? "د خپل روحاني سیر د دقیقې کچې معلومولو لپاره لږ تر لږه ۵ ورځې فعالیت ثبت کړئ."
                            : avg > 80 
                            ? "ماشاء الله! ستاسو روحاني وضعیت خورا ښه دی. په همدې استقامت پاتې شئ."
                            : "هڅه وکړئ د جماعت په لمانځه او نفلونو کې زیاتی راولئ ترڅو ستاسو اوسط کچه لوړه شي."}
                    </p>
                </div>
            </div>
        </div>
    );
};
