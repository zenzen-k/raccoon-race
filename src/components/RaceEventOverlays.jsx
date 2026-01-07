import React, { useEffect, useState } from 'react';

// --- SUB-COMPONENTS FOR EACH EVENT UI ---

export const MudOverlay = ({ active }) => {
    if (!active) return null;
    return (
        <div className="absolute inset-y-0 left-[30%] right-[30%] bg-mud-pattern opacity-30 dark:opacity-20 rounded-lg pointer-events-none z-0">
            <div className="absolute -top-6 left-0 flex items-center gap-1 bg-amber-800/80 text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm z-30">
                <span className="material-symbols-outlined text-[12px]">warning</span> 진흙탕!
            </div>
        </div>
    );
};

export const SlowingBadge = ({ active }) => {
    if (!active) return null;
    return (
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center slowing-badge z-30">
            <span className="text-red-500 font-bold text-xs drop-shadow-sm flex items-center bg-white/80 dark:bg-black/80 px-1 rounded">
                <span className="material-symbols-outlined text-sm mr-0.5">arrow_downward</span> 속도↓
            </span>
        </div>
    );
};

export const WindOverlay = ({ active, direction = 'tailwind' }) => {
    if (!active) return null;
    return (
        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
            <div className="absolute top-4 right-4 animate-bounce-slow z-30">
                <div className="bg-blue-400/90 dark:bg-blue-600/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl shadow-lg border-2 border-white/30 flex items-center gap-2">
                    <span className="material-symbols-outlined animate-spin" style={{ animationDuration: '3s' }}>air</span>
                    <div>
                        <p className="text-[10px] font-bold opacity-90 uppercase tracking-wider">바람 이벤트</p>
                        <p className="font-bold text-xs leading-tight">
                            {direction === 'tailwind' ? '강력한 순풍! (속도 증가)' : '강력한 역풍! (속도 감소)'}
                        </p>
                    </div>
                </div>
            </div>
            {/* Wind Particles */}
            {[20, 35, 50, 65, 80].map((top, i) => (
                <div
                    key={i}
                    className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-300/40 to-transparent animate-wind-flow"
                    style={{
                        top: `${top}%`,
                        animationDuration: `${1.2 + (i * 0.2)}s`,
                        animationDelay: `${i * 0.3}s`,
                        animationDirection: direction === 'headwind' ? 'reverse' : 'normal'
                    }}
                ></div>
            ))}
        </div>
    );
};

export const CottonCandyItem = ({ active }) => {
    if (!active) return null;
    return (
        <div className="absolute top-1/2 -right-12 transform -translate-y-1/2 z-10 animate-pulse-fast pointer-events-none">
            <div className="w-8 h-8 bg-pink-100 dark:bg-pink-900/40 rounded-full flex items-center justify-center shadow-inner border border-pink-300">
                <span className="material-symbols-outlined text-pink-400 text-sm">cloud</span>
            </div>
            <div className="absolute -top-1 -right-1 text-yellow-400 text-[10px]">✨</div>
        </div>
    );
};

export const StunnedBadge = ({ active }) => {
    if (!active) return null;
    return (
        <>
            <div className="absolute -top-14 -left-6 z-40 animate-float pointer-events-none">
                <div className="bg-white dark:bg-gray-800 text-pink-500 font-bold text-[10px] px-2 py-1 rounded-full shadow-md border border-pink-500/30 mb-1 whitespace-nowrap flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">icecream</span>
                    맛있다!
                </div>
            </div>
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-30">
                <span className="material-symbols-outlined text-2xl text-blue-400 animate-spin-slow drop-shadow-md">cyclone</span>
            </div>
        </>
    );
};

export const TrashCanItem = ({ active, triggered, effectType }) => { // effectType: 'boost' | 'slow'
    if (!active && !triggered) return null;

    if (triggered) {
        // Pop-up result
        return (
            <div className="absolute -top-16 -right-8 z-30 animate-pop origin-bottom-left pointer-events-none">
                <div className="relative bg-white dark:bg-gray-800 p-2 rounded-xl rounded-bl-none shadow-xl border-2 border-primary flex items-center gap-2">
                    <div className={`p-1 rounded-lg ${effectType === 'boost' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                        <span className="material-symbols-outlined text-sm">
                            {effectType === 'boost' ? 'rocket_launch' : 'sentiment_very_dissatisfied'}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[8px] uppercase font-bold text-gray-400 leading-none">발견!</span>
                        <span className="text-xs font-bold text-gray-800 dark:text-white leading-tight">
                            {effectType === 'boost' ? '로켓 부스트' : '생선 가시'}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="absolute left-[50%] top-1/2 -translate-y-1/2 z-20 animate-float pointer-events-none">
            <div className="relative w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-400 dark:from-gray-600 dark:to-gray-800 rounded-lg shadow-lg border-2 border-white/50 dark:border-white/10 flex items-center justify-center shiny-effect">
                <span className="material-symbols-outlined text-xl text-gray-600 dark:text-gray-300">delete</span>
                <span className="absolute -top-2 -right-2 text-yellow-400 text-xs animate-pulse">✨</span>
            </div>
        </div>
    );
};

export const SwapBadge = ({ active, type }) => { // type: 'up' | 'down'
    if (!active) return null;
    const isUp = type === 'up';
    return (
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-40 animate-bounce">
            <span className={`text-[10px] font-bold ${isUp ? 'text-green-600' : 'text-red-500'} bg-white/90 dark:bg-black/90 px-1.5 py-0.5 rounded shadow-sm border ${isUp ? 'border-green-200' : 'border-red-200'}`}>
                {isUp ? '▲ 순위 상승' : '▼ 순위 하락'}
            </span>
        </div>
    );
};

export const SwapEffectOverlay = ({ active }) => {
    if (!active) return null;
    // Flash effect for the swapping raccoons
    return (
        <div className="absolute inset-0 bg-white/50 dark:bg-white/10 z-50 animate-swap-flash pointer-events-none rounded-r-xl"></div>
    );
};
