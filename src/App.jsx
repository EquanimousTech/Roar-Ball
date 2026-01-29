import { Canvas } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import {
    GAME_DURATION,
    BALL_POOL_SIZE,
    MILESTONE_THRESHOLDS,
} from "./constants/gameConstants";
import { getStreakTier } from "./utils/streakUtils";
import GameScene from "./components/three/GameScene";
import LoadingScreen from "./components/ui/LoadingScreen";
import NameInputScreen from "./components/ui/NameInputScreen";
import StartScreen from "./components/ui/StartScreen";
import GameplayUI from "./components/ui/GameplayUI";
import StreakDisplay from "./components/ui/StreakDisplay";
import MilestoneCelebration from "./components/ui/MilestoneCelebration";
import GameOverOverlay from "./components/ui/GameOverOverlay";
import "./styles/animations.css";

// Game States: "loading" -> "nameInput" -> "start" -> "playing" -> "ended"

export default function App() {
    // Game flow states
    const [gameState, setGameState] = useState("loading");
    const [playerName, setPlayerName] = useState("");

    // Gameplay states
    const [throwData, setThrowData] = useState(null);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [lastPoints, setLastPoints] = useState(0);
    const [showPoints, setShowPoints] = useState(false);
    const [showActiveBall, setShowActiveBall] = useState(true);
    const [scoreAnimationTrigger, setScoreAnimationTrigger] = useState(0);


    // Streak state
    const [currentStreak, setCurrentStreak] = useState(0);
    const [bestStreak, setBestStreak] = useState(0);
    const [showStreakLost, setShowStreakLost] = useState(false);
    const [lostStreak, setLostStreak] = useState(0);
    const [currentMilestone, setCurrentMilestone] = useState(null);

    // Refs
    const nextBallId = useRef(0);
    const activeBalls = useRef(new Set());
    const startRef = useRef({ x: 0, y: 0, time: 0 });
    const isDragging = useRef(false);
    const timerRef = useRef(null);
    const lastMilestoneRef = useRef(0);

    // Check for saved player name on mount
    useEffect(() => {
        const savedName = localStorage.getItem("basketball_player_name");
        if (savedName) {
            setPlayerName(savedName);
        }
    }, []);

    // Handle loading complete
    const handleLoadingComplete = () => {
        // const savedName = localStorage.getItem("basketball_player_name");
        // if (savedName) {
        //     setPlayerName(savedName);
        //     setGameState("start");
        // } else {
        //     setGameState("nameInput");
        // }
        setGameState("nameInput");
    };

    // Handle name submit
    const handleNameSubmit = (name) => {
        setPlayerName(name);
        // setGameState("start");
        setGameState("playing");
    };

    // Game timer
    useEffect(() => {
        if (gameState === "playing") {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        setGameState("ended");
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [gameState]);

    // Check for milestones
    useEffect(() => {
        if (currentStreak > lastMilestoneRef.current) {
            const hitMilestone = MILESTONE_THRESHOLDS.find(
                (m) => currentStreak === m && m > lastMilestoneRef.current
            );
            if (hitMilestone) {
                const tier = getStreakTier(hitMilestone);
                setCurrentMilestone({
                    ...tier,
                    streak: hitMilestone,
                });
                lastMilestoneRef.current = hitMilestone;
            }
        }
    }, [currentStreak]);

    const startGame = () => {
        setScore(0);
        setTimeLeft(GAME_DURATION);
        setGameState("playing");
        setThrowData(null);
        setLastPoints(0);
        setShowPoints(false);
        setShowActiveBall(true);
        setCurrentStreak(0);
        setBestStreak(0);
        setShowStreakLost(false);
        setLostStreak(0);
        setCurrentMilestone(null);
        lastMilestoneRef.current = 0;
        nextBallId.current = 0;
        activeBalls.current.clear();
    };

    const handleScore = (ballId) => {
        if (gameState !== "playing") return;

        const newStreak = currentStreak + 1;
        setCurrentStreak(newStreak);

        if (newStreak > bestStreak) {
            setBestStreak(newStreak);
        }

        const tier = getStreakTier(newStreak);
        const points = Math.floor(2 * tier.multiplier);

        setScore((prev) => prev + points);
        setLastPoints(points);
        setShowPoints(true);
        setShowStreakLost(false);
        setScoreAnimationTrigger(prev => prev + 1);

        setTimeout(() => {
            setShowPoints(false);
        }, 1500);
    };

    const handleBallStopped = (ballId, reason) => {
        if (gameState !== "playing") return;

        activeBalls.current.delete(ballId);

        if (reason === "missed" && currentStreak >= 2) {
            setLostStreak(currentStreak);
            setShowStreakLost(true);
            setCurrentStreak(0);
            lastMilestoneRef.current = 0;

            setTimeout(() => {
                setShowStreakLost(false);
            }, 2000);
        } else if (reason === "missed") {
            setCurrentStreak(0);
            lastMilestoneRef.current = 0;
        }
    };

    const handlePointerDown = (e) => {
        if (gameState !== "playing") return;
        startRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
        isDragging.current = true;
    };

    const handlePointerUp = (e) => {
        if (gameState !== "playing") return;
        if (!isDragging.current) return;
        isDragging.current = false;

        if (activeBalls.current.size >= BALL_POOL_SIZE) {
            return;
        }

        const dx = e.clientX - startRef.current.x;
        const dy = startRef.current.y - e.clientY;

        let vx, vy, vz;

        if (Math.abs(dx) < 30 && Math.abs(dy) < 30) {
            vx = 0;
            vy = 8;
            vz = -10;
        } else if (dy > 20) {
            const power = Math.min(Math.sqrt(dx * dx + dy * dy) / 200, 1.5);
            vx = (dx / 100) * power;
            vy = 6 + power * 5;
            vz = -8 - power * 4;
        } else {
            return;
        }

        const ballId = nextBallId.current % BALL_POOL_SIZE;
        nextBallId.current++;

        activeBalls.current.add(ballId);

        setShowActiveBall(false);
        setTimeout(() => {
            setShowActiveBall(true);
        }, 100);

        setThrowData({
            x: vx,
            y: vy,
            z: vz,
            ballId: ballId,
            timestamp: Date.now(),
        });
    };

    return (
        <div
            className="w-screen h-screen m-0 p-0 overflow-hidden touch-none select-none relative"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
        >
            {/* Loading Screen */}
            {gameState === "loading" && (
                <LoadingScreen onLoadingComplete={handleLoadingComplete} />
            )}

            {/* Name Input Screen */}
            {gameState === "nameInput" && (
                <NameInputScreen
                    onSubmit={handleNameSubmit}
                    savedName={playerName}
                />
            )}

            {/* Start Screen */}
            {gameState === "start" && (
                <StartScreen onStart={startGame} playerName={playerName} />
            )}

            {/* Background for gameplay */}
            {(gameState === "playing" || gameState === "ended") && (
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: "url('/bgNew2.png')",
                        backgroundColor: "white",
                    }}
                />
            )}

            {/* 3D Canvas - always render but only interactive during gameplay */}
            <Canvas
                camera={{ position: [0, 2, 7], fov: 55 }}
                shadows
                className="w-full h-full relative z-1"
                style={{
                    background: "transparent",
                    visibility: gameState === "loading" || gameState === "nameInput" ? "hidden" : "visible",
                }}
                gl={{
                    antialias: true,
                    powerPreference: "high-performance"
                }}
            >
                <ambientLight intensity={0.6} />
                <directionalLight position={[5, 10, 5]} intensity={1.0} castShadow />
                <pointLight position={[-3, 3, 3]} intensity={0.4} color="#ffaa66" />
                <pointLight position={[0, 5, -3]} intensity={0.3} color="#6644ff" />

                <GameScene
                    throwData={throwData}
                    onScore={handleScore}
                    onBallStopped={handleBallStopped}
                    gameActive={gameState === "playing"}
                    showActiveBall={showActiveBall}
                    streak={currentStreak}
                    scoreAnimation={scoreAnimationTrigger}  // Add this
                />
            </Canvas>

            {/* Gameplay UI */}
            {gameState === "playing" && (
                <>
                    <GameplayUI
                        score={score}
                        timeLeft={timeLeft}
                        lastPoints={lastPoints}
                        showPoints={showPoints}
                        streak={currentStreak}
                        bestStreak={bestStreak}
                        playerName={playerName}
                    />
                    {/* <StreakDisplay
                        streak={currentStreak}
                        bestStreak={bestStreak}
                        showStreakLost={showStreakLost}
                        lostStreak={lostStreak}
                    /> */}
                    <MilestoneCelebration
                        milestone={currentMilestone}
                        onComplete={() => setCurrentMilestone(null)}
                        showPoints={showPoints}
                    />
                </>
            )}

            {/* Game Over with Leaderboard */}
            {gameState === "ended" && (
                <GameOverOverlay
                    score={score}
                    bestStreak={bestStreak}
                    playerName={playerName}
                    onPlayAgain={startGame}
                />
            )}
        </div>
    );
}