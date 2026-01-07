import React from 'react';

export default function MainScreen({ raccoons, onAddRaccoon, onRemoveRaccoon, onUpdateRaccoonName, onStartRace }) {

    // Default raccoon avatars to cycle through or pick random if not modifying existing array logic too much
    // For now assuming parent handles the logic of what image to give to new raccoons.

    const handleRandomNames = () => {
        const adjectives = [
            "용감한", "배고픈", "빠른", "졸린", "똑똑한", "엉뚱한", "날쌘", "귀여운",
            "솜사탕 씻은", "쓰레기 뒤지는", "뻔뻔한", "줄무늬 꼬리", "발바닥 촉촉한",
            "세상만사 귀찮은", "야심 가득한", "손재주 좋은", "포동포동한", "밤눈 밝은"
        ];

        const names = [
            "라쿤", "너구리", "대장", "번개", "초코", "도둑", "꼬리", "빵둥이", "질주",
            "탱크", "너굴맨", "마스크맨", "로켓", "간식 털이범", "폭주기관차", "너구리 킹",
            "프로 훼방꾼", "알바생", "악마", "터보", "금쪽이"
        ];

        // 1. 모든 가능한 조합 생성
        let combinedNames = [];
        adjectives.forEach(adj => {
            names.forEach(name => {
                combinedNames.push(`${adj} ${name}`);
            });
        });

        // 2. 피셔-예이츠 셔플 (Fisher-Yates Shuffle)로 랜덤 섞기
        for (let i = combinedNames.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [combinedNames[i], combinedNames[j]] = [combinedNames[j], combinedNames[i]];
        }

        // 3. 섞인 이름 목록에서 앞에서부터 순서대로 할당 (중복 원천 차단)
        raccoons.forEach((raccoon, index) => {
            if (index < combinedNames.length) {
                onUpdateRaccoonName(raccoon.id, combinedNames[index]);
            }
        });
    };

    return (
        <div className="layout-container flex h-full grow flex-col w-full">
            <header className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-border-light bg-background-light/80 backdrop-blur-md px-6 py-4 dark:border-white/10 dark:bg-background-dark/80 lg:px-20">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/30 text-primary-dark dark:text-primary">
                        <span className="material-symbols-outlined text-[24px]">flag</span>
                    </div>
                    <h2 className="text-xl font-bold leading-tight tracking-tight text-text-main dark:text-white">Raccoon Racing</h2>
                </div>
                <div className="flex gap-3">
                    {/* <button className="flex h-10 min-w-[84px] cursor-pointer items-center justify-center gap-2 rounded-full bg-primary/20 px-4 text-sm font-bold text-text-main transition-colors hover:bg-primary/40 dark:bg-white/5 dark:text-white dark:hover:bg-white/10">
                        <span className="material-symbols-outlined text-[20px]">settings</span>
                        <span className="hidden sm:inline">설정</span>
                    </button>
                    <button className="flex h-10 min-w-[84px] cursor-pointer items-center justify-center rounded-full bg-text-main px-4 text-sm font-bold text-white transition-transform hover:scale-105 dark:bg-white dark:text-black">
                        로그인
                    </button> */}
                </div>
            </header>

            <main className="flex flex-1 flex-col items-center justify-start px-4 py-8 md:px-10 lg:px-40 w-full mb-20">
                <div className="flex w-full max-w-[960px] flex-1 flex-col gap-8">
                    <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
                        <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold text-amber-700 dark:text-primary">
                            🏆 경기 준비 단계
                        </div>
                        <div className="flex flex-col gap-2">
                            <h1 className="text-3xl font-black leading-tight tracking-tight md:text-5xl">오늘의 선수는 누구인가요?</h1>
                            <p className="text-lg font-medium text-text-sub dark:text-gray-400">라쿤들에게 멋진 이름을 지어주고 경주를 시작해보세요!</p>
                        </div>
                    </div>

                    <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {raccoons.map((raccoon, index) => (
                            <div key={raccoon.id} className="group relative flex flex-col items-center rounded-[2rem] border border-border-light bg-white p-5 shadow-soft transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow dark:border-white/10 dark:bg-white/5">
                                <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100">
                                    <button
                                        onClick={() => onRemoveRaccoon(raccoon.id)}
                                        className="flex size-8 items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">close</span>
                                    </button>
                                </div>
                                <div className={`mb-4 aspect-square w-32 overflow-hidden rounded-full border-4 ${index % 3 === 0 ? 'border-primary/20' : index % 3 === 1 ? 'border-orange-200' : 'border-blue-200'
                                    } bg-gray-100 shadow-inner md:w-full`}>
                                    <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url("${raccoon.avatar}")` }}></div>
                                </div>
                                <div className="w-full">
                                    <label className="mb-2 block text-center text-sm font-bold text-text-sub dark:text-gray-400">PLAYER {index + 1}</label>
                                    <div className="relative">
                                        <input
                                            className="h-12 w-full rounded-xl border border-border-light bg-background-light text-center font-bold text-text-main placeholder:text-text-sub/50 focus:border-primary focus:ring-1 focus:ring-primary dark:border-white/10 dark:bg-black/20 dark:text-white"
                                            type="text"
                                            value={raccoon.name}
                                            onChange={(e) => onUpdateRaccoonName(raccoon.id, e.target.value)}
                                        />
                                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[18px] text-text-sub">edit</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {raccoons.length < 8 && (
                            <button
                                onClick={onAddRaccoon}
                                className="group flex flex-col items-center justify-center gap-4 rounded-[2rem] border-2 border-dashed border-primary/30 bg-primary/5 p-5 transition-all hover:bg-primary/10 hover:border-primary dark:border-primary/50 dark:bg-primary/10 dark:hover:bg-primary/20"
                            >
                                <div className="flex aspect-square w-24 items-center justify-center rounded-full bg-white shadow-sm transition-transform group-hover:scale-110 dark:bg-white/10">
                                    <span className="material-symbols-outlined text-[40px] text-primary">add</span>
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-text-main dark:text-white">라쿤 추가하기</p>
                                    <p className="text-sm text-text-sub dark:text-primary/80">최대 8마리까지</p>
                                </div>
                            </button>
                        )}
                    </div>

                    <div className="sticky bottom-6 mt-8 flex w-full flex-col items-center justify-center gap-4 md:flex-row z-40">
                        <button
                            onClick={onStartRace}
                            disabled={raccoons.length < 2}
                            className={`flex h-14 w-full min-w-[200px] max-w-[300px] transform cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-8 text-base font-bold text-text-main shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:bg-[#F59E0B] hover:shadow-primary/40 active:scale-95 ${raccoons.length < 2 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <span>경주 시작하기</span>
                            <span className="material-symbols-outlined">sports_score</span>
                        </button>
                        <button onClick={handleRandomNames} className="flex h-14 w-full min-w-[160px] max-w-[200px] cursor-pointer items-center justify-center gap-2 rounded-full border border-border-light bg-white px-6 text-base font-bold text-text-main transition-colors hover:bg-amber-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10">
                            <span className="material-symbols-outlined">casino</span>
                            <span>랜덤 이름</span>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
