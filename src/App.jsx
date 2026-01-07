import { useState } from 'react';
import MainScreen from './components/MainScreen';
import RaceScreen from './components/RaceScreen';
import ResultModal from './components/ResultModal';

const INITIAL_AVATARS = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAKI5t4-A_fIKxZ7Mv5Md08XmpCh9i0qbOQd7W-UdM9kqhUiEQ5rRGWTlgCDZacMGnMXA__cn2SJOueADc56PdwnNRgU6ZdvrLtm9mBPeyFei-dc9X88PEQK9_aQPnOkclLj5aiSg2cGM3nWjDPmHSFYmjqH6lKEM8K9vZMsWOhD-9Z7LsTMy1G8AVC7xvhuJ7y0uU_v5wbFK_KWYHu15cdTnQzwGSvVf1hR0oO7SZ06FumqlSl96CBResHc3Xk4Yvu15siNxqjuHc",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA_EsyyS0PdAGkWbnlakdkWBaghoKy9_RDlHpfOkz0CSVCKKlUdwqbrN3-t-tlM2qjjUsmkfpGr4f_ku60IDmoUNoA2_KME6h4As6AqF0T9hrLShXeXNaaoJmbDVWvmRBz2oESV3wd5QtD_lqzgm2N14gHUP1IfRsdlKFqQ1FSS9D-RQ54dX4kRha-KL01_OV5lTNianYTpTsS71BRUiTnEmDVbkuA8VnI2f40h6sfeiAWGCcqkktmaOryzKwgw0Yhd7EcBr7sOlj4",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCuDb85b5wt0WdtnU_FM_XYrx-9qj55f78EtccBb54GL1S_-V560lTM4ZdNq0oXkDhkN3Rw_4KQEMYsKRUMZw68CuNm0fr4E7JQmufqLTKbB8ghMRybWxZuDlgCfvN-YpHwJcxB1obcwX9FPNiEZ0VDU_jkCCR_m29xjaKd5A0LBxrp5nt8lENQWKGUMaFgXBFbRlzCcE5FPVR7kLcvjSjhmW27y3tUzEbxF02jUrYKScfQa0KNTmhOG2LYFmRgw_7ReuBvatHicLE",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBEH8JHj1X2PVK5q-qDx1Kn0UNwvVW5N463_o8Jc4TmLHUiKSbSRH3cpRwqtqu-y3T7cu1AFhsKNjrG8xMJtKy_rsSie-rVnHXQqnWutAz9R0T9MYM3YFIt6fX0Y1Jpj0sVAsdT6YTF4-VhUWHJIBZGGEvhUArFESPH4_KTFcRq9GNGLITqMfL-9_UbAl7Wq9tjOrNxYbeAh_yYaDYnwp0qc9iej6c5e8LIF3q3NamqFqWS8CrMSAlYhD_OGNEYSGU6IvGvSxP2KAs",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA-UECRYVaeIi-B5MTrNqXJFmY3tr6Hk3sU3VLXoCLF1cnRo9UdgacI1eqgqSUTO12xwwP9ZxVHfumq3L65kwOR_ImgRYyj1VWx1dj6PGGv0IuSL_XA4Qj5d5k1kYMzWvSsh3OKt0Ub5gPemB5rFQuaD4mSUVJmfSUjrdpD39p0EAMVfZtpv2R8cL0FOxkBDkLmEPmHZY2XIdb0WJfw0v-MEklXSNrrV6-JpKc1TGe1jek6hA5nE0RDulmigf27w2zc2VkIi8VGSGc", // from race.html
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAKM5HMQloahE5bjgwIRcg9P7gBejdKLtJwjmpSW6TKQePZ5CdApmcpNHKbuz7cx9yc30_aat-xtc036Thh6ZUroIGTQ7dKJA3FmNzMzDnk_HmmHueMyPg8u1taHX0jzqq45N1Ue1v3iuDKeCc3oZC_qLM2Jjks42uIaaLnHdMw7BgMDNe76V2agC2_PT1BA9S07WHeeehJ72u3kQ9gTbM1sPnewkjyCS59NWGfp8RZU44DOatSow9c_I3_w6xzPij8rqaYsRCs6tw"
];

function getRandomAvatar() {
    return INITIAL_AVATARS[Math.floor(Math.random() * INITIAL_AVATARS.length)];
}

export default function App() {
    const [gameState, setGameState] = useState('SETUP'); // SETUP, RACING, FINISHED
    const [showResultModal, setShowResultModal] = useState(false);

    const [raccoons, setRaccoons] = useState([
        { id: 1, name: "번개 라쿤", avatar: INITIAL_AVATARS[0] },
        { id: 2, name: "도넛 요정", avatar: INITIAL_AVATARS[1] },
        { id: 3, name: "잠꾸러기", avatar: INITIAL_AVATARS[2] }
    ]);

    const [results, setResults] = useState([]);

    const addRaccoon = () => {
        if (raccoons.length >= 8) return;
        const newId = Math.max(...raccoons.map(r => r.id), 0) + 1;
        setRaccoons([...raccoons, {
            id: newId,
            name: `라쿤 ${newId}`,
            avatar: getRandomAvatar()
        }]);
    };

    const removeRaccoon = (id) => {
        if (raccoons.length <= 2) return; // Minimum 2 limit?
        setRaccoons(raccoons.filter(r => r.id !== id));
    };

    const updateRaccoonName = (id, newName) => {
        setRaccoons(prev => prev.map(r => r.id === id ? { ...r, name: newName } : r));
    };

    const startRace = () => {
        setGameState('RACING');
        setResults([]);
        setShowResultModal(false);
    };

    const handleRaceFinish = (finishOrder) => {
        setResults(finishOrder);
        setGameState('FINISHED');
        setShowResultModal(true);
    };

    const restartGame = () => {
        setGameState('SETUP');
        setResults([]);
        setShowResultModal(false);
    };

    const closeResultModal = () => {
        setShowResultModal(false);
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-main dark:text-white font-display">
            {gameState === 'SETUP' && (
                <MainScreen
                    raccoons={raccoons}
                    onAddRaccoon={addRaccoon}
                    onRemoveRaccoon={removeRaccoon}
                    onUpdateRaccoonName={updateRaccoonName}
                    onStartRace={startRace}
                />
            )}

            {(gameState === 'RACING' || gameState === 'FINISHED') && (
                <>
                    <RaceScreen
                        raccoons={raccoons}
                        onRaceFinish={handleRaceFinish}
                        onRestart={restartGame}
                    />
                    {gameState === 'FINISHED' && showResultModal && (
                        <ResultModal
                            results={results}
                            onRestart={restartGame}
                            onClose={closeResultModal}
                        />
                    )}
                </>
            )}
        </div>
    );
}
