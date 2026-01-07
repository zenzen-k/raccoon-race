import React, { useEffect, useState, useRef } from 'react';
import { MudOverlay, SlowingBadge, WindOverlay, CottonCandyItem, StunnedBadge, TrashCanItem, SwapBadge, SwapEffectOverlay } from './RaceEventOverlays';

export default function RaceScreen({ raccoons, onRaceFinish, onRestart }) {
    // 렌더링용 상태
    const [positions, setPositions] = useState(
        raccoons.reduce((acc, r) => ({ ...acc, [r.id]: 0 }), {})
    );
    const [finished, setFinished] = useState([]);

    // 이벤트 관련 상태
    const [activeGlobalEvent, setActiveGlobalEvent] = useState(null);
    const [raccoonEffects, setRaccoonEffects] = useState({});
    const [recentSwap, setRecentSwap] = useState(null);
    const [trashCanEvents, setTrashCanEvents] = useState({});
    const [commentary, setCommentary] = useState([]);

    // 로직 제어용 Ref (애니메이션 루프 내에서 최신 값을 안전하게 참조)
    const stateRef = useRef({
        positions: raccoons.reduce((acc, r) => ({ ...acc, [r.id]: 0 }), {}),
        finished: [],
        activeGlobalEvent: null,
        raccoonEffects: {},
        trashCanEvents: {},
        recentSwap: null
    });

    const raccoonsRef = useRef(raccoons);
    useEffect(() => {
        raccoonsRef.current = raccoons;
        const currentPos = stateRef.current.positions;
        const newPos = { ...currentPos };
        let changed = false;

        raccoons.forEach(r => {
            if (newPos[r.id] === undefined) {
                newPos[r.id] = 0;
                changed = true;
            }
        });

        if (changed) {
            stateRef.current.positions = newPos;
            setPositions(newPos);
        }
    }, [raccoons]);

    const requestRef = useRef();
    const intervalRef = useRef();

    // 중계 메시지 추가 함수
    const addCommentary = (text) => {
        const timeStr = new Date().toLocaleTimeString('ko-KR', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setCommentary(prev => [{ id: Date.now(), text, time: timeStr }, ...prev]);
    };

    // 랜덤 이벤트 트리거 (한글 메시지 및 로직 개선)
    const triggerRandomEvent = () => {
        const events = ['MUD', 'WIND', 'COTTON', 'TRASH', 'SWAP'];
        const type = events[Math.floor(Math.random() * events.length)];
        const now = Date.now();

        const currentPositions = stateRef.current.positions;
        const currentFinished = stateRef.current.finished;

        const activeRaccoonIds = raccoonsRef.current
            .map(r => r.id)
            .filter(id => !currentFinished.some(f => f.id === id) && currentPositions[id] < 100);

        if (activeRaccoonIds.length === 0) return;

        switch (type) {
            case 'MUD': {
                const targetId = activeRaccoonIds[Math.floor(Math.random() * activeRaccoonIds.length)];
                const raccoonName = raccoonsRef.current.find(r => r.id === targetId)?.name;
                const newEffect = { type: 'MUD', endTime: now + 3000 };

                stateRef.current.raccoonEffects = { ...stateRef.current.raccoonEffects, [targetId]: newEffect };
                setRaccoonEffects(prev => ({ ...prev, [targetId]: newEffect }));

                addCommentary(`⚠️ ${raccoonName}이(가) 진흙탕에 빠졌습니다! 속도가 크게 줄어듭니다!`);
                break;
            }
            case 'WIND': {
                const isTailwind = Math.random() > 0.5;
                const newEvent = { type: 'WIND', direction: isTailwind ? 'tailwind' : 'headwind', endTime: now + 4000 };

                stateRef.current.activeGlobalEvent = newEvent;
                setActiveGlobalEvent(newEvent);

                addCommentary(isTailwind ? "🌬️ 시원한 순풍이 붑니다! 모든 라쿤의 속도가 빨라집니다!" : "🌪️ 강력한 맞바람이 불어옵니다! 전원 속도 유지에 비상!");
                break;
            }
            case 'COTTON': {
                const targetId = activeRaccoonIds[Math.floor(Math.random() * activeRaccoonIds.length)];
                const raccoonName = raccoonsRef.current.find(r => r.id === targetId)?.name;
                const newEffect = { type: 'STUN', endTime: now + 2000 };

                stateRef.current.raccoonEffects = { ...stateRef.current.raccoonEffects, [targetId]: newEffect };
                setRaccoonEffects(prev => ({ ...prev, [targetId]: newEffect }));

                addCommentary(`🍭 ${raccoonName}이(가) 달콤한 솜사탕의 유혹에 빠져 멈춰버렸습니다!`);
                break;
            }
            case 'TRASH': {
                const targetId = activeRaccoonIds[Math.floor(Math.random() * activeRaccoonIds.length)];
                const raccoonName = raccoonsRef.current.find(r => r.id === targetId)?.name;
                const currentPos = currentPositions[targetId];
                // 라쿤의 앞쪽에 쓰레기통 생성 (자동 트리거용)
                const trashPos = Math.min(95, currentPos + 5 + Math.random() * 10);

                const newEvent = { triggered: false, result: Math.random() > 0.4 ? 'boost' : 'slow', xPercent: trashPos, endTime: now + 5000 };
                stateRef.current.trashCanEvents = { ...stateRef.current.trashCanEvents, [targetId]: newEvent };
                setTrashCanEvents(prev => ({ ...prev, [targetId]: newEvent }));

                addCommentary(`🗑️ ${raccoonName} 앞에 반짝이는 쓰레기통이 나타났습니다! 무엇이 들어있을까요?`);
                break;
            }
            case 'SWAP': {
                if (activeRaccoonIds.length < 2) return;
                // 거리순 정렬
                const sorted = [...activeRaccoonIds].sort((a, b) => currentPositions[b] - currentPositions[a]);
                if (sorted.length < 2) return;

                let r1, r2;
                // 확률적으로 1등과 꼴등 교체, 아니면 바로 앞 순위와 교체
                if (sorted.length > 2 && Math.random() > 0.8) {
                    r1 = sorted[0];
                    r2 = sorted[sorted.length - 1];
                    addCommentary(`🌀 대혼란! 1등과 꼴등의 위치가 뒤바뀝니다!!`);
                } else {
                    const idx = Math.floor(Math.random() * (sorted.length - 1)) + 1;
                    r1 = sorted[idx];
                    r2 = sorted[idx - 1];
                    const name1 = raccoonsRef.current.find(r => r.id === r1)?.name;
                    const name2 = raccoonsRef.current.find(r => r.id === r2)?.name;
                    addCommentary(`✨ ${name1}이(가) 순간이동으로 ${name2}의 앞을 가로챕니다!`);
                }

                const pos1 = currentPositions[r1];
                const pos2 = currentPositions[r2];

                stateRef.current.positions = {
                    ...stateRef.current.positions,
                    [r1]: pos2,
                    [r2]: pos1
                };

                const swapData = { ids: [r1, r2], type: pos2 > pos1 ? 'up' : 'down', endTime: now + 1000 };
                stateRef.current.recentSwap = swapData;
                setRecentSwap(swapData);
                break;
            }
            default: break;
        }
    };

    // 1초마다 실행되는 클린업 및 이벤트 발생 체크 루프
    useEffect(() => {
        intervalRef.current = setInterval(() => {
            const now = Date.now();
            const state = stateRef.current;

            if (state.activeGlobalEvent && now > state.activeGlobalEvent.endTime) {
                state.activeGlobalEvent = null;
                setActiveGlobalEvent(null);
            }

            let effectsChanged = false;
            const nextEffects = { ...state.raccoonEffects };
            Object.keys(nextEffects).forEach(key => {
                if (now > nextEffects[key].endTime) {
                    delete nextEffects[key];
                    effectsChanged = true;
                }
            });
            if (effectsChanged) {
                state.raccoonEffects = nextEffects;
                setRaccoonEffects(nextEffects);
            }

            if (state.recentSwap && now > state.recentSwap.endTime) {
                state.recentSwap = null;
                setRecentSwap(null);
            }

            // 이벤트 발생 확률 (1초마다 60% 확률로 이벤트 발생 여부 결정)
            if (state.finished.length < raccoonsRef.current.length) {
                if (Math.random() < 0.6) {
                    triggerRandomEvent();
                }
            }
        }, 1000);

        return () => clearInterval(intervalRef.current);
    }, []);

    // 메인 애니메이션 루프
    useEffect(() => {
        let lastTime = Date.now();

        const animate = () => {
            const now = Date.now();
            let dt = (now - lastTime) / 1000;
            if (dt > 0.1) dt = 0.1;
            lastTime = now;

            const state = stateRef.current;
            const currentRaccoons = raccoonsRef.current;
            const nextPositions = { ...state.positions };
            let hasChanges = false;
            const newlyFinished = [];

            currentRaccoons.forEach(r => {
                if (!state.finished.some(f => f.id === r.id) && state.positions[r.id] < 100) {
                    let speed = (5 + Math.random() * 8);

                    const effect = state.raccoonEffects[r.id];
                    if (effect?.type === 'MUD') speed *= 0.5;
                    if (effect?.type === 'STUN') speed = 0;
                    if (effect?.type === 'BOOST') speed *= 1.8;

                    const global = state.activeGlobalEvent;
                    if (global) {
                        if (global.direction === 'tailwind') speed *= 1.3;
                        else speed *= 0.7;
                    }

                    // 쓰레기통 자동 충돌 로직
                    const trash = state.trashCanEvents[r.id];
                    if (trash && !trash.triggered) {
                        if (state.positions[r.id] >= trash.xPercent - 1) {
                            const newState = { ...trash, triggered: true, endTime: now + 2000 };
                            state.trashCanEvents = { ...state.trashCanEvents, [r.id]: newState };
                            setTrashCanEvents(prev => ({ ...prev, [r.id]: newState }));

                            const resultEffect = {
                                type: trash.result === 'boost' ? 'BOOST' : 'MUD',
                                endTime: now + 2000
                            };
                            state.raccoonEffects = { ...state.raccoonEffects, [r.id]: resultEffect };
                            setRaccoonEffects(prev => ({ ...prev, [r.id]: resultEffect }));

                            const msg = trash.result === 'boost'
                                ? `🚀 ${r.name}이(가) 쓰레기통에서 로켓 부스터를 찾았습니다! 대질주 시작!`
                                : `🦴 ${r.name}이(가) 쓰레기통에서 생선 가시를 밟았습니다... 속도가 느려집니다.`;
                            addCommentary(msg);
                        }
                    }

                    const dist = speed * dt;
                    nextPositions[r.id] = Math.min(100, nextPositions[r.id] + dist);
                    hasChanges = true;

                    if (nextPositions[r.id] >= 100) {
                        newlyFinished.push(r);
                    }
                }
            });

            if (hasChanges) {
                state.positions = nextPositions;
                setPositions(nextPositions);
            }

            if (newlyFinished.length > 0) {
                const combinedFinished = [...state.finished, ...newlyFinished];
                const uniqueFinished = Array.from(new Set(combinedFinished.map(r => r.id)))
                    .map(id => combinedFinished.find(r => r.id === id));

                state.finished = uniqueFinished;
                setFinished(uniqueFinished);

                if (uniqueFinished.length === currentRaccoons.length) {
                    setTimeout(() => onRaceFinish(uniqueFinished), 1000);
                }
            }

            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, []);

    // 리더보드용 정렬 로직
    const leaderBoard = [...raccoons].sort((a, b) => {
        const finishIdxA = finished.findIndex(f => f.id === a.id);
        const finishIdxB = finished.findIndex(f => f.id === b.id);
        if (finishIdxA !== -1 && finishIdxB !== -1) return finishIdxA - finishIdxB;
        if (finishIdxA !== -1) return -1;
        if (finishIdxB !== -1) return 1;
        return (positions[b.id] || 0) - (positions[a.id] || 0);
    });

    const isRaceOver = finished.length === raccoons.length;

    return (
        <div className="flex flex-col items-center w-full px-4 md:px-10 py-8 gap-8 max-w-[1400px] mx-auto min-h-screen">
            <section className="w-full flex flex-col gap-4">
                <div className="flex justify-between items-end px-2">
                    <h3 className="text-2xl font-bold">실시간 경기 중계</h3>
                    <div className="flex gap-2 items-center">
                        {isRaceOver && (
                            <button
                                onClick={onRestart}
                                className="animate-pulse bg-primary hover:bg-primary-dark text-black font-bold px-4 py-1.5 rounded-full shadow-md transition-colors flex items-center gap-1 mr-2"
                            >
                                <span className="material-symbols-outlined text-sm">restart_alt</span> 다시 시작
                            </button>
                        )}
                        <button className="text-xs font-bold px-3 py-1 rounded-full bg-primary text-background-dark">카메라 1</button>
                    </div>
                </div>

                {/* 경기장 트랙 */}
                <div className="relative w-full aspect-[2/1] md:aspect-[3/1] bg-[#e8e2ce] dark:bg-[#2a261a] rounded-xl overflow-hidden shadow-inner border-4 border-[#dcd6c0] dark:border-[#3a3525]">
                    <div className="absolute inset-0 opacity-10 dark:opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                    {/* 환경 효과 레이어 */}
                    <WindOverlay active={!!activeGlobalEvent} direction={activeGlobalEvent?.direction} />

                    <div className="absolute inset-0 flex flex-col py-8 justify-evenly">
                        {raccoons.map((r, i) => {
                            const isStunned = raccoonEffects[r.id]?.type === 'STUN';
                            const isMuddy = raccoonEffects[r.id]?.type === 'MUD';
                            const trashEvent = trashCanEvents[r.id];
                            const isSwapped = recentSwap && recentSwap.ids.includes(r.id);

                            return (
                                <div key={r.id} className="relative w-full h-16 border-b border-dashed border-[#dcd6c0]/60 dark:border-[#3a3525]/60 flex items-center bg-white/30 dark:bg-black/10 backdrop-blur-[1px]">
                                    <div className="absolute left-4 text-[10px] font-mono text-[#9c8749] opacity-50">{i + 1}번 레인</div>

                                    {isMuddy && <MudOverlay active={true} />}

                                    {trashEvent && <div style={{ left: `${trashEvent.xPercent}%` }} className="absolute h-full w-10">
                                        <TrashCanItem active={true} triggered={trashEvent.triggered} effectType={trashEvent.result} />
                                    </div>}

                                    <div
                                        className={`absolute z-10 group ${isSwapped ? 'scale-110' : ''}`}
                                        style={{ left: `${Math.min(95, positions[r.id] || 0)}%` }}
                                    >
                                        <div className="relative">
                                            {isStunned && <StunnedBadge active={true} />}
                                            {isMuddy && <SlowingBadge active={true} />}

                                            <div className={`size-12 rounded-full border-2 border-primary bg-background-light dark:bg-background-dark overflow-hidden relative shadow-[0_0_15px_rgba(244,192,37,0.6)] ${isStunned ? 'grayscale' : ''} ${isMuddy ? 'sepia' : ''}`}>
                                                <div className="w-full h-full bg-center bg-cover" style={{ backgroundImage: `url('${r.avatar}')` }}></div>
                                                {isSwapped && <SwapEffectOverlay active={true} />}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div className="absolute top-0 bottom-0 right-10 w-4 bg-[url('https://www.transparenttextures.com/patterns/checkerboard.png')] opacity-30 border-l border-white/20"></div>
                        <div className="absolute bottom-4 right-12 text-xs font-bold text-[#9c8749] dark:text-[#d4c59a]">FINISH</div>
                    </div>
                </div>
            </section>

            <section className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
                {/* 리더보드 */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">trophy</span> 실시간 순위
                    </h3>
                    <div className="flex flex-col gap-3">
                        {leaderBoard.slice(0, 5).map((r, i) => (
                            <div key={r.id} className="flex items-center gap-4 bg-white dark:bg-[#2a261a] p-3 rounded-xl border-l-4 border-primary shadow-sm">
                                <div className="font-black text-2xl text-primary w-6 text-center">{i + 1}</div>
                                <div className="size-10 rounded-full bg-center bg-cover border" style={{ backgroundImage: `url('${r.avatar}')` }}></div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-base truncate">{r.name}</p>
                                    <p className="text-xs text-[#9c8749]">
                                        {positions[r.id] >= 100 ? '🏁 골인!' : `${Math.round(positions[r.id])}%`}
                                        {raccoonEffects[r.id]?.type === 'STUN' && <span className="text-red-500 font-bold ml-2">(🍭 유혹됨)</span>}
                                        {raccoonEffects[r.id]?.type === 'MUD' && <span className="text-amber-700 font-bold ml-2">(💩 느려짐)</span>}
                                        {raccoonEffects[r.id]?.type === 'BOOST' && <span className="text-blue-500 font-bold ml-2">(🚀 가속중)</span>}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 해설창 */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">analytics</span> 경기 통계
                    </h3>
                    <div className="flex-1 bg-white dark:bg-[#2a261a] rounded-xl border border-[#e8e2ce] dark:border-[#3a3525] shadow-sm p-5 flex flex-col gap-3 min-h-[250px] max-h-[350px] overflow-hidden">
                        <div className="flex items-center gap-2 mb-2 sticky top-0 bg-white dark:bg-[#2a261a] z-10 pb-2 border-b border-gray-100">
                            <span className="size-2 rounded-full bg-red-500 animate-pulse"></span>
                            <h4 className="text-sm font-bold uppercase text-[#9c8749]">라이브 브리핑</h4>
                        </div>
                        <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
                            {commentary.length === 0 && <p className="text-sm text-gray-400">경기가 시작되었습니다! 아직 특이사항은 없습니다.</p>}
                            {commentary.map((c) => (
                                <div key={c.id} className="flex gap-3 items-start border-b border-gray-50 dark:border-gray-800 pb-2 last:border-0">
                                    <span className="text-xs font-mono text-gray-400 mt-0.5 min-w-[60px]">{c.time}</span>
                                    <p className="text-sm leading-relaxed text-text-main dark:text-gray-300 font-medium">
                                        {c.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
