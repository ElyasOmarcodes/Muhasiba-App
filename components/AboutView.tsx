
import React from 'react';
import { LucideIcon } from './Common';

export const AboutView = () => (
    <div className="animate-fade p-6 pb-24 h-full bg-gray-50 dark:bg-black">
        <h2 className="text-3xl font-black mb-8 text-emerald-900 dark:text-emerald-400">زمونږ په اړه</h2>
        
        {/* Profile Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-[48px] overflow-hidden shadow-2xl border border-gray-100 dark:border-zinc-800 mb-8">
            <div className="primary-bg p-12 text-center relative">
                <div className="absolute top-0 right-0 w-full h-full bg-black/5"></div>
                <div className="relative z-10">
                    <div className="w-36 h-36 bg-white rounded-[42px] mx-auto p-1 shadow-2xl rotate-3 transition-transform hover:rotate-0 mb-6">
                        <div className="w-full h-full bg-gray-100 dark:bg-zinc-800 rounded-[38px] flex items-center justify-center overflow-hidden">
                             <LucideIcon name="User" size={80} className="text-gray-400 dark:text-zinc-600" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-black text-white mb-1">الیاس عمر</h3>
                    <p className="text-white/70 text-sm font-black tracking-[0.1em] uppercase">Elyas Omar</p>
                    <div className="mt-4 inline-block bg-black/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
                        <span className="text-[10px] text-white font-black uppercase tracking-widest">Version 4.0.0</span>
                    </div>
                </div>
            </div>

            <div className="p-8 space-y-6">
                <div className="text-center">
                    <p className="text-sm font-black text-gray-600 dark:text-zinc-400 leading-relaxed">
                        د ټکنالوژۍ او معنويت ترمنځ د یوې پیاوړې اړیکې په لټه کې یو. مُحاسِبه زموږ لومړنۍ هڅه ده چې د انسانانو د معنوي ودې لپاره مو کړې ده.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-[28px] text-center border border-gray-100 dark:border-zinc-800">
                        <div className="primary-text font-black text-xl mb-1">۵+</div>
                        <div className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">پروژې</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-[28px] text-center border border-gray-100 dark:border-zinc-800">
                        <div className="primary-text font-black text-xl mb-1">۱۰۰٪</div>
                        <div className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">رضایت</div>
                    </div>
                </div>

                <div className="space-y-3">
                    <a href="https://wa.me/93782965085" className="flex items-center gap-4 p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-[24px] border border-emerald-100 dark:border-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-black text-sm">
                        <LucideIcon name="MessageCircle" size={20} />
                        <span className="flex-1" dir="ltr">+93 782 965 085</span>
                    </a>
                    <a href="https://t.me/G_Zwan" className="flex items-center gap-4 p-4 bg-sky-50 dark:bg-sky-950/20 rounded-[24px] border border-sky-100 dark:border-sky-900/20 text-sky-700 dark:text-sky-400 font-black text-sm">
                        <LucideIcon name="Send" size={20} />
                        <span className="flex-1">ټیلیګرام ته راشئ</span>
                    </a>
                </div>
            </div>
        </div>

        {/* Legal Links */}
        <div className="space-y-4">
            <a 
                href="https://docs.google.com/document/d/1QgynQp70Z2Qal3bJLJbSklnvHCN2UnMWh6BM-64wXl0/edit?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-white dark:bg-zinc-900 p-6 rounded-[32px] font-black shadow-lg border border-gray-100 dark:border-zinc-800 flex items-center justify-between group active:scale-[0.98] transition-all"
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center text-amber-600">
                        <LucideIcon name="ShieldCheck" size={24} />
                    </div>
                    <span className="text-sm dark:text-zinc-200">د محرمیت پالیسي (Privacy Policy)</span>
                </div>
                <LucideIcon name="ExternalLink" size={18} className="text-gray-300 group-hover:text-primary transition-colors" />
            </a>
        </div>

        <div className="mt-12 text-center pb-8">
            <p className="text-[10px] font-black text-gray-400 dark:text-zinc-600 uppercase tracking-[0.4em] mb-2 font-black">Developed with elyasy omar</p>
            <div className="flex justify-center gap-4 opacity-30">
                 <LucideIcon name="Code" size={12} />
                 <LucideIcon name="Heart" size={12} />
                 <LucideIcon name="Globe" size={12} />
            </div>
        </div>
    </div>
);
