import React, { useEffect, useState } from 'react';

export default function ResultModal({ results, onRestart, onClose }) {
    const winner = results[0];
    const others = results.slice(1);

    // Animation state for showing modal
    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(true);
    }, []);

    if (!winner) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
            <div className={`relative flex flex-col w-full max-w-[480px] max-h-[90vh] bg-white dark:bg-zinc-900 rounded-xl shadow-[0_10px_40px_rgba(234,179,8,0.15)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden border-4 border-yellow-200 dark:border-white/10 ring-4 ring-white/50 dark:ring-black/20 transform transition-all duration-500 ${show ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>

                <div className="flex items-center justify-between px-6 py-5 border-b border-yellow-200 dark:border-white/5 bg-yellow-50/50 dark:bg-black/20">
                    <h2 className="text-xl font-bold tracking-tight text-yellow-900 dark:text-yellow-100 flex items-center gap-2">
                        <span className="material-symbols-outlined text-yellow-500">trophy</span>
                        경기 결과
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-yellow-700/60 hover:text-yellow-900 dark:text-gray-400 dark:hover:text-white transition-colors bg-yellow-100 hover:bg-yellow-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-full p-1">
                        <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
                    <div className="flex flex-col items-center justify-center">
                        <div className="relative mb-4 group cursor-default">
                            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-yellow-300 text-yellow-900 p-2 rounded-full shadow-lg z-20 border-[3px] border-white dark:border-background-dark animate-bounce">
                                <span className="material-symbols-outlined text-3xl">emoji_events</span>
                            </div>
                            <div className="p-2 rounded-full bg-gradient-to-b from-yellow-300 via-yellow-400 to-orange-400 shadow-xl shadow-yellow-200/50 dark:shadow-none">
                                <div className="h-32 w-32 bg-center bg-no-repeat bg-cover rounded-full border-[5px] border-white dark:border-zinc-800 bg-white" style={{ backgroundImage: `url('${winner.avatar}')` }}></div>
                            </div>
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-md border-2 border-white dark:border-zinc-800 whitespace-nowrap">
                                1st Place
                            </div>
                        </div>
                        <div className="text-center space-y-1 mt-2">
                            <h3 className="text-2xl font-bold text-yellow-950 dark:text-white">{winner.name}</h3>
                            <p className="text-orange-500 dark:text-yellow-400 font-bold text-xl font-mono">WINNER!</p>
                            <p className="text-yellow-800/70 dark:text-gray-400 text-sm font-medium">놀라운 속도로 우승을 차지했습니다!</p>
                        </div>
                    </div>

                    {others.length > 0 && (
                        <>
                            <div className="flex items-center gap-4">
                                <div className="h-px flex-1 bg-yellow-200 dark:bg-white/10"></div>
                                <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest">Rankings</span>
                                <div className="h-px flex-1 bg-yellow-200 dark:bg-white/10"></div>
                            </div>
                            <div className="flex flex-col gap-3">
                                {others.map((r, i) => (
                                    <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-white/5 hover:bg-yellow-50 dark:hover:bg-white/10 transition-all shadow-sm border border-yellow-100 dark:border-white/5 hover:border-yellow-300">
                                        <div className="flex items-center gap-4 flex-1 overflow-hidden">
                                            <div className="flex items-center justify-center w-8 h-8 shrink-0 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-300 font-bold font-mono text-sm border border-gray-200 dark:border-white/10">
                                                {i + 2}
                                            </div>
                                            <div className="h-11 w-11 shrink-0 bg-center bg-no-repeat bg-cover rounded-full ring-2 ring-gray-200 dark:ring-white/10" style={{ backgroundImage: `url('${r.avatar}')` }}></div>
                                            <div className="flex flex-col min-w-0">
                                                <p className="text-base font-bold leading-tight truncate text-gray-800 dark:text-gray-200">{r.name}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <div className="p-6 pt-2 bg-gradient-to-t from-white via-white to-transparent dark:from-zinc-900 dark:via-zinc-900">
                    <button
                        onClick={onRestart}
                        className="relative w-full overflow-hidden rounded-xl bg-primary hover:bg-primary-dark py-4 text-amber-950 dark:text-black shadow-[0_4px_0_rgb(217,119,6)] active:shadow-none active:translate-y-[4px] transition-all duration-150 group">
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                        <span className="relative flex items-center justify-center gap-2 text-lg font-bold tracking-wide">
                            <span className="material-symbols-outlined">restart_alt</span>
                            재경주하기
                        </span>
                    </button>
                </div>

            </div>
        </div>
    );
}
