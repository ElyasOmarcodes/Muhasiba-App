
export const MONTHS_LUNAR = ["محرم", "صفر", "ربیع الاول", "ربیع الثاني", "جمادي الاول", "جمادي الثاني", "رجب", "شعبان", "رمضان", "شوال", "ذوالقعده", "ذوالحجه"];
export const MONTHS_SOLAR = ["حمل", "ثور", "جوزا", "سرطان", "اسد", "سنبله", "ميزان", "عقرب", "قوس", "جدي", "دلو", "حوت"];
export const MONTHS_GREGORIAN = ["جنوري", "فبروري", "مارچ", "اپریل", "مې", "جون", "جولای", "اګسټ", "سپټمبر", "اکتوبر", "نومبر", "دسمبر"];

export const CALENDAR_TYPES = [
    { id: 'lunar', label: 'قمري هجري' },
    { id: 'solar', label: 'لمریز هجري' },
    { id: 'gregorian', label: 'میلادي' }
];

export const COLOR_PRESETS = [
    { id: 'emerald', hex: '#059669', name: 'شین' },
    { id: 'blue', hex: '#2563eb', name: 'آبي' },
    { id: 'indigo', hex: '#4f46e5', name: 'بنفش' },
    { id: 'amber', hex: '#d97706', name: 'زرین' },
    { id: 'rose', hex: '#e11d48', name: 'سور' },
    { id: 'violet', hex: '#8b5cf6', name: 'ارغواني' },
    { id: 'teal', hex: '#0d9488', name: 'کاشي' },
    { id: 'orange', hex: '#ea580c', name: 'نارنجي' },
    { id: 'cyan', hex: '#0891b2', name: 'فیروزي' },
    { id: 'slate', hex: '#475569', name: 'خړ' }
];

export const CATEGORIES = {
    PRAYERS: 'لمونځونه',
    NAFILS: 'نفلونه',
    ADHKAR: 'اذکار',
    GOOD_DEEDS: 'نیک عملونه',
    SINS: 'ګناهونه',
    CUSTOM: 'شخصي اعمال'
};

export const INITIAL_DAY_STATE = {
    prayers: { fajr: 'ada', dhuhr: 'ada', asr: 'ada', maghrib: 'ada', isha: 'ada' },
    nafils: { tahajjud: false, awwabin: false, masjid: false, wudu: false },
    adhkar: { tasbih: false, istighfar: false, tilawat: false, durud: false, postSalah: false, dua: false },
    deeds: { kinship: false, speech: false, sick: false, amr: false, graves: false, sadaqah: false, kindWords: false },
    sins: { lies: false, gossip: false, adultery: false, sodomy: false, theft: false, fraud: false, obscenity: false, music: false, others: false },
    custom: {} 
};
