

import { MONTHS_LUNAR, MONTHS_SOLAR, MONTHS_GREGORIAN } from './constants';
// @ts-ignore
import DateObject from "react-date-object";
// @ts-ignore
import arabic from "react-date-object/calendars/arabic";
// @ts-ignore
import persian from "react-date-object/calendars/persian";

export const getStorage = (key: string, fallback: any) => {
    const saved = localStorage.getItem(key);
    try { return saved ? JSON.parse(saved) : fallback; } catch(e) { return fallback; }
};

export const setStorage = (key: string, val: any) => localStorage.setItem(key, JSON.stringify(val));

/**
 * د دقیق تاریخونو محاسبه د react-date-object په مرسته
 */
export const getFormattedDate = (offset = 0) => {
    const today = new Date();
    today.setDate(today.getDate() + offset);

    // هجري قمري
    const lunarDate = new DateObject({ date: today, calendar: arabic });
    // هجري لمریز
    const solarDate = new DateObject({ date: today, calendar: persian });
    // میلادي
    const gregDate = new DateObject({ date: today });

    return {
        lunar: `${lunarDate.day} ${MONTHS_LUNAR[lunarDate.month.index]} ${lunarDate.year}`,
        solar: `${solarDate.day} ${MONTHS_SOLAR[solarDate.month.index]} ${solarDate.year}`,
        gregorian: `${gregDate.day} ${MONTHS_GREGORIAN[gregDate.month.index]} ${gregDate.year}`,
        // Raw key stays solar/persian for consistency in database keys
        rawKey: `${solarDate.year}-${String(solarDate.month.index + 1).padStart(2, '0')}-${String(solarDate.day).padStart(2, '0')}`
    };
};

/**
 * د ذخیره شوې کلي (Solar Key) پر اساس د تاریخ فارمټ کول
 */
export const formatDateFromKey = (key: string, calendarType: string) => {
    try {
        const [y, m, d] = key.split('-').map(Number);
        // کلي (key) په شمسي کالنډر کې ذخیره شوې ده
        const solarDate = new DateObject({ calendar: persian, year: y, month: m, day: d });
        
        if (calendarType === 'solar') {
            return `${solarDate.day} ${MONTHS_SOLAR[solarDate.month.index]} ${solarDate.year}`;
        }
        
        if (calendarType === 'lunar') {
            const lunarDate = new DateObject(solarDate).convert(arabic);
            return `${lunarDate.day} ${MONTHS_LUNAR[lunarDate.month.index]} ${lunarDate.year}`;
        }
        
        // میلادي ته اړول - Fix: avoid convert() with no arguments as it requires at least one to satisfy TS.
        const gregDate = new DateObject(solarDate.toDate());
        return `${gregDate.day} ${MONTHS_GREGORIAN[gregDate.month.index]} ${gregDate.year}`;
    } catch (e) {
        return key;
    }
};

// Backwards compatibility for the app
export const getHijriDate = (offset = 0) => getFormattedDate(offset);

export const calculateScore = (dayData: any, customActions: any[] = []) => {
    let score = 0; let max = 0;
    // Prayers
    Object.values(dayData.prayers || {}).forEach((p: any) => { 
        max += 10; 
        if (p === 'jamaat') score += 10; 
        else if (p === 'ada') score += 7; 
    });
    // Checklists (Nafils, Adhkar, Deeds)
    [dayData.nafils || {}, dayData.adhkar || {}, dayData.deeds || {}].forEach(cat => {
        Object.values(cat).forEach(v => { max += 5; if (v) score += 5; });
    });
    // Sins
    Object.values(dayData.sins || {}).forEach(v => { if (v) score -= 10; });
    // Custom
    customActions.forEach(action => {
        const p = parseInt(action.points) || 0;
        if (p > 0) max += p;
        if (dayData.custom?.[action.id]) score += p;
    });

    const percentage = Math.max(0, Math.min(100, max > 0 ? Math.round((score / max) * 100) : 0));
    let rank = "غافل"; let msg = "وخت تېرېدونکی دی، توبه وباسه او بېرته راوګرځه.";
    if (percentage >= 90) { rank = "مومن"; msg = "سبحان الله! ته د کمال په لور روان یې."; }
    else if (percentage >= 70) { rank = "صالح"; msg = "ماشاء الله، ستا هڅې د ستایلو دي."; }
    else if (percentage >= 50) { rank = "تلاش کوونکی"; msg = "نوره هڅه وکړه، ته کولای شې ښه شې."; }
    return { score, max, percentage, rank, msg };
};
